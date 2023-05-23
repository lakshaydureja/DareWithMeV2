const express = require("express");
const app = express();
const server = require("http").Server(app);
app.set("view engine", "ejs");
const io = require("socket.io")(server, {
  cors: {
    origin: '*'
  }
});


app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("room")
});


io.on('connection', (socket) => {
  


  // allow user to go in a room
  socket.on('joinRoom', (roomCode) => {
    socket.join(roomCode);
   io.to(roomCode).emit('userJoined', socket.id);
   
  });




  //*test code below






});




server.listen(process.env.PORT || 3030);