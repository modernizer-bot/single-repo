const { exec } = require("child_process");

class Formatter {
  static format(path) {
    exec(`prettier ${path} --write`, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: \n${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: \n${stderr}`);
        return;
      }
      console.log(`stdout: \n${stdout}`);
    });
  }
}

module.exports = Formatter;
