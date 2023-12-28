//constants.js
const snakeBody = { 
  curve:'./assets/Graphics/body_bottom_left.png',
  curve2:'./assets/Graphics/body_bottom_right.png',
  bodyHorizontal:'./assets/Graphics/body_horizontal.png',
  bodyTopLeft:'./assets/Graphics/body_top_left.png',
  bodyTopRight:'./assets/Graphics/body_top_right.png',
  bodyVertical:'./assets/Graphics/body_vertical.png',
  headDown:'./assets/Graphics/head_down.png',
  headLeft:'./assets/Graphics/head_left.png',
  headRight:'./assets/Graphics/head_right.png',
  headUp:'./assets/Graphics/head_up.png',
  tailDown:'./assets/Graphics/tail_down.png',
  tailRight:'./assets/Graphics/tail_right.png',
  tailLeft:'./assets/Graphics/tail_left.png',
  tailUp:'./assets/Graphics/tail_up.png',
}

const pattern = [
    'rgb(162, 209, 73)',
    'rgb(170, 215, 81)',
]
const canvasContainer = document.getElementById('canvas-container');
const canvas1 = document.getElementById('canvas');
const ctx = canvas1.getContext('2d');

//elements.js
let score = document.getElementById('score');
score.innerHTML = 0;


//index.js

function startGame() {
  const canvasContainer = document.getElementById('canvas-container');
  const startScreen = document.createElement('dialog');
  startScreen.id = 'start-screen';
  startScreen.innerHTML = `
  <form method="dialog">
      <h1>START GAME</h1>  
      <p>PRESS ANY KEY TO START</p>
  </form>
  `;

  canvasContainer.appendChild(startScreen);
  startScreen.showModal();

  document.addEventListener('click', (e) => {
    if (e.target.id === 'start') {
      e.preventDefault();
      startScreen.close();
      document.removeEventListener('click', startGame);
      gameLoop();
    }
  })
  document.addEventListener('keydown', (e) => {
      e.preventDefault();
      startScreen.close();
      document.removeEventListener('keydown', startGame); 

      gameLoop();
    }
  );
}

function drawGridToCanvas() {
    const canvas = document.getElementById('canvas');
    canvas.width = 800; 
    canvas.height = 800;
    
    if(canvas.getContext) {
        const ctx = canvas.getContext('2d');
        const blockSize = 40;
        const rows = 17;
        const columns = 17;
        for(let i = 0; i < rows; i++) {
            for(let j = 0; j < columns; j++) {
                const x = j * blockSize;
                const y = i * blockSize;
                const colorIndex = (i + j) % 2;
                const color = pattern[colorIndex];
                ctx.fillStyle = color;
                ctx.fillRect(x, y, blockSize, blockSize);
            }
        }

    }
}

drawGridToCanvas();

function addImageToCanvas(xPos, yPos, src, canvas, scaleFactor) {
    const ctx = canvas.getContext('2d');
    const img = new Image();
img.onload = () => {
      const scaleWidth = img.width * scaleFactor;
      const scaleHeight = img.height * scaleFactor;
      ctx.drawImage(img, xPos, yPos, scaleWidth, scaleHeight);
  };
    img.src = src;
}  

//snake.js
const snake = {
  x: 10,
  y: 10,
  dx: 10,
  dy: 0,
  cellSize: 40,
  body: [
    { x: 10, y: 10 },
    { x: 50, y: 10 },
    { x: 90, y: 10 }
  ]
};

let gameIsRunning = true;

function drawSnake() {
  snake.body.forEach((segment, index) => {
    const image = new Image();
    if (index === 0) {
      image.src = snakeBody.headRight;
    } else if (index === snake.body.length - 1) {
      image.src = snakeBody.tailRight;
    } else {
      image.src = snakeBody.bodyHorizontal;
    }

    image.onload = () => {
      const scaledX = Math.round(segment.x / snake.cellSize) * snake.cellSize;
      const scaledY = Math.round(segment.y / snake.cellSize) * snake.cellSize;

      ctx.drawImage(
        image,
        scaledX,
        scaledY,
        snake.cellSize,
        snake.cellSize
      );
    };
  });
}
function createFood() {
  let food = {
    x: Math.floor(Math.random() * 17 + 1) * snake.cellSize,
    y: Math.floor(Math.random() * 17 + 1) * snake.cellSize
  };
food.x = document.createElement('div');
food.y = document.createElement('div');


}


function updateSnake() {
  const head = { x: snake.body[0].x + snake.dx, y: snake.body[0].y + snake.dy };

  if (
    head.x < 0 || head.x >= canvas1.width ||
    head.y < 0 || head.y >= canvas1.height
  ) {
    createLoserScreen();
    return; 
  }

  snake.body.unshift({ x: head.x, y: head.y });

  snake.body.pop(); 
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas1.width, canvas1.height);
}


function createLoserScreen() {
  gameIsRunning = false;
  const screen = document.createElement('div');
  screen.innerHTML = `
  <dialog id="loser-screen"> 
    <form method="dialog">
      <h1>GAME OVER</h1>  
      <p>Score: ${score.innerHTML}</p>
      <button id="restart" type="submit">Restart</button>
  </dialog>
  `;
  canvasContainer.appendChild(screen);

  const dialog = document.getElementById('loser-screen');
  dialog.showModal();
  const restartButton = document.getElementById('restart');

  restartButton.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    dialog.close();
    restart()
  }
  })

  restartButton.addEventListener('click', (e) => {
      e.preventDefault();
      dialog.close();
      restart()
  })
}

function restart() {
  gameIsRunning = true;
  snake.body = [{ x: 10, y: 10 }, { x: 50, y: 10 }, { x: 90, y: 10 }];
  snake.dx = 10;
  snake.dy = 0;
  const score = document.getElementById('score');
  score.innerHTML = 0;
}

function checkCollision() {
    for(let i = 1; i < snake.body.length; i++) {
      if(snake.body[0].x === snake.body[i].x && snake.body[0].y === snake.body[i].y) {
        return true;
      } 
    }
    return false;
}

function loserScreenLoad(){
    if(checkCollision()) {
      createLoserScreen();
    } else {
      //nothing
    } 
  }
 
function gameLoop() {
  clearCanvas();  
  drawGridToCanvas();
  if(gameIsRunning) {
    updateSnake();
    loserScreenLoad();
  }

  drawSnake();
  if(gameIsRunning) {
    setTimeout(gameLoop, 200); 
  }
}




//events.js
window.addEventListener('load', startGame);  


window.addEventListener('keydown', (e) => {
  if(gameIsRunning) { 
  const keydown = e.key;

  switch (keydown) {
    case 'ArrowUp':
      if (snake.dy !== 10) {
        snake.dx = 0;
        snake.dy = -10;
      }
      break;
    case 'ArrowDown':
      if (snake.dy !== -10) {
        snake.dx = 0;
        snake.dy = 10;
      }
      break;
    case 'ArrowLeft':
      if (snake.dx !== 10) {
        snake.dx = -10;
        snake.dy = 0;
      }
      break;
    case 'ArrowRight':
      if (snake.dx !== -10) {
        snake.dx = 10;
        snake.dy = 0;
      }
      break;
  }
}
});


