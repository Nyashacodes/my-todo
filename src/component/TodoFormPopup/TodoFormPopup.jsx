import React, { useState, useEffect } from "react";
import "./TodoFormPopup.css";

function TodoFormPopup({ onClose, todos, setTodos, editingTodo }) {
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");

  // ⭐ Prefill form if editing
  useEffect(() => {
    if (editingTodo) {
      setTask(editingTodo.task);
      setPriority(editingTodo.priority);
      setDueDate(editingTodo.dueDate?.slice(0, 10) || "");
    }
  }, [editingTodo]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!task.trim()) return;

    const newTodo = {
      task,
      priority,
      dueDate,
      createdOn: Date.now(),
    };

    // ⭐ EDIT mode
    if (editingTodo) {
      const res = await fetch(
        `http://localhost:5000/todos/${editingTodo._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTodo),
        }
      );

      const updated = await res.json();

      setTodos(
        todos.map((t) => (t._id === editingTodo._id ? updated : t))
      );

      onClose();
      return;
    }

    // ⭐ ADD mode
    const res = await fetch("http://localhost:5000/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    });

    const data = await res.json();
    setTodos([...todos, data]);
    onClose();
  };

  return (
    <div className="todo-form-popup">
      <h2>{editingTodo ? "Edit Todo" : "Add New Todo Item"}</h2>

      <form className="todo-form" onSubmit={handleSubmit}>
        <div className="todo-form-input">
          <label>Enter Your Todo Task</label>
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />

          <label>Priority</label>
          <div>
            <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          </div>
          

          <label>Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="todo-form-buttons">
          <button type="submit">
            {editingTodo ? "Save Changes" : "Add Item"}
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
