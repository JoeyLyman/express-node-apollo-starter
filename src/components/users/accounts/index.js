// const app = require("./app/app");
// const gql = require("./gql/gql");

// module.exports = { app, gql };

const login = require("./mutations/login");
const register = require("./mutations/register");
const update = require("./mutations/update");
const gql = require("./gqlSchema");

module.exports = { login, register, update, gql };
