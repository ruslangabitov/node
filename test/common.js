var path = require("path");

exports.testDir = path.dirname(__filename);
exports.fixturesDir = path.join(exports.testDir, "fixtures");
exports.libDir = path.join(exports.testDir, "../lib");
exports.tmpDir = path.join(exports.testDir, "tmp");
exports.PORT = 12346;

exports.assert = require('assert');

var util = require("util");
for (var i in util) exports[i] = util[i];
//for (var i in exports) global[i] = exports[i];

function protoCtrChain (o) {
  var result = [];
  for (; o; o = o.__proto__) { result.push(o.constructor); }
  return result.join();
}

exports.indirectInstanceOf = function (obj, cls) {
  if (obj instanceof cls) { return true; }
  var clsChain = protoCtrChain(cls.prototype);
  var objChain = protoCtrChain(obj);
  return objChain.slice(-clsChain.length) === clsChain;
};


// Turn this off if the test should not check for global leaks.
exports.globalCheck = true;

process.on('exit', function () {
  if (!exports.globalCheck) return;
  var knownGlobals = [ setTimeout,
                       setInterval,
                       clearTimeout,
                       clearInterval,
                       console,
                       Buffer,
                       process,
                       global ];

  for (var x in global) {
    var found = false;

    for (var y in knownGlobals) {
      if (global[x] === knownGlobals[y]) {
        found = true;
        break;
      }
    }

    if (!found) {
      console.error("Unknown global: %s", x);
      exports.assert.ok(false);
    }
  }
});
