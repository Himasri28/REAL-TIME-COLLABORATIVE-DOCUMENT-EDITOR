const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // your React frontend
    methods: ["GET", "POST"],
  },
});

let documentText = ""; // shared document text (optional: store in MongoDB)

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Send existing text when user joins
  socket.emit("text-update", documentText);

  // Listen for text changes
  socket.on("text-change", (newText) => {
    documentText = newText;
    console.log("Received text:", newText);
    socket.broadcast.emit("text-update", newText);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});
