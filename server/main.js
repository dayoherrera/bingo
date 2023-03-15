var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);

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
  console.log("Un cliente se ha conectado");
  socket.emit("messages", {
    id: 1,
    message: "Welcome!"
  });
});



// Con esta linea se le puede notificar a todos
// los usuarios con un mensaje
// io.sockets.emit("messages", messages);