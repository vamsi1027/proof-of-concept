const https = require("https");
const projectName = "@dr-one/react-core";
https.get(
  "https://dr-uat-portal.s3.us-east-1.amazonaws.com/deploy/testing-services.json",
  (res) => {
    let body = "";
    console.log(res.headers["last-modified"]);
    res.on("data", function (chunk) {
      body += chunk;
    });
    res.on("end", function () {
      var data = JSON.parse(body);
      console.log(data.imports[projectName], data.imports[projectName2]);
    });
  }
);
