import React from "react";
import "./TodoFormPopup.css";
import { useRef, useEffect } from "react";


function TodoFormPopup({ onClose, todos, setTodos }) {
 const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();    // Auto-focus when popup opens
  }, []);
  const handleAddinTodoList = async (e) => {
  e.preventDefault();
  const newTodo = e.target.todo.value;

  const res = await fetch("http://localhost:5000/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task: newTodo }),
  });

  const data = await res.json();

  setTodos([...todos, data]);
  onClose();
};


  return (
    <div className="todo-form-popup">
      <h2>Add New Todo Item</h2>

      <form className="todo-form" onSubmit={handleAddinTodoList}>
        <div className="todo-form-input">
          <label>Enter Your Todo task</label>
          <input
            type="text"
            name="todo" // ← important!
             ref={inputRef}
          />
        </div>

        <div className="todo-form-buttons">
          <button type="submit" style={{ marginRight: "10px" }}>
            Add Item
          </button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default TodoFormPopup;
