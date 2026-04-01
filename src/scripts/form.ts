import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface FormData {
  name: string;
  email: string;
  phone: string;
  lovename: string;
  reasons: string[];
  motivation: string;
}

function buildPdfElement(data: FormData): HTMLDivElement {
  const escH = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const nl2br = (s: string) => s.replace(/\n/g, '<br>');

  const loveRow = data.lovename
    ? `<div class="pr">&#9829; <strong>Mīlvārds:</strong> ${escH(data.lovename)}</div>`
    : '';
  const reasonRows = data.reasons
    .map(r => `<div class="pr">&#9829; ${escH(r)}</div>`)
    .join('');

  const el = document.createElement('div');
  // Fixed 794×1123px = A4 at 96 dpi — exactly one page
  el.style.cssText = [
    'width:794px', 'height:1123px', 'overflow:hidden',
    'position:fixed', 'top:0', 'left:0',
    'z-index:-9999', 'opacity:0', 'pointer-events:none',
  ].join(';');

  el.innerHTML = `
    <style>
      #pdfwrap { width:794px; height:1123px; overflow:hidden; background:#fff;
                 font-family:Arial,sans-serif; font-size:14px; color:#2a0010;
                 box-sizing:border-box; position:relative; text-align:left; }
      .ph { background:linear-gradient(135deg,#ff6699,#ff3366);
            color:#fff; padding:30px 48px 24px; text-align:center; }
      .ph h1 { margin:0 0 10px; font-size:22px; letter-spacing:1px; }
      .ph p  { margin:4px 0; font-size:12px; line-height:1.6; opacity:.95; }
      .stripe { height:6px; background:repeating-linear-gradient(
                  90deg,#ff3366 0,#ff3366 12px,#ffb3cc 12px,#ffb3cc 24px); }
      .hrow { text-align:center; color:#ff6699; font-size:22px;
              letter-spacing:6px; padding:12px 48px 6px; }
      .body { padding:6px 48px 0; text-align:left; }
      .stitle { font-size:10px; text-transform:uppercase; letter-spacing:1.5px;
                color:#ff3366; border-bottom:2px solid #ffb3cc; padding-bottom:4px;
                margin:16px 0 10px; font-weight:bold; }
      .pr { margin:5px 0 5px 20px; font-size:13px; line-height:1.5; }
      .pr strong { color:#cc3366; display:inline-block; min-width:110px; }
      .motiv { margin:6px 0 0 20px; padding:12px 16px; background:#fff0f5;
               border-left:4px solid #ff6699; border-radius:4px; font-style:italic;
               font-size:13px; line-height:1.6; }
      .pfoot { position:absolute; bottom:0; left:0; right:0;
               background:linear-gradient(135deg,#ff6699,#ff3366);
               color:#fff; text-align:center; padding:14px 48px;
               font-size:13px; font-weight:bold; letter-spacing:1px; }
    </style>
    <div id="pdfwrap">
      <div class="ph">
        <h1>&#9829; Tava mīla manā kuģī &#9829;</h1>
        <p>Šis dokuments jāizdrukā un jānosūta uz adresi:</p>
        <p><strong>Rīga, Mīlestības aleja 69, LV-1067</strong></p>
        <p style="margin-top:8px;">Vai nosūtīt elektroniski uz: <strong>purauska.p@inbox.lv</strong></p>
      </div>
      <div class="stripe"></div>
      <div class="hrow">&#9829; &#9829; &#9829; &#9829; &#9829; &#9829; &#9829;</div>
      <div class="body">
        <div class="stitle">Personas dati</div>
        <div class="pr">&#9829; <strong>Vārds:</strong> ${escH(data.name)}</div>
        ${loveRow}
        <div class="pr">&#9829; <strong>E-pasts:</strong> ${escH(data.email)}</div>
        <div class="pr">&#9829; <strong>Numurs:</strong> ${escH(data.phone)}</div>
        <div class="stitle">Pieteikuma iemesls</div>
        ${reasonRows}
        <div class="stitle">Motivācija</div>
        <div class="motiv">${nl2br(escH(data.motivation)) || '<em>Nav norādīta</em>'}</div>
      </div>
      <div class="hrow" style="position:absolute;bottom:58px;left:0;right:0;">
        &#9829; &#9829; &#9829; &#9829; &#9829; &#9829; &#9829;
      </div>
      <div class="pfoot">
        &#9829; Tava mīla manā kuģī &#9829; &copy; ${new Date().getFullYear()} SIA PP
      </div>
    </div>`;

  return el;
}

async function downloadPdf(data: FormData, btnEl: HTMLButtonElement): Promise<void> {
  const original = btnEl.textContent ?? '';
  btnEl.textContent = 'Sagatavo PDF…';
  btnEl.disabled = true;

  const el = buildPdfElement(data);
  document.body.appendChild(el);

  try {
    const canvas = await html2canvas(el.querySelector<HTMLElement>('#pdfwrap')!, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      width: 794,
      height: 1123,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
    pdf.save('pieteikums-mila.pdf');
  } finally {
    document.body.removeChild(el);
    btnEl.textContent = original;
    btnEl.disabled = false;
  }
}

export function initRegistrationForm(): void {
  const openBtn  = document.getElementById('open-registration')  as HTMLButtonElement | null;
  const modal    = document.getElementById('registration-modal') as HTMLDivElement    | null;
  const closeBtn = document.getElementById('close-registration') as HTMLButtonElement | null;
  const submitBtn = document.getElementById('submit-registration') as HTMLButtonElement | null;

  if (!openBtn || !modal || !closeBtn || !submitBtn) return;

  // ── LocalStorage ──────────────────────────────────────────────────────────
  const LS_KEY = 'milakas-pasazieres-form';
  const textFields = ['name', 'email', 'phone', 'lovename', 'motivation'];

  function saveToStorage(): void {
    try {
      const data: Record<string, string | string[]> = {};
      for (const id of textFields) {
        const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null;
        if (el) data[id] = el.value;
      }
      data['reasons'] = Array.from(
        document.querySelectorAll<HTMLInputElement>('input[name="reason"]:checked'),
      ).map(el => el.value);
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch { /* storage unavailable */ }
  }

  function loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const data: Record<string, string | string[]> = JSON.parse(raw);
      for (const id of textFields) {
        const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null;
        if (el && typeof data[id] === 'string') el.value = data[id] as string;
      }
      const reasons = data['reasons'];
      if (Array.isArray(reasons)) {
        document.querySelectorAll<HTMLInputElement>('input[name="reason"]').forEach(cb => {
          cb.checked = reasons.includes(cb.value);
        });
      }
    } catch { /* storage unavailable or corrupt */ }
  }

  function clearStorage(): void {
    try { localStorage.removeItem(LS_KEY); } catch { /* ignore */ }
  }

  // Attach save listeners directly to each field
  function attachFieldListeners(): void {
    for (const id of textFields) {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input',  saveToStorage);
        el.addEventListener('change', saveToStorage);
      }
    }
    document.querySelectorAll<HTMLInputElement>('input[name="reason"]').forEach(cb => {
      cb.addEventListener('change', saveToStorage);
    });
  }

  // Restore on init (fields are in DOM even when modal is hidden)
  loadFromStorage();
  attachFieldListeners();

  // ── Modal ─────────────────────────────────────────────────────────────────
  function openModal(): void {
    loadFromStorage(); // restore saved values every time the modal opens
    modal!.classList.add('show');
    modal!.setAttribute('aria-hidden', 'false');
    setTimeout(() => (document.getElementById('name') as HTMLInputElement | null)?.focus(), 50);
  }

  function closeModal(save = true): void {
    if (save) saveToStorage(); // persist current state on every close
    modal!.classList.remove('show');
    modal!.setAttribute('aria-hidden', 'true');
  }

  // ── Validation ────────────────────────────────────────────────────────────
  function clearErrors(): void {
    document.querySelectorAll<HTMLElement>('.error').forEach(el => (el.textContent = ''));
    document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea')
      .forEach(el => el.classList.remove('invalid'));
  }

  function validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone: string): boolean {
    return phone.replace(/\D/g, '').length >= 6;
  }

  function getCheckedReasons(): string[] {
    return Array.from(
      document.querySelectorAll<HTMLInputElement>('input[name="reason"]:checked'),
    ).map(el => el.value);
  }

  function showError(fieldId: string, msg: string): void {
    const err = document.getElementById('error-' + fieldId);
    if (err) err.textContent = msg;
    const field = document.getElementById(fieldId);
    if (field) field.classList.add('invalid');
  }

  function validateForm(): boolean {
    clearErrors();
    let ok = true;
    const name  = (document.getElementById('name')  as HTMLInputElement).value.trim();
    const email = (document.getElementById('email') as HTMLInputElement).value.trim();
    const phone = (document.getElementById('phone') as HTMLInputElement).value.trim();

    if (!name)  { showError('name',  'Lūdzu ievadiet vārdu.'); ok = false; }
    if (!email) { showError('email', 'Lūdzu ievadiet e-pastu.'); ok = false; }
    else if (!validateEmail(email)) { showError('email', 'Lūdzu ievadiet derīgu e-pasta adresi.'); ok = false; }
    if (!phone) { showError('phone', 'Lūdzu ievadiet telefonu.'); ok = false; }
    else if (!validatePhone(phone)) { showError('phone', 'Lūdzu ievadiet derīgu telefona numuru.'); ok = false; }
    if (getCheckedReasons().length === 0) { showError('reason', 'Lūdzu izvēlieties vismaz vienu iemeslu.'); ok = false; }

    return ok;
  }

  // ── Event bindings ────────────────────────────────────────────────────────
  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', () => closeModal());
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  submitBtn.addEventListener('click', () => {
    if (!validateForm()) return;

    const data: FormData = {
      name:       (document.getElementById('name')       as HTMLInputElement).value.trim(),
      email:      (document.getElementById('email')      as HTMLInputElement).value.trim(),
      phone:      (document.getElementById('phone')      as HTMLInputElement).value.trim(),
      lovename:   (document.getElementById('lovename')   as HTMLInputElement).value.trim(),
      reasons:    getCheckedReasons(),
      motivation: (document.getElementById('motivation') as HTMLTextAreaElement).value.trim(),
    };

    downloadPdf(data, submitBtn)
      .then(() => { clearStorage(); closeModal(false); })
      .catch(err => { console.error(err); alert('Neizdevās izveidot PDF. Lūdzu mēģiniet vēlreiz.'); });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal!.classList.contains('show')) closeModal();
  });
}


