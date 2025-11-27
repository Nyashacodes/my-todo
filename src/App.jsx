import React, { useState, useEffect } from "react";
import Navbar from "./component/navbar2.jsx";
import "./App.css";
import TodoFormPopup from "./component/TodoFormPopup/TodoFormPopup.jsx";
import TodoTable from "./component/TodoTable/todoTable.jsx";

function App() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.log(err));
  }, []);

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
    await fetch(`http://localhost:5000/todos/${id}`, {
      method: "DELETE",
    });

    setTodos(todos.filter((t) => t._id !== id));
  };

  const handleEdit = (todo) => {
    console.log("Editing todo:", todo);
    setEditingTodo(todo);
    setIsPopupOpen(true);
  };

  return (
    <>
      <Navbar />
      <div className="App">
        <div className="todo-header">
          <h1>My Todo List</h1>
        </div>

        <div className="todo-input">
          <TodoTable
            todos={todos}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
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
        />
      )}
    </>
  );
}

export default App;
