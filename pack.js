const fs = require("fs");
const { execSync } = require("child_process");
var UglifyJS = require("uglify-js");
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

const _logLevels = require("./_log-levels.js");

function testLogger(modulePath, testName) {
    let Logger = require(modulePath);
    log = Logger(true);

    log.meta = `Starting ${testName}`
    Object.keys(_logLevels).forEach(key => {
        log(key, "this is a test")
    })
    log(new Error("used with error object only"));

    function test() {
        (["arrow functions source"]).forEach(item => log("info", item))
    }
    test()
    log("info", "test");
    log.timeEnd();
    log.time("test");
    log.timeEnd("test");
}

fs.writeFileSync(buildName, code);
testLogger(buildName, "build version")

execSync(`minify ${buildName} -d --outFile ${miniName}`);
testLogger(miniName, "mini version")
fs.unlinkSync(buildName)