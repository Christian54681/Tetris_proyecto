import { Game } from "/logica/game.js";

const canvasTetris = document.getElementById('canvasTetris');
const canvasSiguientes = document.getElementById('canvasSiguientes');
const score = document.getElementById('score');
const menu = document.getElementById('menu');
const btnMenu = document.getElementById('btn-start');
const nivel = document.getElementById('nivel');
const highScoreElement = document.getElementById('highScore');
const tetrisMusic = document.getElementById('tetris-music');

const rows = 20;
const cols = 10;
const cellSize = 26;
const space = 2;

const game = new Game(canvasTetris, rows, cols, cellSize, space, canvasSiguientes);

function dibujarFrame(){
    if (game.gameOver) {
        menu.style.display = "flex";
        tetrisMusic.pause();
        tetrisMusic.currentTime = 0;
    } else{
        game.actualizar();
        score.innerHTML = game.score;
        nivel.innerHTML = game.level;
    }
    requestAnimationFrame(dibujarFrame);
}

btnMenu.addEventListener("click", () =>{
    setTimeout( () => {
        menu.style.display = "none";
        game.reset();
        actualizarHighScoreDisplay();

        tetrisMusic.play().catch(error => {
            console.warn("La reproducción automática falló. ", error);
        });
    }, 200);
});

actualizarHighScoreDisplay();
dibujarFrame();
tetrisMusic.play()


function actualizarHighScoreDisplay() {
    // 1. Obtener el High Score guardado en localStorage. Si no existe, es 0.
    const highScore = localStorage.getItem('tetrisHighScore') || 0;
    
    // 2. Mostrarlo en el elemento HTML, si existe.
    if (highScoreElement) {
        highScoreElement.innerHTML = highScore;
    }
}