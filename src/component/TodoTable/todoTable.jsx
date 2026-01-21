import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function TodoTable({ todos, handleDelete, handleEdit, userEmail }) {
  const isAdmin = userEmail === "admin@test.com";

  const rows = todos.map((todo) => ({
    id: todo._id,
    task: todo.task,
    priority: todo.priority,
    dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().slice(0, 10) : "",
    percentage: todo.percentage,
    notes: todo.notes,
    userEmail: todo.userEmail, // Map userEmail for the row
    createdOn: todo.createdOn ? new Date(todo.createdOn).toLocaleDateString() : "-",
  }));

  const columns = [
    { field: "task", headerName: "Task", flex: 1 },
    {
      field: "priority",
      headerName: "Priority",
      width: 120,
      renderCell: (params) => {
        let color = "purple"; // default Low
        if (params.value === "Medium") color = "blue";
        if (params.value === "High") color = "red";
        return <span style={{ color, fontWeight: "bold" }}>{params.value}</span>;
      }
    },
    { field: "dueDate", headerName: "Due Date", width: 150 },
    { field: "percentage", headerName: "% Complete", width: 110 },
    { field: "notes", headerName: "Notes", width: 150 },
    { field: "createdOn", headerName: "Created On", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      renderCell: (params) => {
        const todo = todos.find((t) => t._id === params.row.id);

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

  // If Admin, add "User" column at the start
  if (isAdmin) {
    columns.unshift({ field: "userEmail", headerName: "User", width: 200 });
  }

  return (
    <div style={{ height: 400, width: "100%", marginTop: "20px" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        disableRowSelectionOnClick
        getRowClassName={(params) => {
          if (!params.row.dueDate) return "";
          const due = new Date(params.row.dueDate);
          const today = new Date();
          today.setHours(0, 0, 0, 0); // normalize today
          // If due date is BEFORE today, it's overdue
          if (due < today) {
            return "overdue-row";
          }
          return "";
        }}
        sx={{
          background: "white",
          borderRadius: "10px",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "rgb(117, 121, 240)",
            color: "rgb(117, 121, 240)",
            fontSize: "16px",
            fontWeight: "bold",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold",
          },
          "& .overdue-row": {
            backgroundColor: "#ffebee !important", // Light red
            "&:hover": {
              backgroundColor: "#ffcdd2 !important",
            }
          }
        }}
      />
    </div>
  );
}
