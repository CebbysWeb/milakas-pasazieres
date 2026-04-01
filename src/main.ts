import './styles/main.css';
import { initRegistrationForm } from './scripts/form';
import musicUrl from './media/jura-tavs-okeans.mp3';

// Auto-update copyright year
const yearEl = document.getElementById('copy-year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// ── Background music ──────────────────────────────────────────────────────
const audio = new Audio(musicUrl);
audio.loop = true;
audio.volume = 0.4;

const musicBtn = document.getElementById('music-toggle') as HTMLButtonElement | null;
let muted = false;

function setMuted(val: boolean): void {
  muted = val;
  audio.muted = val;
  if (musicBtn) {
    musicBtn.textContent = val ? '🔇' : '♬';
    musicBtn.classList.toggle('muted', val);
    musicBtn.title = val ? 'Ieslēgt mūziku' : 'Izslēgt mūziku';
  }
}

// Try autoplay immediately; browsers may block it until user interaction
audio.play().catch(() => {
  // Blocked by browser — start on first interaction
  const startOnInteraction = () => {
    audio.play().catch(() => { /* still blocked — ignore */ });
    document.removeEventListener('click', startOnInteraction);
    document.removeEventListener('keydown', startOnInteraction);
  };
  document.addEventListener('click', startOnInteraction);
  document.addEventListener('keydown', startOnInteraction);
});

musicBtn?.addEventListener('click', e => {
  e.stopPropagation(); // don't trigger the "start on interaction" listener
  setMuted(!muted);
  // If audio hasn't started yet (blocked), start it now
  if (audio.paused) audio.play().catch(() => { /* ignore */ });
});

// ─────────────────────────────────────────────────────────────────────────
initRegistrationForm();
