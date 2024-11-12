class Tile {
    constructor(y, x, box, parent = Board.board) {
        this.y = y;
        this.x = x;
        this.parent = parent;
        this.wasRevealed = false;
        this.flagged = false;
        let div = document.createElement('div');
        div.classList.add('tile');
        if(box == boardElement) {
            div.classList.add('outerTile');
        } else {
            div.classList.add('innerTile');
        }

        div.dataset.y = y;
        div.dataset.x = x;

        // Set the grid position
        div.style.gridColumn = x + 1; // +1 because CSS grid starts at 1, not 0
        div.style.gridRow = y + 1;

        this.value = 0;
        for(let y = Math.max(0, this.y-1); y <= Math.min(this.parent.outerDimensions.y-1, this.y+1); y++) {
            for(let x = Math.max(0, this.x-1); x <= Math.min(this.parent.outerDimensions.x-1, this.x+1); x++) {
                if(parent.tileMap[y][x].mine === true) {
                    this.value++;
                }
            }
        }

        if(box == boardElement && this.parent.mineception) {
            this.secondDiv = document.createElement('div');
            this.secondDiv.classList.add('secondDiv');
            div.appendChild(this.secondDiv);

            let frontDiv = document.createElement('div');
            frontDiv.classList.add('tileFront');
            div.appendChild(frontDiv);

            let backDiv = document.createElement('div');
            backDiv.classList.add('tileBack');
            backDiv.innerHTML = this.value;
            backDiv.style.color = colorArr[this.value-1];
            div.appendChild(backDiv);

            this.frontDiv = frontDiv;
            this.backDiv = backDiv;
        }

        // Append the div to the boardElement
        box.appendChild(div);

        if(box == boardElement) {
            parent.tileMap[this.y][this.x].tile = this;
        } else {
            if(parent.tileMap[this.y][this.x].mine !== true) {
                parent.tileMap[this.y][this.x] = {tile: this, mine: false};
            } else {
                parent.tileMap[this.y][this.x] = {tile: this, mine: true};
            }
        }

        this.div = div;
    }

    reveal(auto = false, courd = false) {
        if(!this.wasRevealed) {
            this.wasRevealed = true;
            if(!this.parent.isOuter || !this.parent.mineception) {
                if(!this.flagged) {
                    this.div.style.backgroundColor = this.parent.mineception ? 'var(--evenDarkerTitleColor90)': 'var(--evenDarkerBackgroundColor)';
                    if(this.value != 0 || this.parent.game.constructor.mode == 'chessSweeper') {
                        if(this.parent.game.constructor.mode == 'chessSweeper') {
                            this.div.querySelector('p').innerHTML = this.value;
                            let color;
                            if(this.value == 0) {
                                color = 'rgb(200, 200, 200)';
                            } else if(this.value < 9) {
                                color = colorArr[this.value-1];
                            } else {
                                let b1 = Math.sin(this.value*101)*50+80;
                                let b2 = Math.sin(this.value*249)*50+90
                                let b3 = Math.sin(this.value*439)*50+65;
                        
                                color = `rgb(${b1}, ${b2}, ${b3})`;
                            }
                            this.div.querySelector('p').style.color = color.substring(0, color.length-1) + ', 0.7)';
                            this.div.querySelector('i').style.opacity = '1';
                        } else {
                            this.div.innerHTML = this.value;
                            this.div.style.color = colorArr[this.value-1];
                        }
                    } else {
                        for(let y = Math.max(0, this.y-1); y <= Math.min(this.parent.outerDimensions.y-1, this.y+1); y++) {
                            for(let x = Math.max(0, this.x-1); x <= Math.min(this.parent.outerDimensions.x-1, this.x+1); x++) {
                                if(y != this.y || x != this.x) {
                                    this.parent.tileMap[y][x].tile.reveal(true);
                                }
                            }
                        }
                    }
                }
            } else {
                this.backDiv.style.backgroundColor = 'var(--evenDarkerBackgroundColor)';
                if(auto == true) {
                    this.frontDiv.style.display = 'none';
                    this.backDiv.style.opacity = 1;
                    this.backDiv.style.transform = 'rotateY(0deg)';
                    if(this.value == 0) {
                        for(let y = Math.max(0, this.y-1); y <= Math.min(this.parent.outerDimensions.y-1, this.y+1); y++) {
                            for(let x = Math.max(0, this.x-1); x <= Math.min(this.parent.outerDimensions.x-1, this.x+1); x++) {
                                if(y != this.y || x != this.x) {
                                    this.parent.tileMap[y][x].tile.reveal(true);
                                }
                            }
                        }
                    }
                } else {
                    this.parent.game.gameDotGame();
                    let board = Board.board.tileMap[this.y][this.x];
                    this.div.classList.remove('innerBoard');
                    this.div.style.perspective = '1000px';
                    this.div.style.transition = 'left 1000ms ease-out, top 1000ms ease-out, width 1000ms cubic-bezier(.45,-0.3,.82,.4), height 1000ms cubic-bezier(.45,-0.3,.82,.4)';
                    this.div.style.left = `${board.originalX}px`;
                    this.div.style.top = `${board.originalY}px`;
                    this.div.style.width = `${board.originalWidth}px`;
                    this.div.style.height = `${board.originalHeight}px`;
                    this.div.style.backgroundColor = 'transparent';
                    this.secondDiv.style.transformStyle = 'preserve-3d';
                    this.frontDiv.style.transition = 'transform 1000ms linear';
                    this.backDiv.style.transition = 'transform 1000ms linear';
                    this.frontDiv.style.transform = 'rotateY(180deg)';
                    this.backDiv.style.transform = 'rotateY(-360deg)';
                    this.backDiv.style.opacity = 0;

                    setTimeout(() => {
                        this.frontDiv.style.display = 'none';
                        this.backDiv.style.opacity = 1;

                        setTimeout(() => {
                            this.div.style.position = 'relative';
                            body.removeChild(this.div);
                            boardElement.appendChild(this.div);

                            this.div.style.top = '0px';
                            this.div.style.left = '0px';

                            if(this.value == 0) {
                                for(let y = Math.max(0, this.y-1); y <= Math.min(this.parent.outerDimensions.y-1, this.y+1); y++) {
                                    for(let x = Math.max(0, this.x-1); x <= Math.min(this.parent.outerDimensions.x-1, this.x+1); x++) {
                                        if(y != this.y || x != this.x) {
                                            this.parent.tileMap[y][x].tile.reveal(true);
                                        }
                                    }
                                }
                            }
                        }, 500);
                    }, 500);
                }
            }
        } else if(courd && (!this.parent.isOuter || !this.parent.mineception) && !this.flagged) {
            let flagCount = 0;
            let allCorrect = true;
            let arr = this.parent.game.accessAllTiles(this);
            arr.forEach(tile => {
                if(tile.tile.flagged) {
                    flagCount++;
                }
                if(tile.mine != tile.tile.flagged) {
                    allCorrect = false;
                }
            });
            if(flagCount == this.value) {
                if(!allCorrect) {
                    alert("Game over");
                } else {
                    let actuallyCourded = false;
                    let arr = this.parent.game.accessAllTiles(this);
                    arr.forEach(tile => {
                        if(!tile.mine) {
                            if(!tile.tile.wasRevealed) {
                                actuallyCourded = true;
                                tile.tile.reveal(true);
                            }
                        }
                    });
                    return actuallyCourded === true ? 1 : 0; // Return 1 if the courd was successful
                }
            }
        }
    }

    flag() {
        if(!this.wasRevealed) {
            this.flagged = !this.flagged;
            if(!this.flagged) {
                this.parent.game.assignTileProperties(this);
                this.parent.mineCount++;
            } else {
                this.div.innerHTML += '<img src="Flag.png">';
                this.parent.mineCount--;
            }
        }
    }
}