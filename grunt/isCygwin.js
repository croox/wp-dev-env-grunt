'use strict';
const { execSync } = require('child_process');

const isCygwin = () => {
  if (process.platform !== 'win32') {
    return false;
  }

  try {
    // Reference:
    // http://man7.org/linux/man-pages/man1/uname.1.html
    // https://en.wikipedia.org/wiki/Uname
    return execSync('uname', {encoding: 'utf-8'}).toLowerCase().includes('cygwin');
  } catch (err) {
    // return false;
    return true;
  }
};

module.exports = isCygwin;
