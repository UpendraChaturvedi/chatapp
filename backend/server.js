import { createServer } from "node:http";
import { Server } from "socket.io";
import express from "express";

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 4600;

const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST"],
  },
});

const ROOM = "group1";

io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  socket.on("joinRoom", (userName) => {
    socket.join(ROOM);
    console.log(`${userName} joined ${ROOM}`);

    // emit to everyone in the room
    io.to(ROOM).emit("roomNotice", userName);
  });

  socket.on("chatMessage", (msg) => {
    io.to(ROOM).emit("chatMessage", msg);
  });

  socket.on("typing", (userName) => {
    socket.broadcast.to(ROOM).emit("typing", userName);
  });

  socket.on("stopTyping", (userName) => {
    socket.broadcast.to(ROOM).emit("stopTyping", userName);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

server.listen(PORT, () => {
  console.log("server running at http://localhost:4600");
});
