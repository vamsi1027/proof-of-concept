const { exec } = require("child_process");
const path = require('path');


const args = process.argv.slice(2).reduce((acc, arg) => {

    let [k, v = true] = arg.split('=')
    acc[k] = v
    return acc

}, {});
const s3Bucket = process.env.REACT_APP_S3_BUCKET || "dr-uat-portal";
const microFrontend = path.basename(path.resolve(process.cwd()))
let syncCommand = `aws s3 sync dist/ s3://${s3Bucket}/`;
syncCommand += (!args.hasOwnProperty("root")) ? `micro-app/${microFrontend}` : '';

exec(syncCommand, (buildError, stdout, stderr) => {
  if (!!stdout) {
    console.log(`${microFrontend.toUpperCase()}-LOG:`, stdout);
  }
  if (!!stderr) {
    console.warn(`${microFrontend.toUpperCase()}-WARNING:`, stderr);
  }
  if (!!buildError) {
    console.log(`exec buildError: ${buildError}`);
  }
});