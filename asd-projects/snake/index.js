/* global $, sessionStorage*/

////////////////////////////////////////////////////////////////////////////////
///////////////////////// VARIABLE DECLARATIONS ////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// HTML jQuery Objects
var board = $("#board");
var scoreElement = $("#score");
var highScoreElement = $("#highScore");

// Game Variables
var apple = {};
var score = 0; // variable to keep track of the score
var started = false; // variable to keep track of whether the game has started
var snake = {};

// Constant Variables
var ROWS = 20;
var COLUMNS = 20;
var SQUARE_SIZE = 20;
var KEY = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
};

// interval variable required for stopping the update function when the game ends
var updateInterval;

// variable to keep track of the key (keycode) last pressed by the user
var activeKey;

////////////////////////////////////////////////////////////////////////////////
////////////////////////////// GAME SETUP //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// turn on keyboard inputs
$("body").on("keydown", handleKeyDown);

// start the game
init();

function init() {
  board.empty();

  snake.body = [];
  snake.head = null;
  snake.tail = null;

  makeSnakeSquare(10, 10);
  makeSnakeSquare(10, 9);
  makeSnakeSquare(10, 8);

  snake.head = snake.body[0];
  snake.head.direction = "right";

  makeApple();

  score = 0;
  scoreElement.text("Score: 0");
  started = false;

  if (updateInterval) {
    clearInterval(updateInterval);
  }
  updateInterval = setInterval(update, 100);
}

////////////////////////////////////////////////////////////////////////////////
///////////////////////// PROGRAM FUNCTIONS ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function update() {
  if (started) {
    moveSnake();
  }

  if (hasHitWall() || hasCollidedWithSnake()) {
    endGame();
    return;
  }

  if (hasCollidedWithApple()) {
    handleAppleCollision();
  }
}

function checkForNewDirection() {
  if (activeKey === KEY.LEFT && snake.head.direction !== "right") {
    snake.head.direction = "left";
  } else if (activeKey === KEY.RIGHT && snake.head.direction !== "left") {
    snake.head.direction = "right";
  } else if (activeKey === KEY.UP && snake.head.direction !== "down") {
    snake.head.direction = "up";
  } else if (activeKey === KEY.DOWN && snake.head.direction !== "up") {
    snake.head.direction = "down";
  }
}

function moveSnake() {
  for (var i = snake.body.length - 1; i >= 1; i--) {
    var currentSnakeSquare = snake.body[i];
    var snakeSquareInFront = snake.body[i - 1];

    moveBodyAToBodyB(currentSnakeSquare, snakeSquareInFront);
    repositionSquare(currentSnakeSquare);
  }

  checkForNewDirection();

  if (snake.head.direction === "left") {
    snake.head.column = snake.head.column - 1;
  } else if (snake.head.direction === "right") {
    snake.head.column = snake.head.column + 1;
  } else if (snake.head.direction === "up") {
    snake.head.row = snake.head.row - 1;
  } else if (snake.head.direction === "down") {
    snake.head.row = snake.head.row + 1;
  }

  repositionSquare(snake.head);
}

function moveBodyAToBodyB(bodyA, bodyB) {
  bodyA.row = bodyB.row;
  bodyA.column = bodyB.column;
  bodyA.direction = bodyB.direction;
}

function hasHitWall() {
  return (
    snake.head.row < 0 ||
    snake.head.row >= ROWS ||
    snake.head.column < 0 ||
    snake.head.column >= COLUMNS
  );
}

function hasCollidedWithApple() {
  return snake.head.row === apple.row && snake.head.column === apple.column;
}

function handleAppleCollision() {
  score++;
  scoreElement.text("Score: " + score);

  apple.element.remove();
  makeApple();

  var row = snake.tail.row;
  var column = snake.tail.column;
  makeSnakeSquare(row, column);
}

function hasCollidedWithSnake() {
  for (var i = 1; i < snake.body.length; i++) {
    if (
      snake.head.row === snake.body[i].row &&
      snake.head.column === snake.body[i].column
    ) {
      return true;
    }
  }

  return false;
}

function endGame() {
  clearInterval(updateInterval);
  started = false;

  board.empty();

  highScoreElement.text("High Score: " + calculateHighScore());
  scoreElement.text("Score: 0");
  score = 0;

  setTimeout(init, 500);
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function makeApple() {
  apple.element = $("<div>").addClass("apple").appendTo(board);

  var randomPosition = getRandomAvailablePosition();
  apple.row = randomPosition.row;
  apple.column = randomPosition.column;

  repositionSquare(apple);
}

function makeSnakeSquare(row, column) {
  var snakeSquare = {};

  snakeSquare.element = $("<div>").addClass("snake").appendTo(board);
  snakeSquare.row = row;
  snakeSquare.column = column;
  snakeSquare.direction = snake.tail ? snake.tail.direction : "right";

  repositionSquare(snakeSquare);

  if (snake.body.length === 0) {
    snakeSquare.element.attr("id", "snake-head");
  }

  snake.body.push(snakeSquare);
  snake.tail = snakeSquare;
}

function handleKeyDown(event) {
  activeKey = event.which;

  if (
    activeKey === KEY.LEFT ||
    activeKey === KEY.RIGHT ||
    activeKey === KEY.UP ||
    activeKey === KEY.DOWN
  ) {
    started = true;
  }
}

function repositionSquare(square) {
  var squareElement = square.element;
  var row = square.row;
  var column = square.column;
  var buffer = 20;

  squareElement.css("left", column * SQUARE_SIZE + buffer);
  squareElement.css("top", row * SQUARE_SIZE + buffer);
}

function getRandomAvailablePosition() {
  var randomPosition = {};
  var spaceIsAvailable = false;

  while (!spaceIsAvailable) {
    randomPosition.column = Math.floor(Math.random() * COLUMNS);
    randomPosition.row = Math.floor(Math.random() * ROWS);
    spaceIsAvailable = true;

    for (var i = 0; i < snake.body.length; i++) {
      var piece = snake.body[i];
      if (
        randomPosition.column === piece.column &&
        randomPosition.row === piece.row
      ) {
        spaceIsAvailable = false;
        break;
      }
    }
  }

  return randomPosition;
}

function calculateHighScore() {
  var highScore = Number(sessionStorage.getItem("highScore")) || 0;

  if (score > highScore) {
    sessionStorage.setItem("highScore", score);
    highScore = score;
    alert("New High Score!");
  }

  return highScore;
}
