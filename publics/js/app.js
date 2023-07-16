const chess = new Chess();
var board = null;
var $board = $('#board');
let puzzleFen = '';
let puzzleActive = false;
let puzzleSolution = null;
let puzzleAnswer = '';
let movesHistory = [];
var squareToHighlight = null;
var squareClass = 'square-55d63';
let score = 10;
const startPuzzle = document.getElementById('start-puzzle');
const listPuzzleEl = document.getElementById('list-puzzle');

let OriginHistory = null; // Tự định nghĩa
let totalMove; // Tự định nghĩa
let checkIsUndoMove = true;
let isfinish = false;
let toTalLoiGiai = 3;

function handleInputChange() {
  try {
    const pgn = document.getElementById('pgn-input').value;
    toTalLoiGiai = +pgn.split('{')[1].split('}')[0];
    if (toTalLoiGiai % 2 === 0) {
      toTalLoiGiai++;
    }
    loadPuzzleFromPGN(pgn);
  } catch (error) {
    alert('loi nhap');
  }
}

function isPuzzleSolution(move) {
  if (!puzzleSolution || !OriginHistory.length) {
    return false;
  }
  const solutionMove = OriginHistory[OriginHistory.length - 1];
  return move === solutionMove;
}

function loadPuzzleFromPGN(pgn) {
  score = 10;
  chess.reset();
  const game = chess.load_pgn(pgn, { sloppy: true });
  if (game) {
    socket.emit('LOAD_PGN', pgn);
    totalMove = chess.history().length;
    puzzleSolution = chess.history();
    OriginHistory = chess.history();
    for (let i = 0; i < toTalLoiGiai; i++) {
      chess.undo();
    }
    puzzleFen = chess.fen();
    console.log('puzzleFen', puzzleFen);
    puzzleAnswer = pgn.trim() + '\n\n';
    movesHistory = [];

    board.position(puzzleFen, false); // Tắt chế độ chỉ xem
    puzzleActive = true;
    removeHighlights('black');
    removeHighlights('white');
  } else {
    alert('Lỗi khi tải bài toán từ PGN. Định dạng không hợp lệ.');
  }
}

function undoMove() {
  removeHighlights('black');
  removeHighlights('white');
  if (!puzzleActive || chess.game_over() || puzzleSolution.length <= 1) {
    return;
  }

  const lastMove = movesHistory.pop();
  chess.undo();
  puzzleSolution.push(lastMove);
  puzzleAnswer = puzzleAnswer.trim().split(' ').slice(0, -1).join(' ');
  board.position(chess.fen(), false); // Tắt chế độ chỉ xem
}

function redoMove() {
  removeHighlights('black');
  removeHighlights('white');
  if (
    !puzzleActive ||
    chess.game_over() ||
    chess.history().length >= totalMove
  ) {
    return;
  }

  const nextMove = OriginHistory[chess.history().length];
  chess.move(nextMove);

  movesHistory.push(nextMove);

  board.position(chess.fen(), false); // Tắt chế độ chỉ xem
  puzzleAnswer += nextMove + ' ';
  if (isPuzzleSolution(nextMove)) {
    alert('Chính xác! Bạn đã giải bài toán thành công.');
    puzzleActive = false;
  }
}

function checkAnswer() {
  if (!puzzleActive || chess.game_over()) {
    return;
  }

  const currentMove = puzzleSolution[puzzleSolution.length - 1];
  const userMove = chess.history({ verbose: true }).pop();

  if (currentMove === userMove.san) {
    alert('Chính xác! Bạn đã giải đúng.');
  } else {
    alert('Sai rồi. Hãy thử lại.');
  }
}

function onDragStart(source, piece, position, orientation) {
  if (!puzzleActive || chess.game_over()) {
    return false;
  }

  if (piece.search(/^b/) !== -1) {
    return false;
  }
}

function onDrop(source, target) {
  if (!puzzleActive) {
    return 'snapback';
  }

  let move = chess.move({
    from: source,
    to: target,
    promotion: 'q',
  });

  if (move && checkPuzzle(move.san)) {
    removeHighlights('white');
    removeHighlights('black');
    $board.find('.square-' + source).addClass('highlight-white');
    $board.find('.square-' + target).addClass('highlight-white');
  } else {
    checkIsUndoMove = true;
    return 'snapback';
  }
}

const scoreEl = document.getElementById('score');
const listEl = document.querySelector('.list-score');
function updateScore(number) {
  let oldScore = parseInt(scoreEl.innerText) || 0;
  if (number <= 0) {
    number = 1;
  }
  const inforScore = {
    userNameLogin,
    number,
  };

  socket.emit('clietn-send-score', inforScore);
}

function checkPuzzle(moveSan) {
  const countChess = chess.history().length - 1;
  const countOriginHistory = OriginHistory.length - 1;
  const isCheck = OriginHistory[countChess];
  if (isCheck === moveSan && countOriginHistory === countChess) {
    updateScore(score);
    return true;
  } else if (isCheck === moveSan) {
    checkIsUndoMove = true;
    return window.setTimeout(nextMove, 250);
  } else {
    score--;
    if (checkIsUndoMove) {
      chess.undo();
      checkIsUndoMove = false;
    }
    return false;
  }
}

function nextMove() {
  const nextMove = OriginHistory[chess.history().length];
  chess.move(nextMove);
  const listMoved = chess.history({ verbose: true });
  const lengMoved = chess.history().length;
  const moved = listMoved[lengMoved - 1];
  console.log(moved);
  movesHistory.push(nextMove);

  removeHighlights('black');
  removeHighlights('white');
  $board.find('.square-' + moved.from).addClass('highlight-black');
  $board.find('.square-' + moved.to).addClass('highlight-black');
  squareToHighlight = moved.to;

  board.position(chess.fen(), false); // Tắt chế độ chỉ xem
  puzzleAnswer += nextMove + ' ';
  return true;
}

function onSnapEnd() {
  board.position(chess.fen(), false); // Tắt chế độ chỉ xem
}

function savePGN() {
  const element = document.createElement('a');
  const file = new Blob([puzzleAnswer], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = 'puzzle_answer.pgn';
  document.body.appendChild(element);
  element.click();
}

document
  .getElementById('pgn-input')
  .addEventListener('input', handleInputChange);

document.getElementById('load-pgn-btn').addEventListener('click', function () {
  const pgn = document.getElementById('pgn-input').value;
  loadPuzzleFromPGN(pgn);
});

document.getElementById('save-pgn-btn').addEventListener('click', function () {
  savePGN();
});

document.getElementById('undo-btn').addEventListener('click', function () {
  undoMove();
});

document.getElementById('redo-btn').addEventListener('click', function () {
  redoMove();
});

document.getElementById('check-btn').addEventListener('click', function () {
  checkAnswer();
});

document.addEventListener('keydown', function (event) {
  if (!puzzleActive || chess.game_over()) {
    return;
  }

  switch (event.key) {
    case 'ArrowLeft':
      undoMove();
      break;
    case 'ArrowRight':
      redoMove();
      break;
  }
});

function removeHighlights(color) {
  $board.find('.' + squareClass).removeClass('highlight-' + color);
}

function onMoveEnd() {
  $board.find('.square-' + squareToHighlight).addClass('highlight-black');
}

const config = {
  position: 'start',
  draggable: true,
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  moveSpeed: 'fast',
  // snapbackSpeed: 300,
  // snapSpeed: 200,
  onMoveEnd: onMoveEnd,
};
board = Chessboard('board', config);

socket.on('SEVER_LOAD_PGN', (data) => {
  loadPuzzleFromPGNServer(data);
});
socket.on('DANH_SACH_USER', (score) => {
  renderScore(score);
});

function renderScore(arrayScoreRender) {
  let html = '';
  if (arrayScoreRender.length >= 2) {
    arrayScoreRender.sort((a, b) => b.number - a.number);
  }
  arrayScoreRender.forEach((e) => {
    html += `<li> ${e.userNameLogin}: <span id="score">${e.number} </span></li>`;
  });
  listEl.innerHTML = html;
}

socket.on('server-send-score', (score) => {
  renderScore(score);
});
socket.on('ALL_PUZZLE', (listPuzzle) => {
  const arrayPuzzle = listPuzzle.map((e, index) => {
    return `<div class='puzzle-button' data-puzzle='${e.puzzle}' > Bài ${
      index + 1
    } </div>`;
  });
  listPuzzleEl.innerHTML = arrayPuzzle;
  const puzzleButton = document.querySelectorAll('.puzzle-button');
  puzzleButton.forEach((e) => {
    e.addEventListener('click', () => {
      const puzzle = e.getAttribute('data-puzzle');
      loadPuzzleFromPGNServer(puzzle)
    });
  });
});

function loadPuzzleFromPGNServer(pgn) {
  score = 10;
  chess.reset();
  const game = chess.load_pgn(pgn, { sloppy: true });
  if (game) {
    totalMove = chess.history().length;
    puzzleSolution = chess.history();
    OriginHistory = chess.history();
    for (let i = 0; i < toTalLoiGiai; i++) {
      chess.undo();
    }
    puzzleFen = chess.fen();
    console.log('puzzleFen', puzzleFen);
    puzzleAnswer = pgn.trim() + '\n\n';
    movesHistory = [];

    board.position(puzzleFen, false); // Tắt chế độ chỉ xem
    puzzleActive = true;
    removeHighlights('black');
    removeHighlights('white');
  } else {
    alert('Lỗi khi tải bài toán từ PGN. Định dạng không hợp lệ.');
  }
}

startPuzzle.addEventListener('click', () => {
  const PGN = `[Event "Chess Puzzle"]
  [Site "Unknown"]
  [Date "2023.07.08"]
  [Round "1"]
  [White "Player1"]
  [Black "Player2"]
  [Result "*"]
  
  1. e4 e5
  2. Nf3 Nc6
  3. Bb5 a6
  4. Ba4 Nf6
  5. O-O Be7
  6. Re1 b5
  7. Bb3 d6
  8. c3 O-O
  9. h3 Nb8
  10. d4 Nbd7
  11. Nbd2 Bb7
  12. Bc2 Re8
  13. Nf1 Bf8
  14. Ng3 g6
  15. a4 c5
  16. d5 c4
  17. Bg5 h6
  18. Be3 Qc7
  19. Qd2 Kh7
  20. Nh2 Nc5
  21. axb5 axb5
  22. Rxa8 Rxa8
  23. f4 Nfd7
  24. Rf1 exf4
  25. Bxf4 Nb6
  26. Ng4 h5
  27. Nf6+ Kh8
  28. Bh6 Qe7
  29. Bxf8 Qxf8
  30. Ngxh5 gxh5
  31. Rf5 * {4}`;
  loadPuzzleFromPGN(PGN);
});
