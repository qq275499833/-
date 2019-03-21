let nodemailer = require('nodemailer');
let mail_proc = {
    sendMail: function (transporter, mailOptions) {
        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (err, res) => {
                err ? reject(err) : resolve(res)
            });
        })
    },
    init: function (from, to, service, user, pass, subject, body) {
        let transporter = nodemailer.createTransport({
            service: service,
            auth: {
                user: user,
                pass: pass
            }
        });
        let mailOptions = {
            from: from,
            to: to,
            subject: subject,
            html: body
        };
        return {transporter: transporter, mailOptions: mailOptions};
    }
};
module.exports = mail_proc;
