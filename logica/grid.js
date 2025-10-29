import { Pieza } from "/logica/piezas.js";

export class Grid{
    constructor(canvas, rows, cols, cellSize, space){
            this.canvas = canvas;
            this.ctx = canvas.getContext("2d");
            this.rows = rows;
            this.cols = cols;
            this.cellSize = cellSize;
            this.space = space;
            this.matriz = [];
            this.restartMatriz();

            this.canvas.width = this.cols * this.cellSize + (this.space*this.cols);
            this.canvas.height = this.rows * this.cellSize + (this.space*this.rows);

            this.block = new Pieza(this.canvas, this.cellSize);
    }

    restartMatriz(){
        for (let r = 0; r < this.rows; r++) {
            this.matriz[r] = [];
            for (let c = 0; c < this.cols; c++) {
                this.matriz[r][c] = 0;
            }
            
        }
    }

    dibujarCuadro(x, y, side, color, borderColor, border){
        const borderSize = side / border;
        
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, side, side);

        this.ctx.strokeStyle = borderColor;
        this.ctx.lineWidth = borderSize;
        this.ctx.strokeRect(x+borderSize/2, y+borderSize/2, side - borderSize, side - borderSize);
    }

    getCoordenadas(col, row){
        return {x: col * (this.cellSize + this.space), y: row * (this.cellSize + this.space)}
    }

    dibujarTablero(){
        for (let r = 0; r < this.rows; r++) {
            for(let c = 0; c < this.cols; c++){
                const posicion = this.getCoordenadas(c, r);

                if(this.matriz[r][c] !== 0){
                    this.block.dibujarBloque(posicion.x, posicion.y, this.matriz[r][c]);
                } else {
                    this.dibujarCuadro(posicion.x, posicion.y, this.cellSize, "#000", "#303030", 10);
                }
            }
        }
        this.imprimeMatriz();
    }
    dibujarTableroPeque(){
        this.dibujarFondoNegro();
        for (let r = 0; r < this.rows; r++) {
            for(let c = 0; c < this.cols; c++){
                const posicion = this.getCoordenadas(c, r);

                if(this.matriz[r][c] !== 0){
                    if (this.matriz[r][c] === 2){
                        this.block.dibujarBloque(posicion.x + this.cellSize, posicion.y, this.matriz[r][c]);
                    } else if (this.matriz[r][c] === 3){
                        this.block.dibujarBloque(posicion.x, posicion.y, this.matriz[r][c]);
                    } else {
                        this.block.dibujarBloque(posicion.x + this.cellSize/2, posicion.y, this.matriz[r][c]);
                    }
                }
            }
        }
    }
    dibujarFondoNegro(){
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }

    imprimeMatriz(){
        let text = "";
        this.matriz.forEach( (row) => {
            text += row.join(" ") + "\n";
        });
        console.log(text);
        
    }
}