import { BoardTetris, BoardNext } from "/logica/BoardTetris.js";
import { BolsaDePiezas } from "/logica/piezas.js";

export class Game {
    constructor(canvas, rows, cols, cellSize, space, canvasSiguientes){
        this.boardTetris = new BoardTetris(canvas, rows, cols, cellSize, space);
        this.bolsaDePiezas = new BolsaDePiezas(canvas, cellSize);
        this.bolsaDePiezas.init();
        this.piezaActual = this.bolsaDePiezas.siguientePieza();
        this.eventosTeclado();
        this.keys = {up:false, down:false};

        this.lastTime = 0;
        this.lastTime2 = 0;

        this.boardSiguiente = new BoardNext(canvasSiguientes, 8, 4, cellSize, space, this.bolsaDePiezas.getTresPiezasSiguientes());

        this.score = 0;
        this.gameOver = false;
        this.level = 1;
        this.speed = 1000;              // tiempo inicial
        this.speedMultiplier = 0.7;     // cada nivel aumenta un 50%
    }
    actualizar(){
        let Atime = Date.now();
        let dTime = Atime - this.lastTime;
        let dTime2 = Atime - this.lastTime2;
        // cambiar el 1000 por una variable para poder ajustar el timepo
        
        if (this.score >= this.level * 250) {
            this.level++;
            this.speed *= this.speedMultiplier; // acelera
            console.log(`Nivel ${this.level} - Velocidad: ${this.speed.toFixed(0)}ms`);
        }
        console.log(this.level);
        
        if (dTime >= this.speed){
            this.movimientoAuto();
            this.lastTime = Atime;
        }
        if (dTime2 >= 50){
            this.boardTetris.dibujarTablero();
            this.dibujaPiezaFantasma();
            this.piezaActual.dibujar(this.boardTetris);

            this.boardSiguiente.dibujarTableroPeque();

            if (this.keys.down) {
                this.moverPAbajo();
            }
            this.lastTime2 = Atime;
        }
    }

    movimientoAuto(){
        if (!this.piezaActual) return;
        this.piezaActual.mover(1, 0);
        if(this.piezaBloqueada()){
            this.piezaActual.mover(-1, 0);
            this.colocarPieza();
        }
    }

    piezaBloqueada(){
        const posicionesPieza = this.piezaActual.posicionActual();
        for (let i = 0; i < posicionesPieza.length; i++) {
            if (!this.boardTetris.vacia(posicionesPieza[i].row, posicionesPieza[i].column)) {
                return true;
            }
        }
        return false;
    }

    moverPIzquierda(){
        this.piezaActual.mover(0, -1);
        if(this.piezaBloqueada()){
            this.piezaActual.mover(0, 1);
        }
    }
    moverPDerecha(){
        this.piezaActual.mover(0,1);
        if(this.piezaBloqueada()){
            this.piezaActual.mover(0, -1);
        }
    }
    moverPAbajo(){
        this.piezaActual.mover(1, 0);
        if(this.piezaBloqueada()){
            this.piezaActual.mover(-1, 0);
        }
    }
    rotarPiezaH(){
        this.piezaActual.rotation++;
        if(this.piezaActual.rotation > this.piezaActual.shapes.length-1){
            this.piezaActual.rotation = 0;
        }
        if(this.piezaBloqueada()){
            this.rotarPiezaAH();
        }
    }
    rotarPiezaAH(){
        this.piezaActual.rotation--;
        if (this.piezaActual.rotation < 0) {
            this.piezaActual.rotation = this.piezaActual.shapes.length - 1;
        }
        if (this.piezaBloqueada()) {
            this.rotarPiezaH();
        }
    }
    colocarPieza(){
        const piezaPosicion = this.piezaActual.posicionActual();
        for (let i = 0; i < piezaPosicion.length; i++) {
            this.boardTetris.matriz
                        [piezaPosicion[i].row]
                        [piezaPosicion[i].column] = this.piezaActual.id;
        }
        // eliminar filas llenas
        this.score += this.boardTetris.limpiarFilasLlenas() * 50;
        if (this.boardTetris.gameOver()){
            // logica para guardar en localStorage
            const highScore = localStorage.getItem('tetrisHighScore') || 0;
            if (this.score > parseInt(highScore)) {
                localStorage.setItem('tetrisHighScore', this.score);
                console.log(`¡Nuevo récord! ${this.score}`);
            }
            setTimeout(() => {
                this.gameOver = true;

            }, 500)
            return true;
        } else {
            this.piezaActual = this.bolsaDePiezas.siguientePieza();
            this.boardSiguiente.listPiezas = this.bolsaDePiezas.getTresPiezasSiguientes();
            this.boardSiguiente.actualizarMatriz();
        }
    }
    distanciaCaida(position){
        let distancia = 0;
        while (this.boardTetris.vacia(position.row + distancia + 1, position.column)) {
            distancia++;
        }
        return distancia;
    }
    distanciaCaidaPieza(){
        let caida = this.boardTetris.rows;
        const piezaPosicion = this.piezaActual.posicionActual();
        for (let i = 0; i < piezaPosicion.length; i++) {
            caida = Math.min(caida, this.distanciaCaida(piezaPosicion[i]))
        }
        return caida;
    }
    dibujaPiezaFantasma(){
        const distanciaCaida = this.distanciaCaidaPieza();
        const piezaPosicion =this.piezaActual.posicionActual();
        for (let i = 0; i < piezaPosicion.length; i++) {
            let position = this.boardTetris.getCoordenadas(
            piezaPosicion[i].column,
            piezaPosicion[i].row + distanciaCaida
            );
            // dibujamos el bloque fantasma
            this.boardTetris.dibujarCuadro(position.x, position.y, this.boardTetris.cellSize, "#000", "#fff",  20);
        }
    }
    reset(){
        this.gameOver = false;
        this.boardTetris.restartMatriz();
        this.score = 0;
        this.bolsaDePiezas.reset();
        this.piezaActual = this.bolsaDePiezas.siguientePieza();
        this.boardSiguiente.restartMatriz();
        this.boardSiguiente.listPiezas = this.bolsaDePiezas.getTresPiezasSiguientes();
        this.boardSiguiente.actualizarMatriz();
        this.boardSiguiente.dibujarTableroPeque();
        this.level = 1;
        this.speed = 1000;
    }

    eventosTeclado(){
        window.addEventListener("keydown", (evt) => {
            if (evt.key === "ArrowLeft") {
                this.moverPIzquierda();
            }
            if (evt.key === "ArrowRight") {
                this.moverPDerecha();
            }
            if (evt.key === " " && !this.keys.up) {
                this.rotarPiezaH();
                this.keys.up = true;
            }
            if (evt.key === "ArrowDown") {
                this.keys.down = true;
            }
        });
        window.addEventListener("keyup", (evt) =>{
            if (evt.key === " ") {
                this.keys.up = false;
            }
            if (evt.key === "ArrowDown") {
                this.keys.down = false;
            }
        });
        
    }
}