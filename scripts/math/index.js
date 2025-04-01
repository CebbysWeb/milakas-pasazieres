"use strict";
class Vector2D {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    scale(by) {
        return new Vector2D((this.x * by), (this.y * by));
    }
}
