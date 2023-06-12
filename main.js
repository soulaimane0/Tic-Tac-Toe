const board = Array(9).fill(null);
const player1Element = document.querySelector('#p1');
const player2Element = document.querySelector('#p2');
const player1ScoreElement = document.querySelector('#p1_score');
const player2ScoreElement = document.querySelector('#p2_score');
const player2TitleElement = document.querySelector('#p2_title');
const moodElement = document.querySelector('#playMood');
const onePlayerMoodElement = document.querySelector('#oneP');
const twoPlayersMoodElement = document.querySelector('#twoP');

let playerTurn = 'X';
let player1Score = 0;
let player2Score = 0;
let isOnePlayerMood = false;

// Game Sounds
const note_high = document.querySelector('#note_high');
const note_low = document.querySelector('#note_low');
const game_over = document.querySelector('#game_over');
const game_over_tie = document.querySelector('#game_over_tie');

const toggleClassName = (elem, className, add) => {
  elem.classList.toggle(className, add);
};

const restartGame = (duration) => {
  setTimeout(() => {
    for (let i = 0; i < board.length; i++) {
      const square = document.getElementById(`square_${i}`);
      square.innerHTML = '';
      square.classList.remove('winner');
      board[i] = null;
    }
    playerTurn = 'X';
  }, duration);
};

toggleClassName(onePlayerMoodElement, 'hidden', true);
const changeGameMood = () => {
  player1Score = 0;
  player2Score = 0;
  isOnePlayerMood = !isOnePlayerMood;
  restartGame(50);
  if (isOnePlayerMood) {
    toggleClassName(onePlayerMoodElement, 'hidden', false);
    toggleClassName(twoPlayersMoodElement, 'hidden', true);
    player2TitleElement.textContent = 'Computer (O)';
  } else {
    toggleClassName(twoPlayersMoodElement, 'hidden', false);
    toggleClassName(onePlayerMoodElement, 'hidden', true);
    player2TitleElement.textContent = 'Player 2 (O)';
  }

  player1ScoreElement.textContent = player1Score.toString();
  player2ScoreElement.textContent = player2Score.toString();
};

moodElement.addEventListener('click', () => changeGameMood());

toggleClassName(player1Element, 'active', true);
const switchPlayer = () => {
  if (playerTurn === 'X' && !gameWinner()) {
    note_high.play();
    playerTurn = 'O';
    toggleClassName(player1Element, 'active', false);
    toggleClassName(player2Element, 'active', true);
  } else if (playerTurn === 'O' && !gameWinner()) {
    note_low.play();
    playerTurn = 'X';
    toggleClassName(player2Element, 'active', false);
    toggleClassName(player1Element, 'active', true);
  }
};

const checkWinner = () => {
  const winner = gameWinner();
  if (winner === 'X') {
    player1Score++;
  } else if (winner === 'O') {
    player2Score++;
  }
  player1ScoreElement.textContent = player1Score.toString();
  player2ScoreElement.textContent = player2Score.toString();
};

const makeMove = (index, square) => {
  board[index] = playerTurn;
  const spanElm = document.createElement('span');
  spanElm.textContent = playerTurn;
  square.appendChild(spanElm);

  switchPlayer();
};

function squareClick(index) {
  const square = document.getElementById(`square_${index}`);

  if (square.innerHTML === '' && !gameWinner()) {
    makeMove(index, square);

    if (isOnePlayerMood) {
      let computerIndex;

      do {
        computerIndex = Math.floor(Math.random() * board.length);
      } while (board[computerIndex] !== null && !gameWinner());
      if (!gameWinner()) {
        const computerSquare = document.getElementById(
          `square_${computerIndex}`
        );
        setTimeout(() => {
          makeMove(computerIndex, computerSquare);
          checkWinner();
        }, 300);
      }
    }
  }
  if (gameWinner() && gameWinner() !== 'draw') checkWinner();
}

const createBoardSquares = () => {
  const gameBoard = document.querySelector('#board');

  for (let i = 0; i < board.length; i++) {
    const square = document.createElement('div');
    square.className = 'square';
    square.id = 'square_' + i;
    gameBoard.appendChild(square);

    square.addEventListener('click', () => squareClick(i));
  }
};

createBoardSquares();

function gameWinner() {
  const winningCombinations = [
    //Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    //columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    //diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];

  let winner = null;
  let draw = null;
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      combination.forEach((square) => {
        document.getElementById(`square_${square}`).classList.add('winner');
      });
      winner = board[a];
      draw = null;
      break;
    } else if (
      !board.includes(null) &&
      board[a] !== board[b] &&
      board[a] !== board[c]
    ) {
      draw = 'draw';
      winner = null;
    }
  }
  if (winner) {
    game_over.play();
    restartGame(2000);
    return winner;
  } else if (draw) {
    game_over_tie.play();
    restartGame(2000);
    return draw;
  }
  return null;
}
