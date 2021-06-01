const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

var os = require('os');
console.log(getLocalAddress());

function getLocalAddress() {
  var ifacesObj = {}
  ifacesObj.ipv4 = [];
  ifacesObj.ipv6 = [];
  var interfaces = os.networkInterfaces();

  for (var dev in interfaces) {
    interfaces[dev].forEach(function (details) {
      if (!details.internal) {
        switch (details.family) {
          case "IPv4":
            ifacesObj.ipv4.push({ name: dev, address: details.address });
            break;
          case "IPv6":
            ifacesObj.ipv6.push({ name: dev, address: details.address })
            break;
        }
      }
    });
  }
  return ifacesObj;
};
app.get("/getlocalip", (req, res) => {
  res.send(getLocalAddress());
});

/**
 * "/"にアクセスがあったらindex.htmlを返却
 */
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});


app.get("/commander.js", (req, res) => {
  res.sendFile(__dirname + "/commander.js");
});
app.get("/index.css", (req, res) => {
  res.sendFile(__dirname + "/index.css");
});
app.get("/feedbackchan.js", (req, res) => {
  res.sendFile(__dirname + "/feedbackchan.js");
});
app.get("/img/youtube_social_icon_red.png", (req, res) => {
  res.sendFile(__dirname + "/img/youtube_social_icon_red.png");
});


/**
 * [イベント] ユーザーが接続
 */
io.on("connection", (socket) => {
  console.log("ユーザーが接続しました");
  io.emit("new_connection", "new commer!");

  socket.on("post", (msg) => {
    io.emit("member-post", msg);
  });
});

/**
 * 3000番でサーバを起動する
 */
http.listen(4000, () => {
  console.log("listening on *:4000");
});