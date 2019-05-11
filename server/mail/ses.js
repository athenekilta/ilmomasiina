const AWS = require("aws-sdk");

const config = require("../../config/ilmomasiina.config.js").ses; // eslint-disable-line

const { region, accessKeyId, secretAccesKey } = config;

const ses = new AWS.SES({
  region,
  accessKeyId,
  secretAccesKey
});

const send = (to, subject, html) => {
  const params = {
    Destination: {
      /* required */
      CcAddresses: [],
      ToAddresses: [to]
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: 'UTF-8'
      },
      Body: {
        Html: {
          Data: html,
          Charset: 'UTF-8'
        }
      }
    }
    Source: config.mailFrom,
  };
  return ses.sendEmail(paramas).promise();
};
