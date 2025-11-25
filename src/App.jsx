import React from "react";
import Navbar from "./component/navbar2.jsx";
import "./App.css";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import TodoFormPopup from "./component/TodoFormPopup/TodoFormPopup.jsx";

function App() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
 const [todos, setTodos] = useState([]);

  useEffect(() => {
  fetch("http://localhost:5000/todos")
    .then((res) => res.json())
    .then((data) => setTodos(data))
    .catch((err) => console.log(err));
}, []);


  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  // const handleDelete = (index) => {
  //   const newTodos = todos.filter((_, i) => i !== index);
  //   setTodos(newTodos);
  // };
  const handleDelete = async (id) => {
  await fetch(`http://localhost:5000/todos/${id}`, {
    method: "DELETE",
  });

  setTodos(todos.filter((t) => t._id !== id));
};


  return (
    <>
      <Navbar />
      <div className="App">
        <div className="todo-header">
          <h1>My Todo List</h1>
        </div>
        <div className="todo-input">
    <ul>
  {todos.map((todo) => (
    <li key={todo._id} className="todo-item">
      {todo.task}
      <FontAwesomeIcon
        icon={faTrash}
        className="delete-icon"
        onClick={() => handleDelete(todo._id)}
      />
    </li>
  ))}
</ul>

        </div>
        <div>
          <button className="add-item-popup-button" onClick={handleOpenPopup}>
            Add New Todo Item
          </button>
        </div>
      </div>
      {isPopupOpen && (
        <TodoFormPopup
          onClose={handleClosePopup}
          todos={todos}
          setTodos={setTodos}
        />
      )}
    </>
  );
}

export default App;
