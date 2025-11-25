import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// connect to mongodb local
mongoose
  .connect("mongodb://127.0.0.1:27017/todoapp")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

app.get("/", (req, res) => {
  res.send("Server is running!");
});
// 2️⃣ Create Todo Schema
const TodoSchema = new mongoose.Schema({
  task: { type: String, required: true }
});

const Todo = mongoose.model("Todo", TodoSchema);

// 3️⃣ Get all todos (GET)
app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// 4️⃣ Add new todo (POST)
app.post("/todos", async (req, res) => {
  const newTodo = new Todo({ task: req.body.task });
  await newTodo.save();
  res.json(newTodo);
});

// 5️⃣ Delete todo (DELETE)
app.delete("/todos/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// 6️⃣ Start server

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
