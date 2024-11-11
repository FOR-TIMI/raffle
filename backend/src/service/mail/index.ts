import config from "config";
import fs from "fs";
import nodemailer, { SendMailOptions } from "nodemailer";
import log from "../../utils/Logger";

type EmailTemplate = "verifyEmail" | "forgotPassword" | "resetPassword";

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
  secure: String(smtpConfig.secure).toLowerCase() === "true",
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

const getHtml = (type: EmailTemplate, data: Record<string, string>): string => {
  let template = "";
  let templateHtml = "";
  switch (type) {
    case "verifyEmail":
      template = "verifyEmail.html";
      break;
    case "forgotPassword":
      template = "forgotPassword.html";
      break;
  }

  if (template) {
    const templatePath = `${__dirname}/Templates/${template}`;
    if (fs.existsSync(templatePath)) {
      templateHtml = fs
        .readFileSync(templatePath, "utf8")
        .replace(/{{([^{}]*)}}/g, (_, key) => data[key]);
    } else {
      log.error(`Template file ${templatePath} not found`);
    }
  }

  return templateHtml;
};

export default {
  sendEmail,
  getHtml,
};
