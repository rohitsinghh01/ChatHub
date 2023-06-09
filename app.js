const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

const http = require("http");
const path = require("path");
const socketIo = require("socket.io");

const { generateMessage, generateLocationMessage } = require("./utils/message");
const { isRealString } = require("./utils/isRealString");
const { Users } = require("./utils/users");

const publicPath = path.join(__dirname, "/public");
let server = http.createServer(app);
let io = socketIo(server);
let users = new Users();

app.use(express.static(publicPath));

io.on("connection", (socket) => {
  console.log("A new user is just connected");

  socket.on("join", (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback("Name and room are required");
    }
    // console.log(params.name,params.room,params.gender
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit("updateUsersList", users.getUserList(params.room));

    socket.emit(
      "newMessage",
      generateMessage("ChatHub", `Welcome to ${params.room} chat room!!!`)
    );
    let user = users.getUser(socket.id);
    socket.broadcast
      .to(params.room)
      .emit("newMessage", generateMessage("ChatHub", `${user.name} has joined!!!`));
    callback();
  });

  socket.on('createMessage', (message, callback) => {
    let user = users.getUser(socket.id);

    if(user && isRealString(message.text)){
        io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
  })

  socket.on('createLocationMessage', (coords) => {
    let user = users.getUser(socket.id);

    if(user){
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.lat, coords.long))
    }
  })

  socket.on("disconnect", () => {
    let user = users.removeUser(socket.id);
    // console.log(user.room)
    if (user) {
      io.to(user.room).emit("updateUsersList", users.getUserList(user.room));
      io.to(user.room).emit(
        "newMessage",
        generateMessage(
          "ChatHub",
          `${user.name} has left the ${user.room} chat room`
        )
      );
    }
    console.log("User was diconnected");
  });
});

server.listen(port, () => {
  console.log(`Server started at ${port}`);
});
