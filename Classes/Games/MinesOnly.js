class MinesOnly extends Game {

    constructor(board) {
        super(board);
        this.rounds = 0;
        this.clickCount = 0;
    }

    newRound() {
        this.rounds++;
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
                if(this.clickCount > 0) {
                    this.clickCount--;
                    clickCount.innerHTML = this.clickCount;
                    let tile = this.board.tileMap[y][x].tile;
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
}