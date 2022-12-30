const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const localPath = path.join(__dirname, "/");

fs.unlink(
  "./.deploy/services",
  (errToDelete) => errToDelete && console.log(errToDelete)
);

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
      const isMicroApp =
        stats.isDirectory() &&
        file[0] !== "." &&
        !file.includes("node_modules");
      if (!!isMicroApp) {
        console.log(`${file} is building...`);
        const resquestBuild = `cd ${file} && npm install && npm run build`;

        exec(resquestBuild, (buildError, stdout, stderr) => {
          if (!!stdout) console.log(`${file.toUpperCase()}-LOG:`, stdout);
          if (!!stderr) console.warn(`${file.toUpperCase()}-WARNING:`, stderr);
          if (!!buildError)
            console.error(`${file.toUpperCase()}-BUILD-ERROR:
            ${JSON.stringify(buildError)}`);
          fs.appendFile("./.deploy/services", `${file}\n`, (writeError) => {
            writeError && console.log(writeError);
          });
        });
      }
    });
  });
});
