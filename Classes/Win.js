class Win {
    static blur = document.querySelector('#blur');
    static div = document.querySelector('#winDiv');
    static statsDiv = document.querySelector('#winDiv #statsList');

    static update(obj) {

        let Class = obj.constructor;
        Win.blur.fadeIn(500, 'flex');

        Win.statsDiv.innerHTML = '';
        for(let i = 0; i < Class.stats.length; i++) {
            let stat = Class.stats[i];
            if(stat == 'time') {
                let minutes = Math.floor(Board.board.ms / 60000);
                let seconds = Math.floor((Board.board.ms % 60000) / 1000);
                let remaining = Math.floor(Board.board.ms % 100);
                let text = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}.${remaining < 10 ? '0' : ''}${remaining}`;
                Win.statsDiv.innerHTML += `<div>Time: ${text}</div>`;
                Board.board.ms = undefined;
            } else if(stat == 'rounds') {
                Win.statsDiv.innerHTML += `<div>Rounds: ${Game.game.rounds}</div>`;
            } else if(stat == 'dimensions') {
                Win.statsDiv.innerHTML += `<div>Rows: ${Board.board.tileMap.length}</div><div>Columns: ${Board.board.tileMap[0].length}</div>`;
            } else if(stat == 'mines') {
                Win.statsDiv.innerHTML += `<div>Mines: ${Board.board.ogMineCount}</div>`;
            }
        }
    }

    static close() {

    }
}