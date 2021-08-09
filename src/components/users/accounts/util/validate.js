function password(password, confirmPassword) {
  const errors = {};

  if (password === "") {
    errors.password = "Password must not empty.";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords must match.";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1
  };
}

function contactInfo(email, phoneNumber) {
  // TODO: validate phoneNumber
  const errors = {};
  if (email.trim() === "") {
    errors.email = "Email must not be empty";
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = "Email must be a valid email address.";
    }
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1
  };
}

module.exports = { password, contactInfo };
