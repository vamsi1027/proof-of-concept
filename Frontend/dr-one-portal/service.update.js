// reference https://www.freecodecamp.org/news/developing-and-deploying-micro-frontends-with-single-spa/

const fs = require("fs");
const { exec } = require("child_process");

const localToDeploy = process.env.NODE_ENV || "testing";
const s3Path = localToDeploy === "prod" ? "prod" : "uat";
const filePathToSave = `./.deploy/services.json`;
const s3Bucket = process.env.REACT_APP_S3_BUCKET || "dr-uat-portal";
const externalMicrApp = process.env.REACT_APP_EXTERNAL_MICRO_APP || null;

fs.readFile('./.deploy/services', 'utf8', (err, content) => {
  if (!!err) return console.log(err)
  const resquestBuild = `aws s3 cp ${filePathToSave} s3://${s3Bucket}/deploy/ --cache-control max-age=60 `
  const projectsNames = content.split('\n').filter(project => !!project)

  let imports = projectsNames.reduce((acc, current) => {
    let pathUrlS3 = `https://${s3Bucket}.s3.amazonaws.com`;
    if (current.includes("root")) {
      current = current + "-config";
      pathUrlS3 = `${pathUrlS3}/dr-one-${current}.js`;
    } else {
      pathUrlS3 = `${pathUrlS3}/micro-app/${current}/dr-one-${current}.js`;
    }
    return { ...acc, ["@dr-one/" + current]: pathUrlS3 };
  }, {});

  if (!!externalMicrApp) {
    imports = {...imports, ...JSON.parse(externalMicrApp)};
  }

  const fileContent = JSON.stringify({
    imports,
    lastUpdated: new Date().getTime(),
  });

  fs.writeFile(
    filePathToSave,
    `${fileContent}`,
    "utf8",
    (err) => !!err && console.log(err)
  );

  console.log(`File: "${filePathToSave}" created`);
  exec(resquestBuild, (buildError, stdout, stderr) => {
    if (!!stdout) console.log(`${filePathToSave.toUpperCase()}-LOG:`, stdout);
    if (!!stderr)
      console.warn(`${filePathToSave.toUpperCase()}-WARNING:`, stderr);
    if (!!buildError) console.log(`exec buildError: ${buildError}`);
  });
});
