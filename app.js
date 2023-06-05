const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

const http = require("http");
const path = require("path");
const socketIo = require("socket.io");

const publicPath = path.join(__dirname, "/public");
let server = http.createServer(app);
let io = socketIo(server);

app.use(express.static(publicPath));

io.on("connection", (socket) => {

  console.log("A new user is just connected");

  socket.on("disconnect", () => {
    console.log("User was diconnected");
  });
});

server.listen(port, () => {
  console.log(`Server started at ${port}`);
});
