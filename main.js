const board = [null, null, null, null, null, null, null, null, null];
const player1 = document.querySelector('#p1');
const player2 = document.querySelector('#p2');
const player1Score = document.querySelector('#p1_score');
const player2Score = document.querySelector('#p2_score');

let playerTurn = 'X';
let p1_score = 0;
let p2_score = 0;

const note_high = document.querySelector('#note_high');
const note_low = document.querySelector('#note_low');
const gale_over = document.querySelector('#game_over');

const toggleActiveClass = (elem, action) => {
  if (action === 'add') elem.classList.add('active');
  else if (action === 'remove') elem.classList.remove('active');
};

player1Score.textContent = p1_score;
player2Score.textContent = p2_score;

toggleActiveClass(player1, 'add');
const switchPlayer = () => {
  if (playerTurn === 'X' && !gameWinner(board)) {
    note_high.play();
    playerTurn = 'O';
    toggleActiveClass(player1, 'remove');
    toggleActiveClass(player2, 'add');
  } else if (playerTurn === 'O' && !gameWinner(board)) {
    note_low.play();
    playerTurn = 'X';
    toggleActiveClass(player2, 'remove');
    toggleActiveClass(player1, 'add');
  }
};

const squareClick = (index) => {
  const square = document.getElementById(`square_${index}`);

  if (square.innerHTML == '' && !gameWinner(board)) {
    board[index] = playerTurn;
    const spanElm = document.createElement('span');
    spanElm.textContent = playerTurn;
    square.appendChild(spanElm);

    switchPlayer();
  }
};

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
      gale_over.play();
      return board[a];
    } else if (
      !board.includes(null) &&
      board[a] !== board[b] &&
      board[a] !== board[c]
    ) {
      restartGame(board);
    }
  }
  return null;
};
