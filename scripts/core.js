"use strict";
var VitternsWindowEvent;
(function (VitternsWindowEvent) {
    VitternsWindowEvent["RESIZE"] = "resize";
})(VitternsWindowEvent || (VitternsWindowEvent = {}));
class VitternsDocument {
    document;
    window;
    constructor(document, window) {
        this.document = document;
        this.window = window;
    }
    getTypedElementById(type, id) {
        const element = this.document.getElementById(id);
        if (!element) {
            throw new Error(`Element with id '${id}' not found`);
        }
        if (element instanceof type) {
            return element;
        }
        throw new Error(`Element with id '${id}' is not of type ${type.name}`);
    }
    getButtonById(id) {
        return this.getTypedElementById(HTMLButtonElement, id);
    }
    getCanvas() {
        return new VitternsCanvas(this.getTypedElementById(HTMLCanvasElement, 'canvas'));
    }
    addEventListener(type, listener) {
        this.window.addEventListener(type, listener);
    }
    milliseconds() {
        return window.performance.now();
    }
}
class VitternsCanvas {
    canvas;
    ctx;
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }
    resize() {
        const size = new Vector2D(window.innerWidth, window.innerHeight);
        console.log(`Resizing canvas from '${this.canvas.width}x${this.canvas.height}' to '${size.x}x${size.y}'`);
        let x = Math.max(100, size.x - 100);
        let y = Math.max(100, size.y - 100);
        var min = Math.min(x, y);
        this.canvas.width = min;
        this.canvas.height = min;
        return this;
    }
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        return this;
    }
    fill(color) {
        this.ctx.fillStyle = color.hex();
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        return this;
    }
    rect(position, size, color) {
        this.ctx.fillStyle = color.hex();
        this.ctx.fillRect(position.x, position.y, size.x, size.y);
        return this;
    }
    text(text, position, size, color) {
        this.ctx.font = `${size}px Arial`;
        this.ctx.fillStyle = color.hex();
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(text, position.x, position.y);
        return this;
    }
    size(...parameters) {
        var vector = null;
        if (parameters.length === 0) {
            return new Vector2D(this.canvas.width, this.canvas.height);
        }
        else if (parameters.length === 1) {
            console.log(`Setting size to: ${parameters}`);
            vector = as([(Vector2D)], parameters)((size) => size);
        }
        else if (parameters.length === 2) {
            console.log(`Setting size to: ${parameters}`);
            vector = as([Number, Number], parameters)((width, height) => new Vector2D(width, height));
        }
        else {
            throw new Error(`Not implemented for parameters: ${parameters}`);
        }
        if (!vector) {
            throw new Error(`Invalid parameters: ${parameters}`);
        }
        this.canvas.height = vector.y;
        this.canvas.width = vector.x;
        return this;
    }
}
const vitterns = new VitternsDocument(document, window);
