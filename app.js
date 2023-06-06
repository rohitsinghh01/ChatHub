const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

const http = require("http");
const path = require("path");
const socketIo = require("socket.io");
const { generateMessage,generateLocationMessage } = require("./utils/message");

const publicPath = path.join(__dirname, "/public");
let server = http.createServer(app);
let io = socketIo(server);

app.use(express.static(publicPath));

io.on("connection", (socket) => {
  console.log("A new user is just connected");

  socket.emit("newMessage", generateMessage("Admin", "Welcome to ChatHub!!!"));

  socket.broadcast.emit(
    "newMessage",
    generateMessage("Admin", "New User joined!!!")
  );

  socket.on("createMessage", (message, callback) => {
    console.log("createMessage", message);
    io.emit("newMessage", generateMessage(message.from, message.text));
    callback("This is the server");
  });

  socket.on("createLocationMessage", (coords) => {
    io.emit(
      "newLocationMessage",
      generateLocationMessage("Admin", coords.lat,coords.long)
    );
  });

  socket.on("disconnect", () => {
    console.log("User was diconnected");
  });
});

server.listen(port, () => {
  console.log(`Server started at ${port}`);
});
