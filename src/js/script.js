
const SNAKE_BODY = { 
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
const soundHolder = document.getElementById('sound-holder');
const snake = {
  x: 20,
  y: 40,
  dx: 10,
  dy: 0,
  cellSize: 40,
  body: [
    { x: 10, y: 40 },
    { x: 50, y: 40 },
    { x: 90, y: 40 },
  ],
  color: 'hsla(14, 51%, 70%, 125)'
};


const eatSound = new Audio("./assets/sounds/eat.mp3");
eatSound.volume = 0.5; 
const loseSound = new Audio("./assets/sounds/lose.mp3");
loseSound.volume = 0.5;
const pattern = [
    'rgb(162, 209, 73)',
    'rgb(170, 215, 81)',
]
const canvasContainer = document.getElementById('canvas-container');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let currentScore = document.getElementById('score');
currentScore.innerHTML = 0;
let gameIntervalId;
let gameIsRunning = true;
let isSoundOn = true;

let food = {
  x: Math.floor(Math.random() * 17 ) * snake.cellSize,
  y: Math.floor(Math.random() * 17 ) * snake.cellSize,
  isEaten: false
}
let highScore = 0

function playSound(audio) {
  audio.pause()
  audio.currentTime = 0
  audio.play()
 }


 function toggleSound() {
  const soundImage = document.querySelector('.sound');
  if (isSoundOn) {
    soundImage.src = "./assets/svg/sound_off.svg";
    eatSound.volume = 0;
    isSoundOn = false;
  } else {
    soundImage.src = "./assets/svg/sound_on.svg";
    eatSound.volume = 0.5;
    isSoundOn = true;
  }
}
function changeSnakeColor() {
    const randomColor = 'hsla(' +Math.floor(Math.random() * 360) + ', 50%, 70%, 1)';
    snake.color = randomColor;
    drawSnake()
  }

function startGame() {
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

  document.addEventListener('keydown', (e) => {
      e.preventDefault();
      startScreen.close();
      document.removeEventListener('keydown', startGame); 
      startGameLoop();
    });

  startScreen.addEventListener('click', (e) => {
      e.preventDefault();
      startScreen.close();
      document.removeEventListener('click', startGame); 
      startGameLoop();

    });
}

function drawGridToCanvas() {
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

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGridToCanvas();
}

function startGameLoop() {
  if(gameIntervalId) return;
  gameIntervalId = setInterval(() => {
    clearCanvas();
    if(gameIsRunning) {
      updateSnake();
      drawFoodOnCanvas();
      foodCollision();
      loserScreenLoad();
      drawSnake();

    }
  }, 70);
}
function stopGameLoop() {
  clearInterval(gameIntervalId);
  gameIntervalId = null;
}
//gameLogic.js

//snake functions


function drawSnake() {
  snake.body.forEach((segment, index) => {
    let color;
    if (index === 0) {
      color = snake.color;
    } else {
      color = 'hsla(' + Math.floor(Math.random() * 360) + ', 50%, 70%, 1)';
    }
    const scaledX = segment.x - (segment.x % snake.cellSize);
    const scaledY = segment.y - (segment.y % snake.cellSize);

    ctx.fillStyle = color;
    ctx.fillRect(scaledX, scaledY, snake.cellSize, snake.cellSize);
  });
}

function updateSnake() {
  const head = { x: snake.body[0].x + snake.dx, y: snake.body[0].y + snake.dy };

  if (
    head.x < 0 || head.x >= canvas.width - 150 ||
    head.y < 0 || head.y >= canvas.height - 150
  ) {
    createLoserScreen();
    return; 
  }

  snake.body.unshift({ x: head.x, y: head.y });

  snake.body.pop(); 
}






function drawFoodOnCanvas() {

  if (food.isEaten) {
    clearCanvas();
    playSound(eatSound); 
    drawGridToCanvas();  
     
      food.x = Math.floor(Math.random() * 17 ) * snake.cellSize
      food.y = Math.floor(Math.random() * 17 ) * snake.cellSize
      food.isEaten = false;
  }


  const foodElement = document.createElement('div');
  foodElement.classList.add('food');
  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, food.x, food.y, snake.cellSize, snake.cellSize);
  }
  img.src = './assets/animations/apple.png';

}

function foodCollision() {
  const head = snake.body[0];
  const proximityRange = -19; 
  if (
    head.x + snake.cellSize >= food.x - proximityRange &&
    head.x <= food.x + snake.cellSize + proximityRange &&
    head.y + snake.cellSize >= food.y - proximityRange &&
    head.y <= food.y + snake.cellSize + proximityRange
  ) {
    food.isEaten = true;
    currentScore.innerHTML = Number(currentScore.innerHTML) + 1
    snake.body.push({ y: head.y });
    changeSnakeColor();
  } else {
    food.isEaten = false;
  }
}


function createLoserScreen() { 
  playSound(loseSound);

  gameIsRunning = false;
  const currentScoreValue = Number(currentScore.innerHTML);

  if(currentScoreValue > highScore) {
    highScore = currentScoreValue;
  }

  const screen = document.createElement('div');
  screen.innerHTML = `
  <dialog id="loser-screen"> 
    <form method="dialog">
      <h1>GAME OVER</h1>  
      <p>Score: ${currentScoreValue}</p> <p>High Score: ${currentScore.innerHTML}</p>
  </dialog>
  `;
  canvasContainer.appendChild(screen);

  const dialog = document.getElementById('loser-screen');
  dialog.showModal();

  dialog.addEventListener('click', (e) => {
    e.preventDefault();
    dialog.close();
    restart()
    currentScore.innerHTML = 0
  })
  dialog.addEventListener('keydown', (e) => {
    e.preventDefault();
    dialog.close();
    restart()
    currentScore.innerHTML = 0
  })
}

function restart() {
  stopGameLoop();
  gameIsRunning = true;
  snake.body = [
    { x: 10, y: 40 }, 
    { x: 50, y: 40 }, 
    { x: 90, y: 40 }
  ];
  snake.dx = 10;
  snake.dy = 0;
  food.isEaten = false;
  snake.color = 'hsla(14, 51%, 70%, 125)';
  currentScore.innerHTML = 0;
}

function checkSnakeCollision() {
    for(let i = 1; i < snake.body.length; i++) {
      if(snake.body[0].x === snake.body[i].x && snake.body[0].y === snake.body[i].y) {
        return true;
      } 
    }
    return false;
}

function loserScreenLoad(){
    if(checkSnakeCollision()) {
      createLoserScreen();
    } else {
      //nothing
    } 
  }




window.addEventListener('keydown', (e) => {
  if(gameIsRunning) {
    const keyDown = e.key;

    if(keyDown.startsWith('Arrow')) {
      if(!gameIntervalId) startGameLoop();
    }
  }
  e.preventDefault();
})
soundHolder.addEventListener('click', toggleSound);

window.addEventListener('load', startGame);  

window.addEventListener('keydown', (e) => {
  if (gameIsRunning) {
    const keydown = e.key;

    if (keydown === 'ArrowUp' && snake.dy !== 10) {
      snake.dx = 0;
      snake.dy = -10;

    } else if (keydown === 'ArrowDown' && snake.dy !== -10) {
      snake.dx = 0;
      snake.dy = 10;

    } else if (keydown === 'ArrowLeft' && snake.dx !== 10) {
      snake.dx = -10;
      snake.dy = 0;

    } else if (keydown === 'ArrowRight' && snake.dx !== -10) {
      snake.dx = 10;
      snake.dy = 0;
    }
  }
  e.preventDefault(); // Prevent default behavior of arrow keys (scrolling, etc.)
});


