let socket = io();

function scrolltoBottom() {
  let messages = document.querySelector("#messages").lastElementChild;
  messages.scrollIntoView();
}

// function setUserImage() {
//   let gender = localStorage.getItem("gender");
//   var randomImage = new Array();
//   if (gender === "male") {
//     randomImage[0] = "https://bootdey.com/img/Content/user_1.jpg";
//     randomImage[1] = "https://bootdey.com/img/Content/user_3.jpg";
//     randomImage[2] = "https://bootdey.com/img/Content/user_6.jpg";
//     randomImage[3] = "https://bootdey.com/img/Content/user_5.jpg";
//     var number = Math.floor(Math.random() * randomImage.length);
//     document.getElementById("cht-img").innerHTML =
//       '<img src="' + randomImage[number] + '" />';
//     document.getElementById("userImg").innerHTML =
//       '<img src="' + randomImage[number] + '" />';
//   } else {
//     randomImage[0] = "https://bootdey.com/img/Content/user_2.jpg";
//     var number = Math.floor(Math.random() * randomImage.length);
//     document.getElementById("cht-img").innerHTML =
//       '<img src="' + randomImage[number] + '" />';
//     document.getElementById("userImg").innerHTML =
//       '<img src="' + randomImage[number] + '" />';
//   }
// }

// LISTENING FOR CONNECTION
socket.on("connect", function () {
  let searchQuery = window.location.search.substring(1);
  let params = JSON.parse(
    '{"' +
      decodeURI(searchQuery)
        .replace(/&/g, '","')
        .replace(/\+/g, " ")
        .replace(/=/g, '":"') +
      '"}'
  );
  console.log(params);
  socket.emit("join", params, function (err) {
    if (err) {
      alert(err);
      window.location.href = "/";
    } else {
      console.log("No Error");
    }
  });
});

// LISTENING FOR DISCONNECTION
socket.on("disconnect", function () {
  console.log("Disconnected to the server....");
});

socket.on("updateUsersList", function (users) {
  let ol = document.createElement("ol");

  users.forEach(function (user) {
    let li = document.createElement("li");
    li.innerHTML = user;
    ol.appendChild(li);
  });

  let usersList = document.querySelector("#user-list");
  usersList.innerHTML = "";
  usersList.appendChild(ol);
});

// LISTENING FOR NEW MESSAGE FROM THE SERVER
socket.on("newMessage", function (message) {
  const template = document.querySelector("#message-template").innerHTML;
  const html = Mustache.render(template, {
    from: message.from,
    text: message.text,
    createdAt: message.createdAt,
  });

  const div = document.createElement("div");
  div.innerHTML = html;
  document.querySelector("#messages").appendChild(div);
  scrolltoBottom();
});

// LISTENING FOR NEW LOCATION MESSAGE FROM THE SERVER
socket.on("newLocationMessage", function (message) {
  const template = document.querySelector("#location-template").innerHTML;
  const html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: message.createdAt,
  });

  const div = document.createElement("div");
  div.innerHTML = html;
  document.querySelector("#messages").appendChild(div);
  scrolltoBottom();
});

// SENDING THE MESSAGE TO ALL CLIENTS ON CLICK SUBMIT BUTTON
document.querySelector("#submit-btn").addEventListener("click", function (e) {
  e.preventDefault();

  socket.emit("createMessage", {
    from: "User",
    text: document.querySelector('input[name="message"]').value,
  });
  document.getElementById("message-form").reset();
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
