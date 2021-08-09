const app = require("../app");

it("should send an email to mailpit", () => {
  app.sendEmail("heyooo!");
});
