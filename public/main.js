var socket = io.connect("http://localhost:8080", { forceNew: true });

//TODO: Variable usada para el llenado del carton de bingo
let bingoArray = [
  // [1, 13, 11, 12, 15],//B
  // [16, 20, 28, 18, 30],//I
  // [31, 33, -1, 41, 45],//N
  // [46, 50, 58, 52, 60],//G
  // [61, 65, 62, 66, 75]//O
];
//TODO: Variables
let userId = 0;
let userName = "";
let players = {};
let starGame = false;
let waitMessage = '';
let winningArray = [];
const room = 'bingo';
let aceptGame = false;
let countdp = 0;
let stopGame = false;

//TODO: guardado de usuario en objeto
function saveUser() {
  nickName = document.getElementById("userName").value
    ? document.getElementById("userName").value
    : `Anonimo${userId}`;
  // Solicito entrar al juego con mi nombre
  userName = nickName;
  socket.emit("request-game", {
    playerName: nickName
  });
  players = { nickName: nickName, userId: userId };
  generateCardboard();
  document.getElementById("bingoSection").style.display = "block";
  document.getElementById("saveUser").disabled = true;
}

//TODO: aceptar carton de bingo
function acceptCardboard() {
  aceptGame = true;
  socket.emit('join-room', room);
  socket.emit('accept-cardboard', aceptGame);
  document.getElementById('messages').innerHTML = `Se ha unido al ${room}`;
  document.getElementById("lotterySection").style.display = "block";
  document.getElementById('acceptedCardboard').style.display = 'none';
  document.getElementById('changeCardboard').style.display = 'none';
  document.getElementById('sayBingo').style.display = 'block';
  setTimeout(function(){
    document.getElementById('messages').style.display = 'none';
  }, 5000);
  startGameFunction();

}

//TODO: cambiar carton de bingo
function changeCardboard() {
  generateCardboard();
}

//TODO:Se generara el carton para el juego
function generateCardboard() {
  for (let i = 0; i < 5; i++) {
    bingoArray[i] = new Array(5);
    for (let j = 0; j < 5; j++) {
      switch (i) {
        case 0:
          bingoArray[i][j] = this.randomNumber(15, 1, 0);
          break;
        case 1:
          bingoArray[i][j] = this.randomNumber(30, 16, 1);
          break;
        case 2:
          bingoArray[i][j] = this.randomNumber(45, 31, 2);
          break;
        case 3:
          bingoArray[i][j] = this.randomNumber(60, 46, 3);
          break;
        case 4:
          bingoArray[i][j] = this.randomNumber(75, 61, 4);
          break;
        default:
          break;
      }
    }
  }
  bingoArray[2][2] = -1;
  setTable(bingoArray);
}

// TODO: Se comprueba que no este ningun numero repetido para generar el carton de bingo
function randomNumber(max, min, i) {
  let value = Math.round(Math.random() * (max - min) + min);
  let repeat = bingoArray[i].includes(value);

  if (repeat) {
    value = randomNumber(max, min, i);
  }
  return value;
}

// TODO: mostrar el carton de bingo con los valores generados aleatoriamente
function setTable(arrayBingoValues) {
  const newnode = document.querySelector("#table");
  newnode.innerHTML =
    '<tr class="text-center">' +
    "<th>B</th>" +
    "<th>I</th>" +
    "<th>N</th>" +
    "<th>G</th>" +
    "<th>O</th>" +
    "</tr>";

  for (var i = 0; i < 5; i++) {
    newnode.innerHTML +=
      '<tr class="text-center">' +
      "<td><button class='btn btn-outline-secondary' type='button' id='" + arrayBingoValues[0][i] + "' >"+
      arrayBingoValues[0][i] +
      "</button></td>" +
      "<td><button class='btn btn-outline-secondary' type='button' id='" + arrayBingoValues[1][i] + "' >" +
      arrayBingoValues[1][i] +
      "</button></td>" +
      "<td><button class='btn btn-outline-secondary' type='button' id='" + arrayBingoValues[2][i] + "' >" +
      arrayBingoValues[2][i] +
      "</button></td>" +
      "<td><button class='btn btn-outline-secondary' type='button' id='" + arrayBingoValues[3][i] + "' >" +
      arrayBingoValues[3][i] +
      "</button></td>" +
      "<td><button class='btn btn-outline-secondary' type='button' id='" + arrayBingoValues[4][i] + "' >" +
      arrayBingoValues[4][i] +
      "</button></td>" +
      "</tr>";
  }
}

//TODO: Genera el vector con valores ganadores
function addWinningNumbers(value) {
  winningArray.push(value);
  this.winner(value,bingoArray);
}

//TODO: comprueba si hay o no ganador
function winner(value,bingoArray) { 
  
  for(let i = 0; i < bingoArray.length; i++) {
    for(let j = 0; j < bingoArray[i].length; j++) {
      // TODO: Comparamos cada valor de la matriz con el número especificado
      if(bingoArray[i][j] === value) {
        document.getElementById(`${bingoArray[i][j]}`).style.backgroundColor = "#f52585";
        document.getElementById(`${bingoArray[i][j]}`).style.color = "white";
        
        //TODO: case diagonal principal
        if(i === j && bingoArray[2][2] === -1){
          countdp++;
          console.log("Valor de countdp en Case", countdp);
        }
        if (countdp === 4) {
          document.getElementById(`${bingoArray[2][2]}`).style.backgroundColor = "#f52585";
          document.getElementById(`${bingoArray[2][2]}`).style.color = "white";
          stopGame = true;
        }

        
      }
    }
  }
  if (stopGame) {
    console.log("ganador para el caso anterior stop Game");
  }
}


//TODO: Se comienza con el juego
function startGameFunction() {
  starGame = true;
  let valueChange = document.getElementById("changeCardboard");

  //TODO: al ser aceptado el carton se deshabilita el boton de cambiar carton
  if (starGame) {
    valueChange.disabled = true;
  }
  //TODO: inicia el llamado al sorteo   
  socket.on('lottery-broadcast', (character,value) => {
    addWinningNumbers(value);
    document.getElementById("aleatoryNumber").value = `${character}${value}`;
    document.getElementById("waitMessage").style.display = 'none';
  });
}

//TODO: funcion para validar cantar bingo
function sayBingo(){
  console.log("es bingooooooooooo");
}

//TODO: Salir de la sala
function leaveBingoRoom() {
  socket.emit('leave', room);
  document.getElementById('messages').innerHTML = `Ha salido del ${room}`;
  setTimeout(function(){
    document.getElementById('messages').style.display = 'none';
  }, 5000);
}

//TODO: sockets=========================>
socket.on("messages", function (data) {
  console.log("Cliente: ", data);
});

//TODO: usuario  uniendose al juego
socket.on("joined-game", function (data) {
  userId = data.id;
});


//TODO: Escuchando Emision de espera a mas jugadores
socket.on("waiting", function (waitMessage) {
  document.getElementById("waitMessage").style.display = 'block';
  document.getElementById("waitMessage").innerHTML = waitMessage;
});

//TODO: que usuario se desconecto del servidor
socket.on('userDisconnected', (data) => {
  document.getElementById("userDisconnected").style.display = 'block';
  document.getElementById("userDisconnected").innerHTML = `${data.user} ha abandonado el juego`;

  setTimeout(function(){
    document.getElementById("userDisconnected").style.display = 'none';
  }, 5000);
});
