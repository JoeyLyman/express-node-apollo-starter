const express = require("express");
const { ApolloServer } = require("apollo-server-express");
//const cors = require("cors");

const { schema } = require("./gqlSchema");

const server = new ApolloServer({
  schema,
  context: ({ req }) => ({ req }), // Gives a callback to context, where it gets an object from express, destructures req out of it, and forwards it to the context
  playground: true,
  introspection: true,
});
const app = express();

server.applyMiddleware({
  path: "/",
  app,
  cors: {
    origin: "*", // "http://localhost:3000",
    credentials: true,
    //methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  },
});

module.exports = app;
