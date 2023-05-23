const socket = io("/");

// const videoGrid1 = document.getElementById("video-grid1");
// const videoGrid2 = document.getElementById("video-grid2");
// const roomcodeVAL = document.getElementById('roomcodeVAL');

let angle = 0;
const pointer = document.querySelector("#IDbottle");
const btn = document.querySelector("#btnspin");

var peerjsId;
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

const defCode = Math.floor(
  Math.random() * (999999 - 100000 + 1) + 100000
).toString();

function joinRoom(roomId) {
  const peer = new Peer();

  peer.on("open", function () {
    const conn = peer.connect(roomId);

    conn.on("open", function () {
      console.log("Connected to room", roomId);

      // Initiate video call
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(function (stream) {
          // Display local video stream
          //  const localVideo = document.getElementById('localVideo');
          localVideo.srcObject = stream;

          // Call the remote peer
          const call = peer.call(roomId, stream);

          // Answer the incoming call
          call.answer(stream);

          // Display remote video stream
          const remoteVideo = document.getElementById("remoteVideo");
          call.on("stream", function (remoteStream) {
            remoteVideo.srcObject = remoteStream;
          });
        })
        .catch(function (error) {
          console.error("Error accessing media devices:", error);
        });

      btn.addEventListener("click", function () {
        angle = angle + 2 * 360 + Math.random() * 360;
        conn.send(angle);
        spin(angle);
      });

      // Receive messages
      conn.on("data", (variableValue) => {
        // Log the received variable value
        console.log("Received Variable:", variableValue);
        spin(variableValue);
      });
    });
  });
}

// Function to create a room
function createRoom(userId) {
  let localStream;

  // Create a PeerJS connection.
  const peer = new Peer(userId);

  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then(function (stream) {
      // Display local video stream
      // const localVideo = document.getElementById('localVideo');
      localStream = stream;
      localVideo.srcObject = localStream;
    });

  peer.on("open", function () {
    console.log("Room created with user ID:", userId);

    peer.on("connection", function (conn) {
      conn.on("open", function () {
        console.log("Connection established with", conn.peer);

        peer.on("call", function (call) {
          // Answer the incoming call
          call.answer(localStream);

          // Display remote video stream
          const remoteVideo = document.getElementById("remoteVideo");
          call.on("stream", function (remoteStream) {
            remoteVideo.srcObject = remoteStream;
          });
        });
      });

      btn.addEventListener("click", function () {
        angle = angle + 2 * 360 + Math.random() * 360;
        conn.send(angle);
        spin(angle);
      });

      conn.on("data", (variableValue) => {
        // Log the received variable value
        console.log("Received Variable:", variableValue);
        spin(variableValue);
      });
      // // Send messages
      // conn.send("Hello!");
    });
  });
}

function createRoomx() {
  console.log("room created");
  // var roomcode = generateRoomCode();
  // console.log(roomcode);
  document.getElementById("roomcodeP").innerHTML = "Room code is: " + defCode;
  socket.emit("joinRoom", defCode);
  console.log(`User ${socket.id} joined room ${defCode}`);

  createRoom(defCode);
}

function joinRoomx() {
  console.log("room joined");
  var roomcodeVAL = document.getElementById("roomcodeVAL").value;
  document.getElementById("roomcodeP").innerHTML =
    "Room code is: " + roomcodeVAL;
  socket.emit("joinRoom", roomcodeVAL);
  console.log(`User ${socket.id} joined room ${roomcodeVAL}`);

  joinRoom(roomcodeVAL);
}

// Event listener for user joining the room
socket.on("userJoined", (userId) => {
  console.log(`User ${userId} joined the room.`);
});

// btn.addEventListener("click", function () {
//   spin1();
// });

// function spin1(){
//   angle = angle + 2 * 360 + Math.random() * 360;
// spin(angle);
// }
//! Functions part started
function spin(x) {
  pointer.style.transform = `rotate(${x}deg)`;
}





function share() {
  var urlshare = prompt(
    "Copy this link and send it to people you want to meet with",
    window.location.href
  );
}

// Generate a random 6-digit room code
function generateRoomCode() {
  x = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000).toString();
  // socket.emit('roomcode', x);
  return x;
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
}
