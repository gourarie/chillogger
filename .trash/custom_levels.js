const levels = {
    fatal: {
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
    sec_high:{
        level: 0,
        messageColor: "RED",
        labelColor: "WHITE_ON_RED",
        srcColor: "WHITE_ON_RED",
        metaColor: "YELLOW"
    },
    sec_mid:{
        level: 2,
        messageColor: "WHITE",
        labelColor: "YELLOW",
        metaColor: "GRAY",
        srcColor: "YELLOW_ON_YELLOW",
    },
    sec_low:{
        level: 3,
        messageColor: "WHITE",
        labelColor: "GREEN",
        srcColor: "WHITE_ON_BLUE",
        metaColor: "GRAY"
    },
    sec_trace:{
        level: 4,
        messageColor: "WHITE",
        labelColor: "WHITE_ON_GREEN",
        srcColor: "WHITE_ON_BLUE",
        metaColor: "GRAY"
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
    trace: {
        level: 4,
        messageColor: "WHITE",
        labelColor: "WHITE_ON_GREEN",
        srcColor: "WHITE_ON_BLUE",
        metaColor: "GRAY"
    },
    deprecated: {
        level: 4,
        messageColor: "WHITE",
        labelColor: "YELLOW_ON_YELLOW",
        srcColor: "WHITE_ON_BLUE",
        metaColor: "GRAY"
    }
}

const Logger = require("../logger");

let log = new Logger(true, undefined, levels)
log.meta = "admin@you.io";
log.meta = "pci::10.2.2";
log("sec_high", "admin user logged in from new device");
log = new Logger(true, undefined, levels)
log.meta = "pci::10.2.6";
log("fatal", "system is shutting down");
log = new Logger(true, undefined, levels);
log.meta = "pci::10.2.6";
log("sec_mid", "system is shutting down");
log.meta = "pci::10.2.6";
log("info", "system is starting");
log("sec_low", "connecting database with username and password");
log("debug", "db connected");
log("trace", "incoming message on wss");
