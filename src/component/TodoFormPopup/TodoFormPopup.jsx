import React, { useState, useEffect } from "react";
import "./todoFormPopup.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@mui/material";

function TodoFormPopup({ onClose, todos, setTodos, editingTodo, userEmail }) {
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");
  const [percentage, setPercentage] = useState(0);
  const [notes, setNotes] = useState("");

  // State for error popup
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ⭐ Prefill form if editing
  useEffect(() => {
    if (editingTodo) {
      setTask(editingTodo.task);
      setPriority(editingTodo.priority);
      setDueDate(editingTodo.dueDate?.slice(0, 10) || "");
      setPercentage(editingTodo.percentage || "");
      setNotes(editingTodo.notes || "");
    }
  }, [editingTodo]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missingFields = [];
    if (!task.trim()) missingFields.push("Task");
    if (!priority) missingFields.push("Priority");
    if (!dueDate) missingFields.push("Due Date");

    if (missingFields.length > 0) {
      setErrorMessage(`Please fill: ${missingFields.join(", ")}`);
      setErrorOpen(true);
      return;
    }

    // ⭐ Validation
    if (dueDate) {
      const today = new Date().toISOString().slice(0, 10);
      if (dueDate < today) {
        setErrorMessage("Due date cannot be in the past!");
        setErrorOpen(true);
        return;
      }
    }

    if (percentage < 0 || percentage > 100) {
      setErrorMessage("Percentage must be between 0 and 100");
      setErrorOpen(true);
      return;
    }

    const newTodo = {
      task,
      priority,
      dueDate,
      percentage,
      notes,
      userEmail, // Add userEmail to the object
      createdOn: Date.now(),
    };

    // ⭐ EDIT mode
    if (editingTodo) {
      const res = await fetch(
        `https://my-todo-uo0m.onrender.com/todos/${editingTodo._id}`,
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
    const res = await fetch("https://my-todo-uo0m.onrender.com/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    });

    const data = await res.json();
    setTodos([...todos, data]);
    onClose();
  };

  const today = new Date().toISOString().slice(0, 10);

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
            min={today}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <label>Percentage Complete (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
          />

          <label>Notes / Comments</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
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

      {/* Error Popup */}
      <Dialog
        open={errorOpen}
        onClose={() => setErrorOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Validation Error"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {errorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorOpen(false)} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default TodoFormPopup;
