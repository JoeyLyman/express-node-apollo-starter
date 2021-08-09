const fs = require("fs");
const ejs = require("ejs");

function readHtmlFile() {
  return new Promise((resolve, reject) => {
    fs.readFile(__dirname + "/resetPasswordEmailTemplate.html", function (
      err,
      html
    ) {
      if (err) throw err;
      resolve(html);
    });
  });
}

async function buildResetPasswordEmailHtml(url) {
  const htmlFile = await readHtmlFile();
  const data = { url };
  const modifiedHtml = ejs.render(htmlFile.toString(), data);
  return modifiedHtml;
}

module.exports = { buildResetPasswordEmailHtml };
