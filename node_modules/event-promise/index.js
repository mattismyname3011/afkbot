var Promise = require('promise'),
    slice = Function.prototype.call.bind(Array.prototype.slice);

module.exports = function once(emitter, event, options) {
  options = options || {};
  return new Promise(function(resolve, reject) {
    if (options.array) {
      emitter.once(event, function() {
        resolve(slice(arguments));
      });
    }
    else {
      emitter.once(event, resolve);
    }
    if (!options.ignoreErrors) {
      emitter.once('error', reject);
    }
  });
};
