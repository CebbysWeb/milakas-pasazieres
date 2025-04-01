"use strict";
var Level;
(function (Level) {
    Level[Level["TRACE"] = 0] = "TRACE";
    Level[Level["DEBUG"] = 1] = "DEBUG";
    Level[Level["INFO"] = 2] = "INFO";
    Level[Level["WARNING"] = 3] = "WARNING";
    Level[Level["ERROR"] = 4] = "ERROR";
    Level[Level["FATAL"] = 5] = "FATAL";
})(Level || (Level = {}));
;
class Logger {
    // public readonly trace: LogMethod;
    // public readonly debug: LogMethod;
    info;
    // public readonly warning: LogMethod; 
    // public readonly error: LogMethod; 
    // public readonly fatal: LogMethod; 
    constructor(level = Level.INFO) {
        this.info = (message, error) => {
        };
    }
    static getLevelIndex(level = null) {
        if (level == undefined || level == null) {
            return 0;
        }
    }
    static getLevels() {
        const values = Object.values(Level);
        console.log(JSON.stringify(values));
    }
}
;
