import React from 'react';
import { compose, withState } from 'recompose';
import { withTodo } from './Client';

const TodoListPure = ({
  currentTodos,
  addTodoMutation,
  clearTodoMutation,
  todoText,
  setTodoText
}) => (
  <div>
    <h1>Todos</h1>
    {currentTodos.map(todo => (
      <div key={todo}>{todo}</div>
    ))}
    <input
      value={todoText}
      onChange={e => setTodoText(e.target.value)}
      type="text"
      placeholder="Pick up milk, Grab, cheese, etc"
    />
    <input
      type="submit"
      value="Add"
      onClick={e => {
        addTodoMutation({ variables: { item: todoText } });
        setTodoText('');
      }}
    />
    <input type="submit" value="Clear All" onClick={e => clearTodoMutation()} />
  </div>
);

const TodoList = compose(
  withTodo,
  withState('todoText', 'setTodoText', '')
)(TodoListPure);

export default TodoList;
