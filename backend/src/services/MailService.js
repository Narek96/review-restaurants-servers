const nodemailer = require('nodemailer');
const config = require('../config');

let transporter = null;

class MailService {

  static initialize() {
    transporter = nodemailer.createTransport(config.mailServer);
  }

  static sendEmail(to, subject, messageHtml) {
    let mailOptions = {
      from: config.mailServer.from,
      to: to,
      subject: subject,
      html: messageHtml,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return console.log(err);
      }
    });
  }

}

module.exports = MailService;