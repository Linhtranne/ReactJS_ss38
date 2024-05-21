/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useEffect, useReducer } from 'react';

export interface Todo { 
  id: number;
  name: string;
  completed: boolean;
}

interface TodoState {
  todos: Todo[];
}

interface TodoAction {
    type: 'INIT_TODOS' | 'ADD_TODO' | 'TOGGLE_TODO' | 'DELETE_TODO' | 'UPDATE_TODO';
    payload?: any;
  }
const TodoContext = createContext<{
  state: TodoState;
  dispatch: React.Dispatch<TodoAction>;
} | undefined>(undefined);
const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
    switch (action.type) {
      case 'INIT_TODOS':
        return {
          todos: action.payload,
        };
      case 'ADD_TODO':
        return {
          todos: [...state.todos, action.payload],
        };
      case 'TOGGLE_TODO':
        return {
          todos: state.todos.map(todo =>
            todo.id === action.payload.id ? { ...todo, completed: !todo.completed } : todo
          ),
        };
      case 'DELETE_TODO':
        return {
          todos: state.todos.filter(todo => todo.id !== action.payload.id),
        };
      case 'UPDATE_TODO':
        return {
          todos: state.todos.map(todo =>
            todo.id === action.payload.id ? { ...todo, name: action.payload.name } : todo
          ),
        };
      default:
        return state;
    }
  };
const init = (): TodoState => {
    const storedTodos = localStorage.getItem('todos');
    return { todos: storedTodos ? JSON.parse(storedTodos) : [] };
  };
  
  export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(todoReducer, { todos: [] }, init);
  
    useEffect(() => {
      localStorage.setItem('todos', JSON.stringify(state.todos));
    }, [state.todos]);
  
    return (
      <TodoContext.Provider value={{ state, dispatch }}>
        {children}
      </TodoContext.Provider>
    );
  };
// eslint-disable-next-line react-refresh/only-export-components
export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('');
  }
  return context;
};