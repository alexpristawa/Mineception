class ChessSweeper extends Game {

    static mode = 'chessSweeper';
    static stats = ['time', 'dimensions', 'mines'];

    constructor(board) {
        super(board);
        this.selected = null;
    }

    leftClickFunction(event) {
        super.leftClickFunction(event);
        let div = event.target;
        while(!div.classList.contains('tile') && div != this.board.box) {
            if(!this.board.mineception) {
                div = event.target.parentNode;
            }
        }
        if(!div.classList.contains('tile')) return;
        this.clearSelected();
        let x = parseInt(div.dataset.x);
        let y = parseInt(div.dataset.y);
        if(this.board.tileMap[y][x] == this.selected) {
            this.selected = null;
            return;
        }
        if(this.board.tileMap[y][x].tile.wasRevealed && !(event.metaKey || event.ctrlKey)) {
            this.selected = this.board.tileMap[y][x];
            if(this.selected.tile.chessPiece == 'pawn' && this.selected.tile.y == 0) {
                this.displayPromotionOptions();
            }
            let arr = this.accessAllTiles(this.selected.tile);
            arr.forEach(tile => {
                if(!tile.tile.wasRevealed) {
                    tile.tile.div.style.backgroundColor = 'rgb(53, 73, 77)';
                }
            });
        }
    }

    clearSelected() {
        document.querySelectorAll('.promotionOptionsDiv').forEach(div => {
            div.fadeOut(200, true);
        });
        if(this.selected) {
            this.accessAllTiles(this.selected.tile).forEach(tile => {
                if(tile.tile.wasRevealed) {
                    tile.tile.div.style.backgroundColor = 'var(--evenDarkerBackgroundColor)';
                } else {
                    tile.tile.div.style.backgroundColor = 'var(--darkerBackgroundColor)';
                }
            });
        }
    }

    assignPieces() {
        this.board.tileMap.forEach(row => {
            row.forEach(tile => {
                if(!tile.mine) {
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
                    this.assignTileProperties(tile.tile);
                }
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
        tile.div.innerHTML = `<p></p><i class = "pieceIcon fas fa-chess-${tile.chessPiece}"></i>`;
        if(tile.chessPiece == 'pawn' && tile.y == 0) {
            tile.div.innerHTML += '<i class = "crown fas fa-crown"></i>';
        }
    }

    accessAllTiles(tile) {
        let arr = [];
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

    displayPromotionOptions() {
        let div = document.createElement('div');
        div.classList.add('promotionOptionsDiv');
        let tileSize = this.selected.tile.div.offsetWidth;
        div.style.left = `${this.selected.tile.div.offsetLeft + tileSize/2 - window.innerHeight * 0.03}px`;
        div.style.top = `${this.selected.tile.div.getY() + tileSize}px`;
        body.appendChild(div);

        ['king', 'rook', 'knight', 'bishop', 'queen'].forEach(piece => {
            let pieceDiv = document.createElement('div');
            pieceDiv.classList.add('promotionOption');
            pieceDiv.innerHTML = `<i class = "pieceIcon fas fa-chess-${piece}"></i>`;
            pieceDiv.addEventListener('click', () => {
                this.selected.tile.chessPiece = piece;
                this.assignTileProperties(this.selected.tile);
                let count = 0;
                this.accessAllTiles(this.selected.tile).forEach(tile => {
                    if(tile.mine) {
                        count++;
                    }
                });
                this.selected.tile.value = count;
                let Div = this.selected.tile.div;
                Div.querySelector('p').innerHTML = count;
                Div.querySelector('i').style.opacity = '1';
                Div.style.color = this.getColor(count);
                
                div.remove();
                this.clearSelected();
            });

            div.appendChild(pieceDiv);
        });
    }

    getColor(value) {
        let color;
        if(value == 0) {
            color = 'rgb(200, 200, 200)';
        } else if(value < 9) {
            color = colorArr[value-1];
        } else {
            let b1 = Math.sin(value*101)*50+80;
            let b2 = Math.sin(value*249)*50+90
            let b3 = Math.sin(value*439)*50+65;
    
            color = `rgb(${b1}, ${b2}, ${b3})`;
        }
        return color.substring(0, color.length-1) + ', 0.7)';
    }
}