"use strict";
class Level {
    static LEVEL_COUNT = 0;
    static LEVEL_LENGTH = 0;
    static VALUES = [];
    color;
    static TRACE = new Level("trace", "#8ABEB7");
    static DEBUG = new Level("debug", "#B294BB");
    static INFO = new Level("info", "#B5BD68");
    static WARNING = new Level("warning", "#F0C674");
    static ERROR = new Level("error", "#E04141");
    static FATAL = new Level("fatal", "#822121");
    index;
    name;
    constructor(name, color) {
        this.index = Level.LEVEL_COUNT++;
        this.name = name;
        this.color = color;
        if (Level.LEVEL_LENGTH < this.name.length) {
            Level.LEVEL_LENGTH = this.name.length;
            console.log(Level.LEVEL_LENGTH);
        }
        Level.VALUES.push(this);
    }
    string() {
        return ` ${this.name.padEnd(Level.LEVEL_LENGTH, " ")} `;
    }
    static values() {
        return [...Level.VALUES];
    }
    static from(name, default_level = null) {
        for (const level of Level.values()) {
            if (level.name == name) {
                return level;
            }
        }
        if (!default_level) {
            throw new Error(`Log level name '${name}' does not match any valid log level`);
        }
        return default_level;
    }
}
class Logger {
    trace;
    debug;
    info;
    warning;
    error;
    fatal;
    name;
    constructor(name = null, level = Level.INFO) {
        this.trace = this.getMethodForLevel(Level.TRACE, level);
        this.debug = this.getMethodForLevel(Level.DEBUG, level);
        this.info = this.getMethodForLevel(Level.INFO, level);
        this.warning = this.getMethodForLevel(Level.WARNING, level);
        this.error = this.getMethodForLevel(Level.ERROR, level);
        this.fatal = this.getMethodForLevel(Level.FATAL, level);
        if (!name) {
            name = "default-logger";
        }
        this.name = name;
    }
    log(level, message, error) {
        console.log(`%c${level.string()}` + `%c ${message}`, `background: ${level.color}`, 'background-color: transparent');
        console.log(JSON.stringify({
            timestamp: Date.now(),
            level: level.name,
            name: this.name,
            message,
            error
        }));
    }
    getMethodForLevel(level, selected) {
        if (level.index >= selected.index) {
            return (message, error) => this.log(level, message, error);
        }
        return (..._) => { };
    }
}
;
