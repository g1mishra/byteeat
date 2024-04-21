

const access_key = "AKIAQON25MCA6BHLIXOV";
const secret_access_key = "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";
const region_name = "us-east-1";

const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: access_key,
  secretAccessKey: secret_access_key,
  region: region_name
});

const s3 = new AWS.S3();

export default s3; 
