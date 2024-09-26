class MinesOnly extends Game {

    static stats = ['rounds', 'time', 'dimensions', 'mines'];

    constructor(board) {
        super(board);
        this.rounds = 0;
        clickCount.innerHTML = 0;
        this.clickCount = 0;
    }

    newRound() {
        this.clickCount++;
        clickCount.innerHTML = this.clickCount;
        let tileMap = this.board.tileMap;
        let courdedAmount = 1;
        while(courdedAmount != 0) {
            courdedAmount = 0;
            for(let y = 0; y < tileMap.length; y++) {
                for(let x = 0; x < tileMap[y].length; x++) {
                    if(tileMap[y][x].tile.wasRevealed) {
                        let result = tileMap[y][x].tile.reveal(true, true);
                        if(!isNaN(result)) {
                            courdedAmount += result;
                        }
                    }
                }
            }
        }

        if(this.checkForCompletion()) {
            Win.update(this);
            return;
        }
        this.rounds++;
    }

    leftClickFunction(event) {
        if(this.board.firstClick) {
            super.leftClickFunction(event);
        } else {
            let div = event.target;
            if(!this.board.mineception && !event.target.classList.contains('tile')) {
                div = event.target.parentNode;
            }
            let y = div.dataset.y;
            let x = div.dataset.x;

            if((keyboard.Meta || keyboard.Control) && this.board.tileMap[y][x].tile.wasRevealed === false) {
                super.rightClickFunction(event);
            } else {
                let tile = this.board.tileMap[y][x].tile;
                if(tile.wasRevealed || tile.flagged) return;
                if(this.clickCount > 0) {
                    this.clickCount--;
                    clickCount.innerHTML = this.clickCount;
                    if(this.board.tileMap[y][x].mine === true) {
                        alert("Game over");
                    } else {
                        tile.reveal(false, false);
                    }
                } else {
                    clickCount.style.backgroundColor = 'var(--titleColor)';
                    setTimeout(() => {
                        clickCount.style.backgroundColor = 'var(--evenDarkerBackgroundColor)';
                    }, 200);
                }
            }
        }

        this.checkForCompletion();
    }

    rightClickFunction(event) {
        let div;
        div = event.target;
        if(event.target.parentNode.classList.contains('tile')) {
            div = event.target.parentNode;
        }
        let y = parseInt(div.dataset.y);
        let x = parseInt(div.dataset.x);
        this.board.tileMap[y][x].tile.flag();
    }

    checkForCompletion() {
        let allFlags = true;
        let allRevealed = true;
        this.board.tileMap.forEach(row => {
            row.forEach(tile => {
                if(tile.mine) {
                    if(!tile.tile.flagged) {
                        allFlags = false;
                    }
                } else if(!tile.tile.wasRevealed) {
                    allRevealed = false;
                }
            });
        });
        return allRevealed || allFlags;
    }
}