import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function TodoTable({ todos, handleDelete, handleEdit }) {
  const rows = todos.map((todo) => ({
    id: todo._id,
    task: todo.task,
    priority: todo.priority,
    dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().slice(0, 10) : "",
    createdOn: todo.createdOn ? new Date(todo.createdOn).toLocaleDateString() : "-",
  }));

  const columns = [
    { field: "task", headerName: "Task", flex: 1 },
    { field: "priority", headerName: "Priority", width: 120 },
    { field: "dueDate", headerName: "Due Date", width: 150 },
    { field: "createdOn", headerName: "Created On", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      renderCell: (params) => {
        console.log("params", params);
        const todo = todos.find((t) => t._id === params.row.id);
        console.log("todooooooos", todo);

        return (
          <>
            <IconButton onClick={() => handleEdit(todo)}>
              <EditIcon />
            </IconButton>

            <IconButton onClick={() => handleDelete(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <div style={{ height: 400, width: "100%", marginTop: "20px" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        disableRowSelectionOnClick
        sx={{
          background: "white",
          borderRadius: "10px",
        }}
      />
    </div>
  );
}
