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
    if(users.length > 1){
      io.emit("lottery-broadcast", lotteryNumber); 
    }
    if(users.length == 1){
      console.log("Esperando mas jugadores...");
      socket.emit("waiting", "Esperando mas jugadores...");
    }
  });

  //TODO: Comprobando usuarios conectados
  if (socket.connected) {
    console.log("Sockets conectado",socket.id);
  }

  //TODO: Usuario desconectado
  socket.on('disconnect', (reason) => {
    
    if(users.length > 0 ){
      let userDisconnected = users.find(element => element.id == socket.id);
      let userName = '';
      if(userDisconnected.userName){
        userName = userDisconnected.userName;
      }
      io.emit('userDisconnected', { user: userName , reason: reason});
      //TODO: para eliminar el usuario desconectado del array
      console.log("El usuario '" + userName + "' ha sido desconectado");
      users = users.filter(user=> user.id != socket.id);
      console.log("Server newUSERS: ", users);
    }else{
      console.log("Usuario con este id '" + socket.id + "' ha sido desconectado");
    }
  });
});


server.listen(8080, function () {
  console.log("Servidor corriendo en http://localhost:8080");
});

// Con esta linea se le puede notificar a todos
// los usuarios con un mensaje
// io.sockets.emit("messages", messages);