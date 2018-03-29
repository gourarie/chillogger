var levels = {
    alert: {
        color: "WHITE_ON_RED",
        level: 10
    },
    debug: {
        color: "PURPLE",
        level: 0
    },
    HTTP: {
        color: "LIGHT_TURQUOISE",
        level: 2
    },
    info: {
        color: "LIGHT_GREEN",
        level: 2
    },
    resource: {
        color: "LIGHT_BLUE",
        level: 2
    },
    security: {
        color: "YELLOW",
        level: 2
    },
    "sec-debug": {
        color: "YELLOW",
        level: 0
    },
    todo: {
        color: "BLACK_ON_LIGHT_GREEN",
        level: 1
    },
    warning: {
        color: "BLACK_ON_LIGHT_YELLOW",
        level: 1
    },
    error: {
        color: "LIGHT_RED",
        level: 1
    },
    "deprecated": {
        color: "BLACK_ON_YELLOW",
        level: 0
    }
}

Object.defineProperties(levels,{
    "base":{
        value: ["debug","error","info","alert"]
    }
});

module.exports = levels;