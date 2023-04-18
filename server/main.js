var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);

let users = [];
let winningArray = []; //Para probar 1,11,31,46,61,10,20,30,51,67,11,28,40,59,63,12,18,42,52,66,15,30,45,60,75
let n = 75;

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
  socket.on("accept-cardboard", function (acceptCardboard) {
    console.log('acceptCardboard: ', acceptCardboard);
    if(  acceptCardboard && users.length > 1){
      //TODO: Se muestran valores alfanumericos alearorios de sorteo
      setInterval(() => { 
        let character;
        let number;
        let position;
        const characters = ["B", "I", "N", "G", "O"];
        for (let i = 0; i < 5; i++) {
          position = Math.round(Math.random() * (4 - 0));
          character = characters[position];
        }

        switch (position) {
          case 0:
            number = randomAlphaNumeric(15, 1, position);
            break;
          case 1:
            number = randomAlphaNumeric(30, 16, position);
            break;
          case 2:
            number = randomAlphaNumeric(45, 31, position);
            break;
          case 3:
            number = randomAlphaNumeric(60, 46, position);
            break;
          case 4:
            number = randomAlphaNumeric(75, 61, position);
            break;
          default:
            break;
        }
        
        // TODO: Se funcion general de generan numeros aleatorios
        function randomAlphaNumeric(max, min, i) {
          let value = Math.round(Math.random() * (max - min) + min);
          let repeat = winningArray.includes(value);   

          if(n === 0) return winningArray;
          if (repeat) {
            n=n;
            return value = randomAlphaNumeric(max, min, i);
          }else{
            n=n-1;
            winningArray.push(value); 
            return value;
          }
        }
        io.emit("lottery-broadcast", character, number);
      }, 6000);
    }
    if(users.length == 1 && acceptCardboard){
      socket.emit("waiting", "Esperando mas jugadores...");
    }
  });
  
  //TODO: Comprobando usuarios conectados
  if (socket.connected) {
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

  //TODO: Unirse a una sala y obtener el ID de la sala
  socket.on("join-room", (room, id) => {
    socket.join(room);
    const roomAdapter = io.of("/").adapter.rooms[room];
    const roomId = roomAdapter ? roomAdapter.id : null;
  });

  //TODO: Salir de una sala al presionar el boton salir
  socket.on('leave', (room) => {
    socket.leave(room);
    console.log(`El usuario ha salido de la sala: ${room}`);
  });

  //TODO: Enviar un mensaje a la sala
  socket.on('message', (room, message) => {
    io.to(room).emit('message', message);
  });

 

});

server.listen(8080, function () {
  console.log("Servidor corriendo en http://localhost:8080");
});

// Con esta linea se le puede notificar a todos
// los usuarios con un mensaje
// io.sockets.emit("messages", messages);