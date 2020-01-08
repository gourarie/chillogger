const levels = {
    alert: {
        level: 0,
        messageColor: "RED",
        labelColor: "WHITE_ON_RED",
        srcColor: "WHITE_ON_RED",
        metaColor: "YELLOW"
    },
    error: {
        level: 1,
        messageColor: "WHITE",
        labelColor: "RED",
        srcColor: "WHITE_ON_RED",
        metaColor: "RED"
    },
    warning: {
        level: 2,
        messageColor: "WHITE",
        labelColor: "YELLOW",
        metaColor: "GRAY",
        srcColor: "YELLOW_ON_YELLOW",
    },
    info: {
        level: 3,
        messageColor: "WHITE",
        labelColor: "GREEN",
        srcColor: "WHITE_ON_BLUE",
        metaColor: "GRAY"
    },
    time:{
        level: 3,
        messageColor: "PURPLE",
        labelColor: "WHITE_ON_PURPLE",
        srcColor: "WHITE_ON_PURPLE",
        metaColor: "GRAY"
    },
    debug:{
        level: 4,
        messageColor: "WHITE",
        labelColor: "PURPLE",
        srcColor: "WHITE_ON_BLUE",
        metaColor: "GRAY"
    },
    todo: {
        level: 4,
        messageColor: "WHITE",
        labelColor: "WHITE_ON_GREEN",
        srcColor: "WHITE_ON_BLUE",
        metaColor: "GRAY"
    },
    pipeData: {
        level: 4,
        messageColor: "WHITE",
        labelColor: "WHITE_ON_PURPLE",
        srcColor: "WHITE_ON_PURPLE",
        metaColor: "GREEN"
    },
    deprecated: {
        level: 4,
        messageColor: "WHITE",
        labelColor: "YELLOW_ON_YELLOW",
        srcColor: "WHITE_ON_BLUE",
        metaColor: "GRAY"
    },
    trace: {
        level: 5,
        messageColor: "WHITE",
        labelColor: "TURQUOISE_ON_RED",
        srcColor: "WHITE_ON_BLUE",
        metaColor: "GRAY"
    }
}

module.exports = levels;