import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import compose from 'recompose/compose';

/**
 * defaults are an object representing the initial state that you would like to write to the cache upon creation of the state link.
 * While not required, it’s important to pass in defaults to warm the cache so that any components querying that data don’t error out.
 * The shape of your defaults object should mirror how you plan to query the cache in your application.
 */
const todoDefaults = {
  currentTodos: []
};

/*
  GraphQL
*/

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

/*
  Cache Mutations
*/
const addTodo = (_obj, { item }, { cache }) => {
  const query = todoQuery;
  // Read the todo's from the cache
  const { currentTodos } = cache.readQuery({ query });

  // Add the item to the current todos
  const updatedTodos = currentTodos.concat(item);

  /**
   * To write the data to the cache, you can use either cache.writeQuery or cache.writeData .
   * The only difference between the two is that
   * cache.writeQuery requires that you pass in a query to validate that
   * the shape of the data you're writing to the cache is the same as the shape of the data required by the query.
   */
  cache.writeQuery({ query, data: { currentTodos: updatedTodos } });

  return null;
};

const clearTodo = (_obj, _args, { cache }) => {
  cache.writeQuery({ query: todoQuery, data: todoDefaults });
  return null;
};

/*
  Store
*/

/**
 * The Store object used to construct
 * Apollo Link State's Client State
 */
const store = {
  defaults: todoDefaults,
  mutations: {
    addTodo,
    clearTodo
  }
};

/*
  Helpers
*/

const todoQueryHandler = {
  props: ({ ownProps, data: todoDefaults }) => ({
    ...ownProps,
    ...todoDefaults
  })
};

const withTodo = compose(
  // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql
  graphql(todoQuery, todoQueryHandler),
  graphql(addTodoQuery, { name: 'addTodoMutation' }),
  graphql(clearTodoQuery, { name: 'clearTodoMutation' })
);

export { store, withTodo };
