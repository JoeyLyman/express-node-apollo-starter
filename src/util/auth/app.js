const { AuthenticationError } = require("apollo-server-express");

const jwt = require("jsonwebtoken");

function generateToken(user) {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      username: user.username,
    },
    process.env.SECRET_KEY,
    { expiresIn: "336h" }
  );
}

function checkAuth(context) {
  // context = { ... headers }
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    // Bearer ...
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        const user = jwt.verify(token, process.env.SECRET_KEY);
        return user;
      } catch (err) {
        throw new AuthenticationError("Invalid/Expired token");
      }
    }
    throw new Error("Authentication token must be 'Bearer [token]");
  }
  throw new Error("Authorization header must be provided");
}

//const { SECRET_KEY } = require('../config');

// function getSecretKey() {
//   const { SECRET_KEY } = require("../../../config");
//   return SECRET_KEY;
// }

// module.exports = context => {
//   // context = { ... headers }
//   const authHeader = context.req.headers.authorization;
//   if (authHeader) {
//     // Bearer ...
//     const token = authHeader.split("Bearer ")[1];
//     if (token) {
//       try {
//         const user = jwt.verify(
//           token,
//           process.env.SECRET_KEY ? process.env.SECRET_KEY : devKey()
//         );
//         return user;
//       } catch (err) {
//         throw new AuthenticationError("Invalid/Expired token");
//       }
//     }
//     throw new Error("Authentication token must be 'Bearer [token]");
//   }
//   throw new Error("Authorization header must be provided");
// };

module.exports = { generateToken, checkAuth };
