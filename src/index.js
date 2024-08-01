const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const app = express();

const loadMap = require("./mapLoader");

const PORT = 3009;

const TICK_RATE = 30;
const SPEED = 5;

app.use(cors({ origin: "*" }));

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  }
});

const players = [];
const inputsMap = {};

function tick() {
  for (const player of players) {
    const inputs = inputsMap[player.id];
    if (inputs.up) {
      player.y -= SPEED;
    } else if (inputs.down) {
      player.y += SPEED;
    }

    if (inputs.left) {
      player.x -= SPEED;
    } else if (inputs.right) {
      player.x += SPEED;
    }

    io.emit('players', players)
  }
}

// MAIN
async function Main() {
    const map2D = await loadMap();

// GLOBAL SOCKET HANDLER
io.on("connection", (socket) => {
    console.log("user connected", socket.id);

    inputsMap[socket.id] = {
      up: false,
      down: false,
      left: false,
      right: false,
    };

    players.push({
      id: socket.id,
      x: 0,
      y: 0,
    });

    // direct socket sender
    socket.emit('map', map2D);

    socket.on('inputs', (inputs) => {
      inputsMap[socket.id] = inputs;
    });

});

app.use(express.static('public'));

// SERVER SETTINGS 
httpServer.listen(PORT, () => {
  console.log(`SERV :: Running on ${PORT}`);
});

setInterval(tick, 1000 / TICK_RATE);

}

Main();