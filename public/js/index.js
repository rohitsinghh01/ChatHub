let socket = io();

function scrolltoBottom() {
  let messages = document.querySelector("messages").lastElementChild;
  messages.scrollIntoView();
}

// LISTENING FOR CONNECTION
socket.on("connect", function () {
  console.log("Connected to the server....");
});

// LISTENING FOR DISCONNECTION
socket.on("disconnect", function () {
  console.log("Disconnected to the server....");
});

// LISTENING FOR NEW MESSAGE FROM THE SERVER
socket.on("newMessage", function (message) {
  // console.log("newMessage", message);
  let li = document.createElement("li");
  li.innerText = `${message.from} ${message.createdAt} : ${message.text}`;
  document.querySelector("body").appendChild(li);
  scrolltoBottom();
});


// LISTENING FOR NEW LOCATION MESSAGE FROM THE SERVER
socket.on("newLocationMessage", function (message) {
  // console.log("newLocationMessage", message);
  let li = document.createElement("li");
  let a = document.createElement("a");
  li.innerText = `${message.from} ${message.createdAt} : `;
  a.setAttribute("target", "_blank");
  a.setAttribute("href", message.url);
  a.innerText = "My Current Location";
  li.appendChild(a);
  document.querySelector("body").appendChild(li);
  scrolltoBottom();
});


// SENDING THE MESSAGE TO ALL CLIENTS ON CLICK SUBMIT BUTTON
document.querySelector("#submit-btn").addEventListener("click", function (e) {
  e.preventDefault();

  socket.emit(
    "createMessage",
    {
      from: "User",
      text: document.querySelector('input[name="message"]').value,
    },
  );
});


// SENDING LOCATION TO ALL CLIENTS ON CLICK LOCATION BUTTON
document.querySelector("#send-location").addEventListener("click", function () {
  if (!navigator.geolocation) {
    return alert("Geoloaction is not supported by your browser.");
  }
  navigator.geolocation.getCurrentPosition(
    function (position) {
      socket.emit("createLocationMessage", {
        lat: position.coords.latitude,
        long: position.coords.longitude,
      });
    },
    function () {
      alert("Unable to fetch location.");
    }
  );
});
