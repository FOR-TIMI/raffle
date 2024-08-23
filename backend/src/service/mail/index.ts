import config from "config";
import nodemailer, { SendMailOptions } from "nodemailer";
import log from "../../utils/Logger";

const smtpConfig = config.get<{
  user: string;
  pass: string;
  host: string;
  port: number | string;
  secure: boolean | string;
}>("smtp");

const parsedSmtpConfig = {
  ...smtpConfig,
  port:
    typeof smtpConfig.port === "string"
      ? parseInt(smtpConfig.port)
      : smtpConfig.port,
  secure:
    typeof smtpConfig.secure === "string"
      ? smtpConfig.secure.toLowerCase() === "true"
      : smtpConfig.secure,
};

// async function createTestCreds() {
//   const creds = await nodemailer.createTestAccount();
//   console.log(creds);
// }

const transporter = nodemailer.createTransport({
  ...parsedSmtpConfig,
  auth: { user: parsedSmtpConfig.user, pass: parsedSmtpConfig.pass },
});

async function sendEmail(payload: SendMailOptions) {
  transporter.sendMail(payload, (error, info) => {
    if (error) {
      log.error(error);
      return;
    }
    log.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  });
}

export default {
  sendEmail,
};
