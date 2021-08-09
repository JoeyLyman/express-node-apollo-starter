// prettier-ignore
const signupUserMutation = (username, email, password = "bobrocks", confirmPassword = "bobrocks") => `
  mutation {
    signup(
      input: {
        username: "${username}"
        email: "${email}"
        phoneNumber: "2068785017"
        password: "${password}"
        confirmPassword: "${confirmPassword}"
      }
    ) {
      code
      success
      message
      user {
        _id
        username
        email {
          address
          confirmed
        }
        phoneNumber
      }
    }
  }
`;

const loginUserMutation = (usernameOrEmail, password) => `
  mutation {
    login(
      input: {
        usernameOrEmail: "${usernameOrEmail}"
        password: "${password}"
      }
    ) {
      code
      success
      message
      user {
        _id
        username
        email {
          address
          confirmed
        }
        phoneNumber
      }
      token
    }
  }
`;

const changePasswordMutation = (newPassword, newConfirmPassword) => `
  mutation {
    changePassword(
      input: {
        newPassword: "${newPassword}"
        newConfirmPassword: "${newConfirmPassword}"
      }
    ) {
      code
      success
      message
      user {
        _id
        username
        email {
          address
          confirmed
        }
        phoneNumber
      }
    }
  }
`;

const confirmEmailMutation = (password, token) => `
  mutation {
    confirmEmail(
      input: {
        password: "${password}"
        token: "${token}"
      }
    ) {
      code
      success
      message
      user {
        _id
        username
        email {
          address
          confirmed
        }
        phoneNumber
      }
      token
    }
  }
`;

module.exports = {
  signupUserMutation,
  loginUserMutation,
  changePasswordMutation,
  confirmEmailMutation
};
