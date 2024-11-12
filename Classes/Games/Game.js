class Game {
    
    static game;

    constructor(board) {
        this.board = board;
        board.game = this;
        if(document.querySelector('.innerBoard') != null) {
            document.querySelector('.innerBoard').fadeOut(200, true);
        }
        this.gameDotGame();
    }

    gameDotGame() {
        this.eventListeners();
        if(Game.game) {
            Game.game.board.box.removeEventListener('mousedown', Game.game.LCEL);
            Game.game.board.box.removeEventListener('contextmenu', Game.game.RCEL);
        }
        Game.game = this;
    }
    
    eventListeners() {
        this.board.box.removeEventListener('mousedown', this.LCEL);
        this.board.box.removeEventListener('contextmenu', this.RCEL);
        this.board.box.addEventListener('mousedown', this.LCEL);
        this.board.box.addEventListener('contextmenu', this.RCEL);
    }

    LCEL = (event) => {
        if(event.button === 0) { //If it is a left click)
            this.leftClickFunction(event);
        }
    }

    RCEL = (event) => {
        event.preventDefault();
        this.rightClickFunction(event);
    }

    leftClickFunction(event) {
        let div = event.target;
        if(!this.board.mineception && !event.target.classList.contains('tile')) {
            div = event.target.parentNode;
        }
        if(!div.classList.contains('tile')) return;
        let y = parseInt(div.dataset.y);
        let x = parseInt(div.dataset.x);
        if(this.board.firstClick) {
            this.board.ms = 0;
            this.board.firstClick = false;
            this.board.fixMines(y, x);
            if(this.constructor.name == 'ChessSweeper') {
                this.assignPieces();
                this.firstReveal(y, x);
            }
        }
        if((keyboard.Meta || keyboard.Control) && this.board.tileMap[y][x].tile.wasRevealed === false) {
            this.rightClickFunction(event);
        } else {
            if(this.board.tileMap[y][x].mine === true) {
                alert("Game over");
            } else {
                let tile = this.board.tileMap[y][x].tile;
                tile.reveal(false, keyboard.Control || keyboard.Meta);
            }
        }
        this.board.checkForCompletion();
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
    
    assignTileProperties(tile) {
        tile.div.innerHTML = '';
    }

    accessAllTiles(tile) {
        let arr = [];
        for(let y = Math.max(0, tile.y-1); y <= Math.min(tile.parent.outerDimensions.y-1, tile.y+1); y++) {
            for(let x = Math.max(0, tile.x-1); x <= Math.min(tile.parent.outerDimensions.x-1, tile.x+1); x++) {
                if(y != tile.y || x != tile.x) {
                    arr.push(tile.parent.tileMap[y][x]);
                }
            }
        }
        return arr;
    }
}