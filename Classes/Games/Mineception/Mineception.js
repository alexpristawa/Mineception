class Mineception extends Game {

    static stats = ['time', 'dimensions', 'mines'];

    constructor(board) {
        super(board);
    }

    assignTileProperties(tile) {
        let img = tile.div.querySelector('img');
        tile.div.removeChild(img);
    }
}