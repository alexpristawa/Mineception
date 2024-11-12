class ChessSweeper extends Game {

    static mode = 'chessSweeper';

    constructor(board) {
        super(board);
    }

    assignPieces() {
        this.board.tileMap.forEach(row => {
            row.forEach(tile => {
                let num = Math.random();
                if(num < 0.025) {
                    tile.tile.chessPiece = 'queen';
                } else if(num < 0.075) {
                    tile.tile.chessPiece = 'rook';
                } else if(num < 0.125) {
                    tile.tile.chessPiece = 'bishop';
                } else if(num < 0.2) {
                    tile.tile.chessPiece = 'knight';
                } else if(num < 0.4) {
                    tile.tile.chessPiece = 'pawn';
                } else {
                    tile.tile.chessPiece = 'king';
                }
                tile.tile.div.innerHTML = `<p></p><i class = "fas fa-chess-${tile.tile.chessPiece}"></i>`;
            });
        });

        this.board.tileMap.forEach(row => {
            row.forEach(tile => {
                if(!tile.mine) {
                    let count = 0;

                    let arr = this.accessAllTiles(tile.tile);
                    arr.forEach(t => {
                        if(t.mine) {
                            count++;
                        }
                    });

                    tile.tile.value = count;
                }
            });
        });
    }

    firstReveal(y, x) {
        for(let i = Math.max(0, y-1); i <= Math.min(this.board.outerDimensions.y-1, y+1); i++) {
            for(let j = Math.max(0, x-1); j <= Math.min(this.board.outerDimensions.x-1, x+1); j++) {
                if(y != i || x != j) {
                    this.board.tileMap[i][j].tile.reveal(false, false);
                }
            }
        }
    }

    assignTileProperties(tile) {
        tile.div.innerHTML = `<p></p><i class = "fas fa-chess-${tile.chessPiece}"></i>`;
    }

    accessAllTiles(tile) {
        let arr = [];
        console.log(tile);
        if(tile.chessPiece == 'king') {
            for(let y = Math.max(0, tile.y-1); y <= Math.min(this.board.outerDimensions.y-1, tile.y+1); y++) {
                for(let x = Math.max(0, tile.x-1); x <= Math.min(this.board.outerDimensions.x-1, tile.x+1); x++) {
                    if(y != tile.y || x != tile.x) {
                        arr.push(this.board.tileMap[y][x]);
                    }
                }
            }
        }
        if(tile.chessPiece == 'pawn') {
            if(tile.y > 0) {
                if(tile.x > 0) arr.push(this.board.tileMap[tile.y-1][tile.x-1]);
                if(tile.x < this.board.outerDimensions.x-1) arr.push(this.board.tileMap[tile.y-1][tile.x+1]);
            }
        }
        if(['rook', 'queen'].includes(tile.chessPiece)) {
            for(let y = 0; y < this.board.outerDimensions.y; y++) {
                if(y != tile.y) {
                    arr.push(this.board.tileMap[y][tile.x]);
                }
            }
            for(let x = 0; x < this.board.outerDimensions.x; x++) {
                if(x != tile.x) {
                    arr.push(this.board.tileMap[tile.y][x]);
                }
            }
        }
        if(tile.chessPiece == 'knight') {
            const knightMoves = [
                [-2, -1], [-2, 1], [2, -1], [2, 1],
                [-1, -2], [-1, 2], [1, -2], [1, 2]
            ];
            knightMoves.forEach(([dy, dx]) => {
                const y = tile.y + dy;
                const x = tile.x + dx;
                if(y >= 0 && y < this.board.outerDimensions.y && x >= 0 && x < this.board.outerDimensions.x) {
                    arr.push(this.board.tileMap[y][x]);
                }
            });
            
        }
        if(['bishop', 'queen'].includes(tile.chessPiece)) {
            for(let i = -1; i <= 1; i += 2) {  // Diagonal directions: up-left, up-right, down-left, down-right
                for(let j = -1; j <= 1; j += 2) {
                    let k = 1;
                    while (true) {
                        let y = tile.y + i * k;
                        let x = tile.x + j * k;
        
                        // Stop if the position goes out of bounds
                        if (y < 0 || y >= this.board.outerDimensions.y || x < 0 || x >= this.board.outerDimensions.x) {
                            break;
                        }
        
                        arr.push(this.board.tileMap[y][x]);
                        
                        k++;
                    }
                }
            }
        }
        return arr;               
    }
}