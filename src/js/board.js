let selected = null;
let chessboard = [];

const AUDIO = {
    GameStart: 'assets/audio/game-start.mp3',
    GameEnd: 'assets/audio/game-end.mp3',
    MoveSelf: 'assets/audio/move-self.mp3',
    MoveOp: 'assets/audio/move-op.mp3',
    Castle: 'assets/audio/castle.mp3',
    Capture: 'assets/audio/capture.mp3',
    Check: 'assets/audio/check.mp3',
    Promote: 'assets/audio/promote.mp3',
    Illegal: 'assets/audio/illegal.mp3',
}

const PIECE = {
    'r': 'black-rook', 'n': 'black-knight', 'b': 'black-bishop', 'q': 'black-queen', 'k': 'black-king', 'p': 'black-pawn',
    'R': 'white-rook', 'N': 'white-knight', 'B': 'white-bishop', 'Q': 'white-queen', 'K': 'white-king', 'P': 'white-pawn'
};

document.addEventListener('DOMContentLoaded', () => {
    generate();
});

function generate() {
    const board = document.getElementById('chessboard');
    const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    chessboard = load(fen);

    console.log(chessboard)

    for (let i = 0; i < 64; i++) {
        const piece = chessboard[i] !== '' ? chessboard[i] : null;
        const square = createSquare(i, piece);
        board.appendChild(square);
    }
}

function load(fen) {
    const pieces = [];
    const fenRows = fen.split(' ')[0].split('/');
    fenRows.forEach(row => {
        for (const char of row) {
            if (isNaN(char)) {
                pieces.push(PIECE[char]);
            } else {
                for (let i = 0; i < parseInt(char); i++) {
                    pieces.push('');
                }
            }
        }
    });        
    return pieces;
}

function update(fen) {
    const pieces = load(fen);

    for (let i = 0; i < 64; i++) {
        chessboard[i] = pieces[i];
        const square = document.querySelector(`[data-index="${i}"]`);
        square.innerHTML = '';

        if (pieces[i] !== '') {
            const pieceElement = createPiece(pieces[i]);
            square.appendChild(pieceElement);
        }
    }
}

function onClick(e) {
    console.log(e.target)

    const selections = document.querySelectorAll('.selected');
    selections.forEach((e) => e.classList.remove('selected'));

    

    if (chessboard[e.target.getAttribute('data-index')]) {
        if (selected == e.target) selected = null;
        else {
            selected = e.target;
            e.target.classList.add('selected');
        }        
    }
}

function onDragStart(e) {
    e.target.classList.add('grabbable');
    e.dataTransfer.setData('text/plain', e.target.parentElement.getAttribute('data-index'));
}

function onDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('highlight');
}

function onDragLeave(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('highlight');
}

function onDragEnd(e) {
    e.preventDefault();
    e.target.classList.remove('grabbable');
}

function onDrop(e) {
    e.preventDefault();

    const startIndex = e.dataTransfer.getData('text/plain');
    const endIndex = e.target.getAttribute('data-index') || e.target.parentElement.getAttribute('data-index');

    e.currentTarget.classList.remove('highlight');

    if (startIndex !== endIndex) {
        movePiece(startIndex, endIndex);
        playSFX(AUDIO.MoveSelf);
    }
}

function movePiece(startIndex, endIndex) {
    const startSquare = document.querySelector(`[data-index='${startIndex}']`);
    const endSquare = document.querySelector(`[data-index='${endIndex}']`);
    const piece = startSquare.querySelector('img');

    if (endSquare && piece) {
        endSquare.innerHTML = '';
        endSquare.appendChild(piece);
        chessboard[endIndex] = chessboard[startIndex];
        chessboard[startIndex] = '';
        startSquare.innerHTML = '';
    }
}

function createSquare(index, piece) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.classList.add((Math.floor(index / 8) + index) % 2 === 0 ? 'light' : 'dark');
    square.setAttribute('data-index', index);

    if (piece) {
        const pieceElement = createPiece(piece);
        square.classList.add('grabbable');
        square.appendChild(pieceElement);
    }

    square.classList.add('legal');

    square.addEventListener('click', onClick);
    square.addEventListener('dragstart', onDragStart);
    square.addEventListener('dragover', onDragOver);
    square.addEventListener('dragend', onDragEnd);
    square.addEventListener('dragleave', onDragLeave);
    square.addEventListener('drop', onDrop);

    return square;
}

function createPiece(piece) {
    const pieceElement = document.createElement('img');
    pieceElement.src = `/assets/svgs/${piece}.svg`;
    pieceElement.width = 80;
    pieceElement.style.pointerEvents = 'none';
    pieceElement.classList.add('piece');
    // pieceElement.setAttribute('draggable', true);

    return pieceElement;
}

function playSFX(src) {
    const audio = document.getElementById('audioSFX');
    audio.src = src;
    audio.play();
}
