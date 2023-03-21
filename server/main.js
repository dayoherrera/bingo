var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);

let users = [];


app.use(express.static("public"));

app.get("/", function(req, res){
  res.status(200).send("The server is running!.");
});

server.listen(8080, function () {
  console.log("Servidor corriendo en http://localhost:8080");
});


// Aqui se puede generar el carton al usuario
// que se conectó
io.on("connection", function (socket) {
  console.log("Un cliente se ha conectado: ", socket.id);
  socket.emit("joined-game", {
    id: socket.id
  });

  // Guardando el nuevo usuario.
  socket.on("request-game", function (socket) {
    users.push({
      "id": this.id,
      "userName": socket.playerName,
    });
    console.log("USERS: ", users);
  });
});





// Con esta linea se le puede notificar a todos
// los usuarios con un mensaje
// io.sockets.emit("messages", messages);