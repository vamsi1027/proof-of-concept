const path = require("path");
const { exec } = require("child_process");

const baseProjects = ["root", "core", "utils", "shared-component"];

baseProjects.forEach((file) => {
  console.log(`Start project: ${file}`);
  exec(`cd ${file} && yarn start`, (buildError, stdout, stderr) => {
    if (!!stdout) console.log(`${file}-LOG:`, stdout);
    if (!!stderr) console.warn(`${file}-WARNING:`, stderr);
    if (!!buildError) {
      console.log(`exec buildError: ${buildError}`);
    }
  });
});
console.log("Project is running on http://localhost:9000/");
