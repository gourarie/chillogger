const Logger = require('./logger.js');

log = Logger(true);


log("test");
log(new Error());

function test(){
    // log(new Error());
    ([1,2,3]).forEach(item=>log("info", item))
}

test()

log("info", "test");
log.time();
log.timeEnd();

