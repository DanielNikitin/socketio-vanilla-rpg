const mapImage = new Image();
mapImage.src = '/Desert1.png';

const santaImage = new Image();
santaImage.src = '/santa.png';

const canvasEl = document.getElementById('canvas');
canvasEl.width = window.innerWidth;
canvasEl.height = window.innerHeight;
const canvas = canvasEl.getContext("2d");


const socket = io([`ws://localhost:3009`]);

let map = [[]];
let players = [];

const TILE_SIZE = 16;

socket.on('connect', () => {
    console.log("connected");
});

socket.on('map', (loadedMap) => {
    map = loadedMap;
});

socket.on('players', (serverPlayers) => {
    players = serverPlayers;
});

// KEYDOWN LISTENER
 window.addEventListener("keydown", (e) => {
     console.log(e.key);

     if (e.key === "w") {
        inputs["up"] = true;
     } else if (e.key === "s") {
        inputs["down"] = true;
     } else if (e.key === "d") {
        inputs["right"] = true;
     } else if (e.key === "a") {
        inputs["left"] = true;
     }
     socket.emit('inputs', inputs);
 });

// KEYUP LISTENER
window.addEventListener("keyup", (e) => {
    console.log(e.key);

    if (e.key === "w") {
       inputs["up"] = false;
    } else if (e.key === "s") {
       inputs["down"] = false;
    } else if (e.key === "d") {
       inputs["right"] = false;
    } else if (e.key === "a") {
       inputs["left"] = false;
    }
    socket.emit('inputs', inputs);
});

const inputs = {
    up: false,
    down: false,
    left: false,
    right: false,
};

function loop() {
    canvas.clearRect(0, 0, canvas.width, canvas.height);

    const TILES_IN_ROW = 8;

    // draw map
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[0].length; col++) {
            const { id } = map[row][col];
            const imageRow = parseInt(id / TILES_IN_ROW);
            const imageCol = id % TILES_IN_ROW;
            // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
            canvas.drawImage(
              mapImage,
              imageCol * TILE_SIZE,
              imageRow * TILE_SIZE,
              TILE_SIZE,
              TILE_SIZE,
              col * TILE_SIZE,
              row * TILE_SIZE,
              TILE_SIZE,
              TILE_SIZE
            );
        }
    }

    for (const player of players) {
        canvas.drawImage(santaImage, player.x, player.y);
    }

    window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);