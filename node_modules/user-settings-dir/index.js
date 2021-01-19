'use strict';
var env = process.env;
var home = env.HOME;
var user = env.LOGNAME || env.USER || env.LNAME || env.USERNAME;
var path = require('path');

module.exports = function getUserSettingsDir(subDir) {
  var baseDir = null;

  switch (process.platform) {
    case 'win32':
      baseDir =  env.APPDATA;
      break;
    case 'darwin':
      if (home) {
        baseDir = home;
      }
      else if (user) {
        baseDir = '/home/' + user;
      }
    case 'linux':
      if (home) {
        baseDir = home;
      }
      else if (user) {
        baseDir = process.getuid() === 0 ? '/root' : '/home/' + user;
      }
    default:
      if (home) {
        baseDir = home;
      }
      break;
  }

  if (baseDir && subDir) {
    return path.join(baseDir, subDir);
  }

  return baseDir;
}
