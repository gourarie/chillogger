const fs = require("fs");
const { execSync } = require("child_process");
var LICENSE = fs.readFileSync("./LICENSE").toString();
var logger = fs.readFileSync("./logger.js").toString();
var logLevels = fs.readFileSync("./_log-levels.js").toString().replace(`module.exports = levels;`, "");
var logMessageTransformer = fs.readFileSync("./_log-message-transformer.js").toString().replace(`module.exports = LogMessageTransformer;`, "");
var color = fs.readFileSync("./color.js").toString().replace(`module.exports = color;`, "");

let code = logger.replace(`const LogMessageTransformer = require("./_log-message-transformer.js");`, logMessageTransformer)
code = code.replace(`const levels = require("./_log-levels.js");`, logLevels);
code = code.replace(`const color = require("./color");`, color);

let buildTime = Date.now();
let buildName = `./build/${buildTime}-build.js`;
let miniName = `./build/${buildTime}.mini.js`;

const _logLevels = require("../_log-levels.js");

function testLogger(modulePath, testName) {
    function testMain() {
        log.meta = `Starting ${testName}`
        Object.keys(_logLevels).forEach(key1 => {
            log(key1, "this is a test")
        })
        log(new Error("used with error object only"));

        function test() {
            (["arrow functions source"]).forEach(item => log("info", item))
        }
        test()
        log("info", "test");
        log({message:"test object"});
        log("info",{message:"test object"});
        log("info",{noMessage:"test object"});
        log("not a level", "not a level");
        log.timeEnd();
        log.time("test");
        log.timeEnd("test");
        log = Logger();
    }
    
    let Logger = require(modulePath);
    log = Logger();
    testMain()

    log = Logger(true);
    testMain()
    Logger.trace()
    testMain()
    process.env.sn = "sys";
    log = Logger(true);
    testMain()
    log = Logger();
    testMain()

}

fs.writeFileSync(buildName, code);

testLogger(buildName, "build version")

code = execSync(`minify ${buildName}`);
fs.writeFileSync(miniName, `/*
${LICENSE}*/
${code}`);


testLogger(miniName, "mini version")
// fs.unlinkSync(buildName)