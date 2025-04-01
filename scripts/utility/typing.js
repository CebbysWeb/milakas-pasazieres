"use strict";
function as(types, ...parameters) {
    let out = (_) => null;
    if (types.length === parameters.length) {
        let matches = true;
        for (let i = 0; i < types.length; i++) {
            const parameter = parameters[i];
            const type = types[i];
            console.log(`Checking if parameter '${parameter}' is of type '${type}'`);
            matches = matches && !(parameters[i] instanceof types[i]);
            if (!matches) {
                break;
            }
        }
        if (matches) {
            out = (runnable) => runnable(...parameters);
        }
    }
    return out;
}
