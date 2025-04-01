"use strict";
class Color {
    r;
    g;
    b;
    a;
    static MAX_8_BIT = 255;
    static MAX_16_BIT = 65535;
    static MAX_32_BIT = 4294967295;
    constructor(r = 0, g = 0, b = 0, a = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    static rgb8(r, g, b) {
        return Color.rgb(r, g, b, Color.MAX_8_BIT);
    }
    static rgb16(r, g, b) {
        return Color.rgb(r, g, b, Color.MAX_16_BIT);
    }
    static rgb32(r, g, b) {
        return Color.rgb(r, g, b, Color.MAX_32_BIT);
    }
    values() {
        return [this.r, this.g, this.b];
    }
    hex() {
        const color = '#' + this.values()
            .map((v) => Math.floor(v * Color.MAX_8_BIT).toString(16).padStart(2, '0'))
            .join("");
        return color;
    }
    static rgb(r, g, b, max) {
        r = Math.min(r, max);
        g = Math.min(g, max);
        b = Math.min(b, max);
        return new Color(r / max, g / max, b / max);
    }
}
