const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const app = express();

const loadMap = require("./mapLoader");

const PORT = 3009;

app.use(cors({ origin: "*" }));

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  }
});

// MAIN
async function Main() {
    const map2D = await loadMap();

// GLOBAL SOCKET HANDLER
io.on("connection", (socket) => {
    console.log("user connected", socket.id);

    // direct socket sender
    socket.emit('map', map2D);
});

app.use(express.static('public'));

// SERVER SETTINGS 
httpServer.listen(PORT, () => {
  console.log(`SERV :: Running on ${PORT}`);
});


}

Main();