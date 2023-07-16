var board = null
var game = new Chess()
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')
var squareToHighlight = null
var squareClass = 'square-55d63'
var $board = $('#myBoard');
var whiteSquareGrey = '#a9a9a9'
var blackSquareGrey = '#696969'
const sideWhiteElement = document.querySelector('.user-username-white');
const sideBlackElement = document.querySelector('.user-username-dark');
const timeBlackElement = document.querySelector('.time-black');
const timeWhiteElement = document.querySelector('.time-white');
const timerClockWhite = document.querySelector('.clock-white .clock-timer');
const timerClockBlack = document.querySelector('.clock-black .clock-timer');

var rotatedegWhite = 0;
var rotatedegBlack = 0;


const playGame = [
    {
        side: 'w',
        name: "Toàn",
        time: 10
    },
    {
        side: 'b',
        name: "Lan",
        time: 10
    },
]

var timeWhite = playGame[0].time;
var timeBlack = playGame[1].time;

function removeGreySquares() {
    $('#myBoard .square-55d63').css('background', '')
}

function greySquare(square) {
    var $square = $('#myBoard .square-' + square)

    var background = whiteSquareGrey
    if ($square.hasClass('black-3c85d')) {
        background = blackSquareGrey
    }

    $square.css('background', background)
}

function removeHighlights(color) {
    $board.find('.' + squareClass)
        .removeClass('highlight-' + color)
}

function onDragStart(source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (game.game_over()) return false

    // only pick up pieces for the side to move
    // if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
    //     (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    //     return false
    // }

}

function onDrop(source, target) {
    removeGreySquares()
    // see if the move is legal
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    })

    // illegal move
    if (move === null) return 'snapback'

    if (move.color === 'w') {
        removeHighlights('white')
        removeHighlights('black')
        $board.find('.square-' + source).addClass('highlight-white')
        $board.find('.square-' + target).addClass('highlight-white')
    }
    if (move.color === 'b') {
        removeHighlights('white')
        removeHighlights('black')
        $board.find('.square-' + source).addClass('highlight-black')
        $board.find('.square-' + target).addClass('highlight-black')
    }

    if (move.color === 'b') {
        renderTime(timeWhiteElement, timeWhite, 'w')
    }

    if (move.color === 'w') {
        renderTime(timeBlackElement, timeBlack, 'b')
    }


    updateStatus(playGame)
}

function onMouseoverSquare(square, piece) {
    // get list of possible moves for this square
    var moves = game.moves({
        square: square,
        verbose: true
    })

    // exit if there are no moves available for this square
    if (moves.length === 0) return

    // highlight the square they moused over
    greySquare(square)

    // highlight the possible squares for this piece
    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to)
    }
}

function onMouseoutSquare(square, piece) {
    removeGreySquares()
}
// function onMoveEnd() {
//     console.log('onMoveEnd');
//     $board.find('.square-' + squareToHighlight)
//         .addClass('highlight-black')
// }

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd() {
    board.position(game.fen())
}



var timeWhiteStop = 1;
var timeBlackStop = 1;

function renderTime(element, time, side) {

    if (side === 'w') {
        clearInterval(timeBlackStop)
        timeWhiteStop = setInterval(() => {
            if (timeWhite < 0) {
                clearInterval(timeWhiteStop)
                $status.html('Ván cờ kết thúc, ' + 'Trắng' + ' hết thời gian')
                return
            }

            let minute;
            let second;
            if (timeWhite >= 60) {
                minute = Math.floor(timeWhite / 60);
                second = timeWhite % 60;
                if (second === 0) {
                    second = '00';
                }
            } else {
                minute = 0;
                second = timeWhite
            }

            timerClockWhite.style.fill = '#fff';
            timerClockBlack.style.fill = '#000';
            timerClockWhite.style.transform = `rotate(${rotatedegWhite += 90}deg)`;
            timeWhiteElement.innerText = `${minute}: ${second}`;
            timeWhite--;
        }, 1000)
    }
    if (side === 'b') {
        clearInterval(timeWhiteStop)
        timeBlackStop = setInterval(() => {
            if (timeBlack < 0) {
                $status.html('Ván cờ kết thúc, ' + 'Đen' + ' hết thời gian')
                return
            }
            let minute;
            let second;
            if (timeBlack >= 60) {
                minute = Math.floor(timeBlack / 60);
                second = timeBlack % 60;
                if (second === 0) {
                    second = '00';
                }
            } else {
                minute = 0;
                if (second < 10) {
                    second = '0' + timeBlack
                } else {
                    second = timeBlack
                }

            }

            timerClockBlack.style.fill = '#fff';
            timerClockWhite.style.fill = '#000';
            timerClockBlack.style.transform = `rotate(${rotatedegBlack += 90}deg)`;
            timeBlackElement.innerText = `${minute}: ${second}`;
            timeBlack--;
        }, 1000)
    }
}



function updateStatus(infoPlayGame) {
    var status = ''
    var moveColor = 'Trắng'

    if (game.turn() === 'b') {
        moveColor = 'Đen'
    }

    // checkmate?
    if (game.in_checkmate()) {
        status = 'Ván cờ kết thúc, ' + moveColor + ' bị chiếu hết.'
    }

    // draw?
    else if (game.in_draw()) {
        status = 'Ván cờ kết thúc, hòa cờ'
    }

    // game still on
    else {
        status = moveColor + ' Đi'

        // check?
        if (game.in_check()) {
            status += ', ' + moveColor + ' Bị chiếu'
        }
    }

    $status.html(status)
    $fen.html(game.fen())
    $pgn.html(game.pgn())
}

var config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd
}
board = Chessboard('myBoard', config)

function updateTimeAndUser(infoBeginStart) {
    timeWhiteElement.innerText = infoBeginStart[0].time;
    timeBlackElement.innerText = infoBeginStart[1].time;
    sideWhiteElement.innerText = infoBeginStart[0].name;
    sideBlackElement.innerText = infoBeginStart[1].name;
}

updateTimeAndUser (playGame);
updateStatus(playGame)