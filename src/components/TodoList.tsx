import React, { useMemo, useRef, useCallback } from 'react';
import { useTodos } from './Context';
import TodoItem from './Item';
import {v4 as uuidv4} from 'uuid';

const TodoList: React.FC = () => {
  const { state, dispatch } = useTodos();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddTodo = useCallback(() => {
    if (inputRef.current && inputRef.current.value) {
      const newTodo = {
        id: uuidv4(),
        name: inputRef.current.value,
        completed: false,
      };
      dispatch({ type: 'ADD_TODO', payload: newTodo });
      inputRef.current.value = '';
    }
  }, [dispatch]);

  const remainingTodos = useMemo(() => state.todos.filter(todo => !todo.completed).length, [state.todos]);

  return (
    <div>
      <h1>Todo List</h1>
      <input ref={inputRef} type="text" placeholder="Add new " />
      <button onClick={handleAddTodo}>Add</button>
      <ul>
        {state.todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
      <p>Remaining todos: {remainingTodos}</p>
    </div>
  );
};

export default TodoList;