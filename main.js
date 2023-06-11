const board = [null, null, null, null, null, null, null, null, null];
const player1 = document.querySelector('#p1');
const player2 = document.querySelector('#p2');
const player1Score = document.querySelector('#p1_score');
const player2Score = document.querySelector('#p2_score');
const player2Title = document.querySelector('#p2_title');
const moodElem = document.querySelector('#playMood');
const onePlayerMood = document.querySelector('#oneP');
const twoPlayersMood = document.querySelector('#twoP');

let playerTurn = 'X';
let p1_score = 0;
let p2_score = 0;
let isOnePlayerMood = false;

// Game Sounds
const note_high = document.querySelector('#note_high');
const note_low = document.querySelector('#note_low');
const game_over = document.querySelector('#game_over');
const game_over_tie = document.querySelector('#game_over_tie');

const toggleClassName = (elem, action, className) => {
  if (action === 'add') elem.classList.add(className);
  else if (action === 'remove') elem.classList.remove(className);
};

toggleClassName(onePlayerMood, 'add', 'hidden');

moodElem.addEventListener('click', () => {
  isOnePlayerMood = !isOnePlayerMood;
  if (isOnePlayerMood === true) {
    toggleClassName(onePlayerMood, 'remove', 'hidden');
    toggleClassName(twoPlayersMood, 'add', 'hidden');
    player2Title.textContent = 'Computer (O)';
  } else {
    toggleClassName(twoPlayersMood, 'remove', 'hidden');
    toggleClassName(onePlayerMood, 'add', 'hidden');
    player2Title.textContent = 'Player 2 (O)';
  }
  p1_score = 0;
  p2_score = 0;
  console.log('is One player mood : ', isOnePlayerMood);
});

player1Score.textContent = p1_score;
player2Score.textContent = p2_score;

toggleClassName(player1, 'add', 'active');
const switchPlayer = () => {
  if (playerTurn === 'X' && !gameWinner(board)) {
    note_high.play();
    playerTurn = 'O';
    toggleClassName(player1, 'remove', 'active');
    toggleClassName(player2, 'add', 'active');
  } else if (playerTurn === 'O' && !gameWinner(board)) {
    note_low.play();
    playerTurn = 'X';
    toggleClassName(player2, 'remove', 'active');
    toggleClassName(player1, 'add', 'active');
  }
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

  if (square.innerHTML == '' && !gameWinner(board)) {
    makeMove(index, square);

    if (isOnePlayerMood) {
      let computerIndex;

      do {
        computerIndex = Math.floor(Math.random() * board.length);
      } while (board[computerIndex] !== null && !gameWinner(board));
      if (!gameWinner(board)) {
        const computerSquare = document.getElementById(
          `square_${computerIndex}`
        );
        setTimeout(() => {
          makeMove(computerIndex, computerSquare);
        }, 300);
      }
    }
  }
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

const restartGame = (board) => {
  setTimeout(() => {
    for (let i = 0; i < board.length; i++) {
      const square = document.getElementById(`square_${i}`);
      square.innerHTML = '';
      square.classList.remove('winner');
      board[i] = null;
    }
  }, 2000);
};

const gameWinner = (board) => {
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

  for (const combination of winningCombinations) {
    const [a, b, c] = combination;

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      combination.forEach((square) => {
        document.getElementById(`square_${square}`).classList.add('winner');
      });
      p1_score += 1 ? board[a] === 'X' : p1_score;
      p2_score += 1 ? board[a] === 'O' : p2_score;
      player1Score.textContent = p1_score;
      player2Score.textContent = p2_score;

      restartGame(board);
      game_over.play();
      return board[a];
    } else if (
      !board.includes(null) &&
      board[a] !== board[b] &&
      board[a] !== board[c]
    ) {
      game_over_tie.play();
      restartGame(board);
      return board[a];
    }
  }
  return null;
};
