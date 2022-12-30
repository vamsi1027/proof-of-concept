const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const localPath = path.join(__dirname, "/");

// Read each file on this directory
fs.readdir(localPath, (dirError, files) => {
  if (!!dirError) {
    return console.log("Unable to scan directory: " + dirError);
  }
  files.forEach((file) => {
    // check if file is a directory as a MicroApp
    fs.lstat(file, (fileError, stats) => {
      if (!!fileError) {
        return console.log("Unable to scan this file: " + fileError);
      }

      // Is it a Directory and it is not a service directory (It is not a .git or .husky dir)
      const isMicroApp = stats.isDirectory() && file[0] !== ".";
      if (!!isMicroApp) {
        console.log(`${file} is starting http://localhost:9000/...`);

        //if(process.env.NODE_ENV==='prod'){}
        exec(`cd ${file} && yarn start`, (buildError, stdout, stderr) => {
          if (!!stdout) console.log(`${file}-LOG:`, stdout);
          if (!!stderr) console.warn(`${file}-WARNING:`, stderr);
          if (!!buildError) {
            console.log(`exec buildError: ${buildError}`);
          }
        });
      }
    });
  });
});
