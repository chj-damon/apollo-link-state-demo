import {
  InMemoryCache,
  ApolloClient,
  ApolloLink,
  HttpLink
} from 'apollo-boost';
import CreateClientStore from './CreateClientStore';

const cache = new InMemoryCache();
const stateLink = CreateClientStore(cache);
const Client = new ApolloClient({
  link: ApolloLink.from([stateLink, new HttpLink()]), //本地缓存放在最前面
  cache
});

export default Client;
