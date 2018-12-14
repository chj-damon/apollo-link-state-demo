import { InMemoryCache, ApolloClient, ApolloLink, gql } from 'apollo-boost';
import { withClientState } from 'apollo-link-state';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';

const todoDefaults = {
  currentTodos: []
};

const todoQuery = gql`
  query GetTodo {
    currentTodos @client
  }
`;

const clearTodoQuery = gql`
  mutation clearTodo {
    clearTodo @client
  }
`;

const addTodoQuery = gql`
  mutation addTodo($item: String) {
    addTodo(item: $item) @client
  }
`;

const addTodo = (_obj, { item }, { cache }) => {
  const query = todoQuery;
  const { currentTodos } = cache.readQuery({ query });
  const updatedTodos = currentTodos.concat(item);
  cache.writeQuery({ query, data: { currentTodos: updatedTodos } });
  return null;
};

const clearTodo = (_obj, _args, { cache }) => {
  cache.writeQuery({ query: todoQuery, data: todoDefaults });
};

const cache = new InMemoryCache();
const stateLink = withClientState({
  cache,
  defaults: todoDefaults,
  resolvers: {
    Mutation: {
      addTodo,
      clearTodo
    }
  }
});
const Client = new ApolloClient({
  link: ApolloLink.from([stateLink]),
  cache
});

const todoQueryHandler = {
  props: ({ ownProps, data: { currentTodos = [] } }) => ({
    ...ownProps,
    currentTodos
  })
};

const withTodo = compose(
  graphql(todoQuery, todoQueryHandler),
  graphql(addTodoQuery, { name: 'addTodoMutation' }),
  graphql(clearTodoQuery, { name: 'clearTodoMutation' })
);

export { Client, withTodo };
