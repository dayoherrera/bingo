var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);

let users = [];


app.use(express.static("public"));

app.get("/", function(req, res){
  res.status(200).send("The server is running!.");
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
    console.log("Server USERS: ", users);
    
  });  

  //TODO: Emitiendo numero para todos los usuarios conectados
  socket.on("lottery", function (lotteryNumber) {
    if(users.length>=2){
      io.emit("lottery-broadcast", lotteryNumber); 
      console.log();
    }else{
      io.emit("waiting", "Esperando mas jugadores...");
    }
  });

  //TODO: Comprobando usuarios conectados
  if (socket.connected) {
    console.log("Sockets conectado",socket.id);
  }else{
    console.log("else");

    users.forEach(element => {
      if (socket.id == element.id) {
        console.log("socket.id == element.id");
      }
    });
  }
});


server.listen(8080, function () {
  console.log("Servidor corriendo en http://localhost:8080");
});

// Con esta linea se le puede notificar a todos
// los usuarios con un mensaje
// io.sockets.emit("messages", messages);