let generateMessage = (from, text) => {
  var today = new Date();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return {
    from,
    text,
    createdAt: time,
  };
};

let generateLocationMessage = (from, lat, long) => {
  var today = new Date();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return {
    from,
    url: `https://www.google.com/maps?q=${lat},${long}`,
    createdAt: time,
  };
};

module.exports = { generateMessage, generateLocationMessage };
