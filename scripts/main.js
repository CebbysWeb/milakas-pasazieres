"use strict";
const TIMEOUT = 150;
const TESTS = 5;
const CANVAS = vitterns.getCanvas();
CANVAS.resize();
class VitternsEvent {
    text;
    start = 0;
    end = 0;
    match = false;
    constructor(text) {
        this.text = text;
    }
}
const dictionary = [];
const results = [];
function startGame() {
    const logger = new Logger("vitterns", Level.DEBUG);
    logger.trace("trace");
    logger.debug("debug");
    logger.info("info");
    logger.warning("warning");
    logger.error("error");
    logger.fatal("fatal");
    vitterns.getButtonById('start-button').disabled = true;
    const canvasDiv = vitterns.getTypedElementById(HTMLDivElement, 'canvas-container');
    canvasDiv.style.display = 'flex';
    const scoreDiv = vitterns.getTypedElementById(HTMLDivElement, 'score-container');
    scoreDiv.style.display = 'none';
    if (dictionary.length < TESTS) {
        while (dictionary.length > 0) {
            dictionary.pop();
        }
        dictionary.push(...[
            "Duane", "Potts", "Markus", "Zhang", "Gaston", "Serrano", "Ashley", "Mason", "Meagan",
            "Dougherty", "Ramona", "Russo", "Vincent", "Cruz", "Frederick", "Warren", "Maricela",
            "Allen", "Dan", "Webster", "Brendon", "Singh", "Luisa", "King", "Milagros", "Vincent",
            "Melinda", "Jordan", "Ola", "Hinton", "Patricia", "Valdez", "Forest", "Nolan",
            "Harley", "Banks", "Vernon", "Abbott", "Chrystal", "Ali", "Damon", "Fritz", "Barbara",
            "Brock", "Jefferey", "Atkins", "Vanessa", "Levine", "Sonja", "Zuniga", "Elma",
            "Brown", "Lara", "Garrett", "Mathew", "Bridges", "Nicholas", "Brooks", "Judith", "Mcbride"
        ]);
    }
    while (results.length > 0) {
        results.pop();
    }
    nextStage();
}
function onGameEnd() {
    vitterns.getButtonById('start-button').disabled = false;
    const canvasDiv = vitterns.getTypedElementById(HTMLDivElement, 'canvas-container');
    canvasDiv.style.display = 'none';
    const scoreDiv = vitterns.getTypedElementById(HTMLDivElement, 'score-container');
    scoreDiv.style.display = 'flex';
    const tableBody = vitterns.document.getElementById('table-body');
    if (tableBody) {
        for (const child of tableBody.children) {
            tableBody.removeChild(child);
        }
        for (const result of results) {
            const row = vitterns.document.createElement('tr');
            const name = vitterns.document.createElement('td');
            name.textContent = result.text;
            row.appendChild(name);
            const time = vitterns.document.createElement('td');
            const number = Math.floor(result.end - result.start);
            time.textContent = `${number}ms`;
            row.appendChild(time);
            const match = vitterns.document.createElement('td');
            if (result.match) {
                match.classList.add('guessed-yes');
                match.textContent = 'Pareizi';
            }
            else {
                match.classList.add('guessed-no');
                match.textContent = 'Nepareizi';
            }
            row.appendChild(match);
            tableBody.appendChild(row);
        }
    }
}
function nextStage() {
    const index = Math.floor(Math.random() * dictionary.length);
    const name = dictionary.splice(index, 1)[0];
    const event = new VitternsEvent(name);
    const offset = 1000;
    CANVAS.clear();
    setTimeout(() => {
        const margin = CANVAS.size().scale(0.2);
        const size = CANVAS.size().scale(0.6);
        const position = new Vector2D(margin.x + Math.random() * size.x, margin.y + Math.random() * size.y);
        CANVAS.text(name, position, 50, Color.rgb8(255, 0, 0));
        event.start = vitterns.milliseconds();
        setTimeout(() => {
            CANVAS.clear();
            event.end = vitterns.milliseconds();
            setTimeout(() => {
                const result = prompt("Ko tu redzēji uz ekrāna?");
                event.match = (result && event.text.toLowerCase() === result?.toLowerCase());
                results.push(event);
                if (results.length === TESTS) {
                    var correct = results.filter((event) => event.match).length;
                    alert(`Jūs atbildējāt pareizi uz ${correct} no ${TESTS} jautājumiem`);
                    console.log(JSON.stringify(results));
                    onGameEnd();
                }
                else {
                    nextStage();
                }
            }, offset);
        }, TIMEOUT);
    }, offset);
}
// Event listeners for buttons
vitterns.getButtonById('start-button').addEventListener('click', startGame);
