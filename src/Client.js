import { InMemoryCache, ApolloClient, ApolloLink } from 'apollo-boost';

const cache = new InMemoryCache();
const stateLink = CreateClientStore(cache);
const Client = new ApolloClient({
  link: ApolloLink.from([stateLink]),
  cache
});

export default Client;
