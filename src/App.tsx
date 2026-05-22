import './App.scss';

import { useState } from 'react';
import usersFromServer from './api/users';
import todosFromServer from './api/todos';
import { TodoList } from './components/TodoList';

export const App = () => {
  const [todos, setTodos] = useState(
    todosFromServer.map((todo) => {
      const user = usersFromServer.find((u) => u.id === todo.userId);

      return { ...todo, user };
    })
  );
  const [title, setTitle] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [errors, setErrors] = useState({});

  const handleAddTodo = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Please enter a title';
    }

    if (!selectedUser) {
      newErrors.user = 'Please choose a user';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      return;
    }

    const user = usersFromServer.find((u) => u.id === parseInt(selectedUser));
    const newTodo = {
      id: Math.max(...todos.map((t) => t.id)) + 1,
      title,
      completed: false,
      userId: user.id,
      user,
    };

    setTodos([...todos, newTodo]);
    setTitle('');
    setSelectedUser('');
  };

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddTodo();
        }}
      >
        <div className="field">
          <input
            type="text"
            data-cy="titleInput"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value.replace(/[^a-zA-Zа-яА-Я0-9 ]/g, ''));
              setErrors((prev) => ({ ...prev, title: '' }));
            }}
            placeholder="Enter TODO title"
          />
          {errors.title && <span className="error">{errors.title}</span>}
        </div>

        <div className="field">
          <select
            data-cy="userSelect"
            value={selectedUser}
            onChange={(e) => {
              setSelectedUser(e.target.value);
              setErrors((prev) => ({ ...prev, user: '' }));
            }}
          >
            <option value="">Choose a user</option>
            {usersFromServer.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>

          {errors.user && <span className="error">{errors.user}</span>}
        </div>

        <button type="submit" data-cy="submitButton">
          Add
        </button>
      </form>

      <TodoList todos={todos} />
    </div>
  );
};
