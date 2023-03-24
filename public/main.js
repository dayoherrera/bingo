var socket = io.connect("http://localhost:8080", { forceNew: true });

//TODO: Variable usada para el llenado del carton de bingo
let bingoArray = [
  // [13, 13, 11, 12, 4],
  // [20, 20, 28, 18, 31],
  // [43, 33, 42, 41, 44],
  // [51, 61, 58, 52, 48],
  // [73, 65, 61, 66, 68]
];
//TODO: Variable usada para el id de usuarios
let userId = 0;
let userName = "";
let players = {};
let starGame = false;
let waitMessage = '';
let goMessage = '';
let usersConnected = 0;


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
}

//TODO: aceptar carton de bingo
function acceptCardboard() {
  document.getElementById("lotterySection").style.display = "block";
  startGameFunction();
}

//TODO: cambiar carton de bingo

function changeCardboard() {
  generateCardboard();
}

function generateCardboard() {
  //TODO:Se generara el carton para el juego
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

function randomNumber(max, min, i) {
  // TODO: Se comprueba que no este ningun numero repetido para generar el carton de bingo
  let value = Math.round(Math.random() * (max - min + 1) + min);
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
      "<td>" +
      arrayBingoValues[0][i] +
      "</td>" +
      "<td>" +
      arrayBingoValues[1][i] +
      "</td>" +
      "<td>" +
      arrayBingoValues[2][i] +
      "</td>" +
      "<td>" +
      arrayBingoValues[3][i] +
      "</td>" +
      "<td>" +
      arrayBingoValues[4][i] +
      "</td>" +
      "</tr>";
  }
}

//TODO: Se muestran valores alfanumericos alearorios de sorteo
function randomPosition() {
  let character;
  let value;
  let position;
  const characters = ["B", "I", "N", "G", "O"];
  for (let i = 0; i < 5; i++) {
    position = Math.round(Math.random() * (4 - 0));
    character = characters[position];
  }
  value = this.calculator(position);
  return `${character} ${value}`;
}

// TODO: Se funcion general de generan numeros aleatorios
function randomAlphaNumeric(max, min, i) {
  let value = Math.round(Math.random() * (max - min + 1) + min);
  return value;
}

// TODO: Se numeros aleatorios por letra B I N G O
function calculator(numberCase) {
  let newNumber = 0;
  switch (numberCase) {
    case 0:
      newNumber = this.randomAlphaNumeric(15, 1, numberCase);
      break;
    case 1:
      newNumber = this.randomAlphaNumeric(30, 16, numberCase);
      break;
    case 2:
      newNumber = this.randomAlphaNumeric(45, 31, numberCase);
      break;
    case 3:
      newNumber = this.randomAlphaNumeric(60, 46, numberCase);
      break;
    case 4:
      newNumber = this.randomAlphaNumeric(75, 61, numberCase);
      break;
    default:
      break;
  }
  return newNumber;
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
  setInterval(() => {
    socket.emit("lottery", randomPosition());
  }, 8000);
}

//TODO: sockets=========================
socket.on("messages", function (data) {
  console.log("Cliente: ", data);
});

//TODO: usuario  uniendose al juego
socket.on("joined-game", function (data) {
  userId = data.id;
});

//TODO: Escuchando Emision de broadcast
socket.on("lottery-broadcast", function (valor) {
  document.getElementById("aleatoryNumber").value = valor;
});

//TODO: Comprobando conexion
socket.on("connect", () => {
  if (socket.connected) {
    console.log("socket.userId====>",socket.userId);
    //emitir conexion
  } 
});

//TODO: Escuchando Emision de espera
socket.on("waiting", function (waitMessage) {
  document.getElementById("waitMessage").style.display = 'block';
  document.getElementById("waitMessage").innerHTML = waitMessage;
  //emitir mensaje
});








