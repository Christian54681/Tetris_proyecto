import { Grid } from '/logica/grid.js'

export class BoardTetris extends Grid{
    constructor(canvas, rows, cols, cellSize, space){
        super(canvas, rows, cols, cellSize, space)
    }
    enRango(row, col){
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }

    vacia(row, col){
        return this.enRango(row, col) && this.matriz[row][col] === 0;
    }
    filaLlena(row){
        return this.matriz[row].every(element => element !== 0);
    }
    filaVacia(row){
        return this.matriz[row].every(element => element === 0);
    }
    limpiarFila(row){
        return this.matriz[row].fill(0);
    }
    bajarFila(row, numFila){
        this.matriz[row + numFila] = this.matriz[row].slice();
        this.limpiarFila(row);
    }
    limpiarFilasLlenas(){
        let cont = 0;
        for (let row = this.rows -1; row >= 0; row--) {
            if(this.filaLlena(row)){
                this.limpiarFila(row);
                cont++;
            } else if(cont > 0){
                this.bajarFila(row, cont);
            }
            
        }
        return cont;
    }
    gameOver(){
        return !(this.filaVacia(0));
    }
}
export class BoardNext extends Grid{
    constructor(canvas, rows, col, cellSize, space, listPiezas){
        super(canvas, rows, col, cellSize, space);
        this.listPiezas = listPiezas;
        this.actualizarMatriz();
    }
    actualizarMatriz(){
        this.restartMatriz();
        let cont = 0;
        for (let i = 0; i < this.listPiezas.length; i++) {
            // no se si es direccionActual o posicionActual
            const shape = this.listPiezas[i].direccionActual();
            for (let j = 0; j < shape.length; j++) {
                this.matriz[shape[j].row + cont][shape[j].column] = this.listPiezas[i].id;
            }
            cont += 3;
        }
    }
}