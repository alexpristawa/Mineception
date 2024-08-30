class Board {

    static board = null;

    constructor(outerDimensions, innerDimensions, y, x) {
        this.outerDimensions = outerDimensions;
        this.innerDimensions = innerDimensions;

        this.isOuter = this.innerDimensions !== null;
        this.mineception = this.innerDimensions !== false;
        this.mine = false;
        this.mineCount = Math.round(outerDimensions.x * outerDimensions.y / outerDimensions.density);
        this.firstClick = true;
        if(this.isOuter) {
            Board.board = this;
        } else {
            this.y = y;
            this.x = x;
        }
        this.wasRevealed = false;

        this.tileMap = new Array(this.outerDimensions.y).fill(false).map(() => 
            new Array(this.outerDimensions.x).fill(false).map(() => ({mine: false}))
        );
        
        this.fillMines();

        if(this.isOuter && this.mineception) {
            for(let y = 0; y < this.tileMap.length; y++) {
                for(let x = 0; x < this.tileMap[y].length; x++) {
                    if(this.tileMap[y][x].mine == false) {
                        this.tileMap[y][x] = new Board(this.innerDimensions, null, y, x);
                    }
                }
            }
            
            this.createBoard();
        } else if(this.isOuter) {
            this.createBoard();
        }
    }

    fillMines() {
        this.mineCount = Math.floor(this.outerDimensions.x * this.outerDimensions.y / this.outerDimensions.density);

        for (let i = 0; i < this.mineCount; i++) {
            let y = Math.floor(Math.random() * this.outerDimensions.y);
            let x = Math.floor(Math.random() * this.outerDimensions.x);

            if (this.tileMap[y][x].mine === false) {
                this.tileMap[y][x].mine = true;
            } else {
                i--;
            }
        }
    }

    createBoard(box = boardElement) {
        this.box = box;

        let ratio = this.outerDimensions.x / this.outerDimensions.y;
        let boxRatio = window.innerWidth / (window.innerHeight*0.9);
        let property = 'width';

        if(box == boardElement) {
            if(ratio > boxRatio) {
                boardElement.style.width = '95%';
                boardElement.style.height = `${window.innerWidth * 0.95 / ratio}px`;
            } else {
                property = 'height';
                boardElement.style.width = `${window.innerHeight * 0.9 * 0.95 * ratio}px`;
                boardElement.style.height = '95%';
            }
        } else {
            box.style.gridTemplateColumns = `repeat(${this.outerDimensions.x}, 1fr)`;
            box.style.gridTemplateRows = `repeat(${this.outerDimensions.y}, 1fr)`;
        }

        if(gamemode == 'mineception') {
            if(this.isOuter) {
                new OuterBoard(this);
            } else {
                new InnerBoard(this);
            }
        } else if(gamemode == 'classicMinesweeper') {
            new Classic(this);
        } else if(gamemode == 'minesOnly') {
            new MinesOnly(this);
        }

        for(let y = 0; y < this.tileMap.length; y++) {
            for(let x = 0; x < this.tileMap[y].length; x++) {
                new Tile(y, x, box, this);
            }
        }
    }

    fixMines(I, J) {
        I = parseInt(I);
        J = parseInt(J);
        let mineCount = 0;
        for(let y = Math.max(0, I-1); y <= Math.min(this.outerDimensions.y-1, I+1); y++) {
            for(let x = Math.max(0, J-1); x <= Math.min(this.outerDimensions.x-1, J+1); x++) {
                if(this.tileMap[y][x].mine === true) {
                    this.tileMap[y][x].tile.div.remove();
                    this.tileMap[y][x] = {mine: false};
                    mineCount++;
                    for(let k = Math.max(0, y-1); k <= Math.min(this.outerDimensions.y-1, y+1); k++) {
                        for(let l = Math.max(0, x-1); l <= Math.min(this.outerDimensions.x-1, x+1); l++) {
                            if(!(y == k && l == x) && this.tileMap[k][l].mine === false) {
                                this.tileMap[k][l].tile.value--;
                            }
                        }
                    }
                    if(this.isOuter && this.mineception) {
                        this.tileMap[y][x] = new Board(this.innerDimensions, null, y, x);
                    }// else {
                        new Tile(y, x, this.box, this);
                    //}
                }
            }
        }

        for(let i = 0; i < mineCount; i++) {
            let y = Math.floor(Math.random() * this.outerDimensions.y);
            let x = Math.floor(Math.random() * this.outerDimensions.x);

            if (this.tileMap[y][x].mine === false && Math.abs(y-I) > 1 && Math.abs(x-J) > 1) {
                this.tileMap[y][x].tile.div.remove();
                this.tileMap[y][x] = {mine: true};
                new Tile(y, x, this.box, this);
                for(let k = Math.max(0, y-1); k <= Math.min(this.outerDimensions.y-1, y+1); k++) {
                    for(let l = Math.max(0, x-1); l <= Math.min(this.outerDimensions.x-1, x+1); l++) {
                        if(!(y == k && l == x) && this.tileMap[k][l].mine === false) {
                            this.tileMap[k][l].tile.value++;
                        }
                    }
                }
            } else {
                i--;
            }
        }

        if(this.isOuter && this.mineception) {
            for(let y = 0; y < this.outerDimensions.y; y++) {
                for(let x = 0; x < this.outerDimensions.x; x++) {
                    this.tileMap[y][x].tile.backDiv.innerHTML = this.tileMap[y][x].tile.value;
                    this.tileMap[y][x].tile.backDiv.style.color = colorArr[this.tileMap[y][x].tile.value-1];
                    if(this.tileMap[y][x].tile.value == 0) {
                        this.tileMap[y][x].tile.backDiv.innerHTML = '';
                    }
                }
            }
        }
    }

    enlarge() {
        if(!this.wasRevealed) {

            this.createBoard(this.tile.frontDiv);
            let div = this.tile.div;
            div.classList.add('innerBoard');
            let width = div.offsetWidth;
            let height = div.offsetHeight;
            this.originalX = div.getX();
            this.originalY = div.getY();
            this.originalWidth = width;
            this.originalHeight = height;
            div.style.position = 'absolute';

            div.parentNode.removeChild(div);
            body.appendChild(div);

            requestAnimationFrame(() => {
                let scale = window.innerHeight * 0.9 * 0.95 / height;

                div.style.width = `${width * scale}px`;
                div.style.height = `${height * scale}px`;
                div.style.left = `${(window.innerWidth - width * scale) / 2}px`;
                div.style.top = `${window.innerHeight*0.125}px`;
            });
        }
    }

    checkForCompletion() {
        for(let y = 0; y < this.tileMap.length; y++) {
            for(let x = 0; x < this.tileMap[y].length; x++) {
                if(this.tileMap[y][x].mine === false && this.tileMap[y][x].tile.wasRevealed === false) {
                    return;
                }
            }
        }

        if(this.isOuter) {
            alert('You won!');
        } else {
            Board.board.tileMap[this.y][this.x].tile.reveal();
        }
    }
}