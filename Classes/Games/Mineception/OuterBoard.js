class OuterBoard extends Mineception {

    constructor(board) {
        super(board);
    }

    leftClickFunction(event) {
        let div;
        if(event.target.parentNode.classList.contains('tile')) {
            div = event.target.parentNode;
            let y = div.dataset.y;
            let x = div.dataset.x;
            if(this.board.firstClick) {
                this.board.ms = 0;
                this.board.firstClick = false;
                this.board.fixMines(y, x);
            }
            if(keyboard.Meta || keyboard.Control) {
                this.rightClickFunction(event);
                return;
            }
            if(this.board.tileMap[y][x].mine === true) {
                // Game over
            } else {
                this.board.tileMap[y][x].enlarge();
            }
        }
    }

    rightClickFunction(event) {
        let div;
        if(event.target.parentNode.classList.contains('tile')) {
            div = event.target.parentNode;
            let y = div.dataset.y;
            let x = div.dataset.x;
            this.board.tileMap[y][x].tile.flag();
        } else if(event.target.tagName === "IMG") {
            div = event.target.parentNode.parentNode;
            let y = div.dataset.y;
            let x = div.dataset.x;
            this.board.tileMap[y][x].tile.flag();
        }
    }
}