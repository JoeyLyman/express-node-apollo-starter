const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport(
  JSON.parse(process.env.NODEMAILER_TRANSPORT_OBJ)
);

async function sendEmail(
  recipientEmail,
  subject,
  messageHtml,
  from = "yewhew@yewtide.com"
) {
  console.log(`recipientEmail:`, recipientEmail);
  // message = {
  //   from: "yewhew@yewtide.com",
  //   to: "joeylyman@outlook.com",
  //   subject: "Design Your Model S | Tesla",
  //   html:
  //     "<h1>Have the most fun you can in a car!</h1><p>Get your <b>Tesla</b> today!</p>"
  // };
  const message = {
    from,
    to: recipientEmail,
    subject,
    html: messageHtml,
  };

  // const res = transport.sendMail(message, function(err, info) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log(info);
  //   }
  // });
  const res = await transport.sendMail(message);

  return res;
}

module.exports = { sendEmail };
