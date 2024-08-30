const root = document.querySelector(':root');
const body = document.querySelector('body');

//For extras, make the mine only gamemode
const boardContainer = document.querySelector('#boardContainer');
const boardElement = document.querySelector('#board');
const timer = document.querySelector('#boardScreen #timer');
const mineCountDiv = document.querySelector('#boardScreen #mineCountDiv');
const mineCount = document.querySelector('#boardScreen #mineCount');
const clickCount = document.querySelector('#boardScreen #clickCount');

let gamemode;

let deltaTime;
let previousTime;

let rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
let mouseClicks = {
    left: false,
    right: false
}
let keyboard = {
    Meta: false,
    Control: false
}

let colorArr = [
    'rgb(0, 160, 150)',
    'rgb(0, 178, 24)',
    'rgb(248, 125, 0)',
    'rgb(0, 78, 208',
    'rgb(218, 0, 0)',
    'rgb(218, 230, 0)',
    'rgb(0, 0, 0)',
    'rgb(100, 100, 100)'
];

let customizations = {
    outerDimensions: {
        x: 10,
        y: 10,
        density: 4.848484848484848
    },
    innerDimensions: {
        random: false,
        x: 10,
        y: 10,
        density: 4.848484848484848
    },
    noFlag: false,
    clickMechanics: 'mousedown'
}

if(localStorage.mineception != undefined) {
    customizations = JSON.parse(localStorage.mineception).customizations;
}
localStorage.mineception = JSON.stringify({customizations: customizations});

document.addEventListener('DOMContentLoaded', () => {
    const textContainer = document.querySelector('.text3dContainer');
    const text = 'MINECEPTION';
    const layers = 100; // Total number of layers
    const depth = 0.2; // Depth per layer

    // Create text layers
    for (let i = 0; i < layers; i++) {
        const layer = document.createElement('div');
        layer.className = 'text3dLayer';
        layer.style.transform = `translateZ(${i * depth}px)`;
        if (i < 80) {
            layer.style.color = `rgba(0, 0, 0, ${0.5 + i * 0.005})`;
        } else {
            layer.style.color = 'var(--titleColor)';
        }
        layer.textContent = text;
        textContainer.appendChild(layer);
    }

    let width = document.querySelector('.text3dContainer > div').offsetWidth;
    textContainer.style.width = `${width}px`;

    let x = 0;
    let y = 0;
    let z = 0;

    function rotateText(mouseover = false, ms = 2500, random = true) {
        if(x < -1000) {
            textContainer.style.transition = 'none';
            textContainer.style.transform = `rotateX(${x+1440}deg) rotateY(${y}deg) rotateZ(${z}deg)`;
            setTimeout(() => {
            textContainer.style.transition = 'transform 2500ms cubic-bezier(.35,.12,.42,1)';
            });
        }
        setTimeout(() => {
            if(!mouseover) {
                if(random) {
                    x = Math.random() * 70 - 35;
                    y = Math.random() * 40 - 20;
                    z = Math.random() * 30 - 15;
                }
            } else {
                x = Math.random() * 35 - 17.5 - 1440;
                y = Math.random() * 20 - 10;
                z = Math.random() * 15 - 7.5;
            }
            textContainer.style.transition = `transform ${ms}ms cubic-bezier(.35,.12,.42,1)`;
            textContainer.style.transform = `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`;
        });
    }

    let interval;

    textContainer.addEventListener('mouseover', () => {
        clearInterval(interval);
        rotateText(true);
        interval = setInterval(rotateText, 2500);
    });

    interval = setInterval(rotateText, 2500); // Rotate every second

    //Now, for animations for each gamemode

    let arrow = document.querySelector('#openingScreen #arrow');

    let divClickFunction = () => {
        x = 0;
        y = 0;
        z = 0;
        clearInterval(interval);
        rotateText(false, 1000, false);
    }

    let i = 0;
    document.querySelectorAll('#openingScreen #gamemodeHolder > div:not(#arrow)').forEach(div => {
        const I = i;
        div.addEventListener('mouseover', () => {
            arrow.style.top = `${14 + I*25}%`;
        });

        div.addEventListener('click', () => {
            divClickFunction();
            setTimeout(() => {
                if(['mineception', 'classicMinesweeper'].includes(div.id)) {
                    document.getElementById('openingScreen').fadeOut(500, false);
                    document.getElementById('boardScreen').classList.toggle('activeScreen');
                    document.getElementById('boardScreen').style.opacity = 0;
                    document.getElementById('boardScreen').fadeIn(500, 'flex');
                    setTimeout(() => {
                        document.getElementById('openingScreen').classList.toggle('activeScreen');
                    },500);
                }
                if(div.dataset.type == 'Mineception') {
                    gamemode = 'mineception';
                    createBoard(true);
                } else if(div.dataset.type == 'Classic Minesweeper') {
                    gamemode = 'classicMinesweeper';
                    createBoard();
                } else if(div.dataset.type == 'Puzzles') {

                } else if(div.dataset.type == 'Mines Only') {
                    gamemode = 'minesOnly';
                    createBoard();
                }
            }, 1000);
            if(div.dataset.type == 'Extra' || div.dataset.type == 'Back') {
                let ms = 0;
                let divs = document.querySelectorAll('#openingScreen #gamemodeHolder > div:not(#arrow), #openingScreen #playGame');
                let didSwitch = 0;
                let interval = setInterval(() => {
                    ms += 1000/60;
                    let percentage = ms/750;
                    if(percentage < 0.375) {
                        divs.forEach(div => {
                            div.innerHTML = div.dataset.type.substring(0, Math.ceil(div.dataset.type.length * (0.25-percentage)*4));
                        });
                    } else {
                        if(didSwitch < 5) {
                            didSwitch++;
                            ms -= 1000/60;
                            if(didSwitch == 1) {
                                divs.forEach(div => {
                                    let temp = div.dataset.type;
                                    console.log(div.dataset.inactive_type);
                                    div.dataset.type = div.dataset.inactive_type;
                                    div.dataset.inactive_type = temp;
                                });
                            }
                        } else {
                            divs.forEach(div => {
                                div.innerHTML = div.dataset.type.substring(0, Math.ceil(div.dataset.type.length * (percentage-0.25)*4));
                            });
                        }
                    }
                    if(ms > 750) {
                        clearInterval(interval);
                    }
                }, 1000/60);
            }
        })

        i++;
    });

    Customizations.updateInputs();
});

boardElement.addEventListener('mousedown', (event) => {
    if(event.button == 0) {
        mouseClicks.left = true;
    } else if(event.button == 2) {
        mouseClicks.right = true;
    }
});

document.addEventListener('mouseup', (event) => {
    if(event.button == 0) {
        mouseClicks.left = false;
    } else if(event.button == 2) {
        mouseClicks.right = false;
    }
});

document.addEventListener('keydown', (event) => {
    keyboard[event.key] = true;
    if(event.key == 'r' && Game.game.constructor.name == 'MinesOnly') {
        Game.game.newRound();
    }
});

document.addEventListener('keyup', (event) => {
    keyboard[event.key] = false;
});

let createBoard = (hasInnerBoard = false) => {
    boardElement.innerHTML = '';
    boardElement.style.gridTemplateColumns = `repeat(${customizations.outerDimensions.x}, 1fr)`;
    boardElement.style.gridTemplateRows = `repeat(${customizations.outerDimensions.y}, 1fr)`;

    new Board(customizations.outerDimensions, hasInnerBoard ? customizations.innerDimensions : false);
}

let animationFunction = () => {
    if(deltaTime == undefined) {
        deltaTime = 0;
        previousTime = Date.now();
    } else {
        deltaTime = Date.now() - previousTime;
        previousTime = Date.now();
    }
    let innerBoard = document.querySelector('.innerBoard');
    if(Board.board) {
        let outerBoardTileSize = boardElement.offsetWidth / Board.board.outerDimensions.x;
        document.documentElement.style.setProperty('--outerBoardFontSize', `${outerBoardTileSize*0.5/rem}rem`);
        if(innerBoard !== null) {
            let y = parseInt(innerBoard.dataset.y);
            let x = parseInt(innerBoard.dataset.x);
            mineCountDiv.style.backgroundColor = 'var(--superDarkTitleColor)';
            mineCount.innerHTML = Board.board.tileMap[y][x].mineCount;
        } else {
            mineCountDiv.style.backgroundColor = 'var(--evenDarkerBackgroundColor)';
            mineCount.innerHTML = Board.board.mineCount;
        }

        if(Board.board.ms != undefined) {
            Board.board.ms += deltaTime;
            let minutes = Math.floor(Board.board.ms / 60000);
            let seconds = Math.floor((Board.board.ms % 60000) / 1000);
            let remaining = Math.floor(Board.board.ms % 100);
            timer.innerHTML = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}.${remaining < 10 ? '0' : ''}${remaining}`;
        }
    }

    if(innerBoard !== null) {
        let innerBoardTileSize = innerBoard.offsetWidth / Board.board.innerDimensions.x;
        document.documentElement.style.setProperty('--innerBoardFontSize', `${innerBoardTileSize*0.5/rem}rem`);
    }

    requestAnimationFrame(animationFunction);
}

requestAnimationFrame(animationFunction);