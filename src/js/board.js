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
    'k': {id: 'k', type: 'king', value: 100},
    'q': {id: 'q', type: 'queen', value: 9},
    'r': {id: 'r', type: 'rook', value: 5},
    'n': {id: 'n', type: 'knight', value: 3},
    'b': {id: 'b', type: 'bishop', value: 3},
    'p': {id: 'p', type: 'pawn', value: 1},
    
    'K': {id: 'K', type: 'king', value: 100},
    'Q': {id: 'Q', type: 'queen', value: 9},
    'R': {id: 'R', type: 'rook', value: 5},
    'N': {id: 'N', type: 'knight', value: 3},
    'B': {id: 'B', type: 'bishop', value: 3},
    'P': {id: 'P', type: 'pawn', value: 1},
}

class Chessboard {

    constructor() {
        this.fen = `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1`;
        this.pieces = this.parseFEN(this.fen);
        this.selected = null;
    }

    setup() {
        const board = document.getElementById('chessboard');

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.classList.add('square');
                square.classList.add((row + col) % 2 === 0 ? 'light' : 'dark');
                square.setAttribute('data-index', row * 8 + col);

                square.addEventListener('dragenter', (e) => {
                    e.preventDefault();
                    e.target.classList.add('highlight');             
                });

                square.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    e.target.classList.add('highlight');             
                });

                square.addEventListener('dragleave', (e) => {
                    e.preventDefault();
                    e.target.classList.remove('highlight');            
                });

                square.addEventListener('drop', (e) => {
                    e.preventDefault();
                    console.log('drop', e.target)
                    this.playSFX(AUDIO.MoveSelf);
                    e.target.appendChild(this.selected);
                    e.target.classList.remove('highlight');
                });

                board.appendChild(square);
            }
        }

        this.load();
    }

    load() {
        this.pieces.forEach((row, rIndex) => {
            row.forEach((piece, cIndex) => {
                if (piece === '') return;

                const index = rIndex * 8 + cIndex;
                const square = document.querySelector(`[data-index='${index}']`);
                const element = document.createElement('img');

                element.classList.add('piece');
                element.src = `assets/svgs/${piece.toLowerCase() === piece ? 'black' : 'white'}-${PIECE[piece].type}.svg`;
                element.alt = PIECE[piece].type;

                element.addEventListener('click', (e) => {
                    const selections = document.querySelectorAll('.selected');
                    selections.forEach(s => s.classList.remove('selected'));

                    if (this.selected === e.target) {
                        this.selected = null;
                        e.target.parentNode.classList.remove('selected');
                    } else {
                        if (this.selected) this.selected.parentNode.classList.remove('selected');
                        this.selected = e.target;
                        e.target.parentNode.classList.add('selected');
                    }
                });

                element.addEventListener('dragstart', (e) => {
                    const selections = document.querySelectorAll('.selected');
                    selections.forEach(s => s.classList.remove('selected'));

                    this.selected = e.target;
                    e.target.parentNode.classList.add('selected');
                    setTimeout(() => {
                        e.target.classList.add('hidden');
                    }, 0);     
                });

                element.addEventListener('dragend', (e) => {
                    const selections = document.querySelectorAll('.selected');
                    selections.forEach(s => s.classList.remove('selected'));

                    this.selected = null;
                    e.target.parentNode.classList.remove('selected');
                    e.target.classList.remove('hidden');
                });

                square.appendChild(element);
            });
        });
    }

    playSFX(src) {
        const audio = document.getElementById('audioSFX');
        audio.src = src;
        audio.play();
    }

    parseFEN(fen) {
        const [placement] = fen.split(' ');
        const rows = placement.split('/');
        return rows.map(row => {
            const expanded = [];
            for (const char of row) {
                if (isNaN(char)) expanded.push(char);
                else {
                    for (let i = 0; i < parseInt(char); i++) {
                        expanded.push('');
                    }
                }
            }
            return expanded;
        });
    }
}

let board = new Chessboard();
board.setup();