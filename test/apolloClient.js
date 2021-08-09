const { ApolloClient } = require("apollo-client");
const { InMemoryCache } = require("apollo-cache-inmemory");
const { setContext } = require("apollo-link-context");
const { HttpLink } = require("apollo-link-http");
const fetch = require("node-fetch");

const client = new ApolloClient({
  link: new HttpLink({ uri: `http://localhost:${process.env.PORT}/`, fetch }),
  cache: new InMemoryCache(),
  onError: e => {
    console.log(e);
  }
});

const getClient = token => {
  const httpLink = new HttpLink({
    uri: `http://localhost:${process.env.PORT}/`,
    fetch
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers, //,
        Authorization: `Bearer ${token}`
      }
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    // new HttpLink({ uri: `http://localhost:${process.env.PORT}/`, fetch }),
    cache: new InMemoryCache(),
    // request: operation => {
    //   if (token) {
    //     operation.setContext({
    //       headers: {
    //         Authorization: `Bearer ${token}`
    //       }
    //     });
    //   }
    // },
    onError: e => {
      console.log(e);
    }
  });

  // return new ApolloClient({
  //   link: new HttpLink({ uri: `http://localhost:${process.env.PORT}/`, fetch }),
  //   cache: new InMemoryCache(),
  //   request: operation => {
  //     if (token) {
  //       operation.setContext({
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       });
  //     }
  //   },
  //   onError: e => {
  //     console.log(e);
  //   }
  // });
};

module.exports = { client, getClient };
