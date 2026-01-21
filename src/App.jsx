import React, { useState, useEffect } from "react";
import Navbar from "./component/navbar2.jsx";
import "./App.css";
import TodoFormPopup from "./component/TodoFormPopup/TodoFormPopup.jsx";
import TodoTable from "./component/TodoTable/todoTable.jsx";
import Login from "./component/Login.jsx";

function App() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);

  // User State
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check local storage for logged in user
    const savedUser = localStorage.getItem("my_todo_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (user && user.email) {
      fetch(`https://my-todo-uo0m.onrender.com/todos?userEmail=${user.email}`)
        .then((res) => res.json())
        .then((data) => setTodos(data))
        .catch((err) => console.log(err));
    }
  }, [user]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("my_todo_user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("my_todo_user");
    setTodos([]);
  };

  const handleOpenPopup = () => {
    setEditingTodo(null);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setEditingTodo(null);
  };

  const handleDelete = async (id) => {
    console.log("Deleting todo with id:", id);
    await fetch(`https://my-todo-uo0m.onrender.com/todos/${id}`, {
      method: "DELETE",
    });

    setTodos(todos.filter((t) => t._id !== id));
  };

  const handleEdit = (todo) => {
    console.log("Editing todo:", todo);
    setEditingTodo(todo);
    setIsPopupOpen(true);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      <Navbar />
      <div className="App">
        <div className="todo-header">
          <h1>{user.name ? `${user.name}'s Todo List` : "My Todo List"}</h1>
          <button
            onClick={handleLogout}
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#ff6b6b",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>

        <div className="todo-input">
          <TodoTable
            todos={todos}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            userEmail={user.email}
          />
        </div>

        <button className="add-item-popup-button" onClick={handleOpenPopup}>
          Add New Todo Item
        </button>
      </div>

      {isPopupOpen && (
        <TodoFormPopup
          onClose={handleClosePopup}
          todos={todos}
          setTodos={setTodos}
          editingTodo={editingTodo}
          userEmail={user.email}
        />
      )}
    </>
  );
}

export default App;
