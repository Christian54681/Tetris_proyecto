class Position {
    constructor(row, column){
        this.row = row;
        this.column = column
    }
}

class Pieza {
    constructor(canvas, cellSize, shapes = [], initPosition = new Position, id=1){
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.cellSize = cellSize;
        this.shapes = shapes;
        this.rotation = 0;
        this.initPosition =  initPosition;
        this.position =new Position(this.initPosition.row, this.initPosition.column);
        this.id = id;
    }

    dibujarCuadrado(x, y, size, color){
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, size, size);
    }

    dibujarTriangulo(x1, y1, x2, y2, x3, y3, color){
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.lineTo(x3, y3);
        this.ctx.closePath();
        this.ctx. fillStyle = color;
        this.ctx.fill();
    }

    getColorPieza(id){
        const paleta = {
            1: {
                trianguloDerecho : "#B5193B",
                trianguloIzquierdo : "#ffffff",
                cuadrado : "#EE1B2E"
            },
            2: {
                trianguloDerecho : "#FE5E02",
                trianguloIzquierdo : "#ffffff",
                cuadrado : "#FE8602"
            },
            3: {
                trianguloDerecho : "#FE8601",
                trianguloIzquierdo : "#ffffff",
                cuadrado : "#FFDB01"
            },
            4: {
                trianguloDerecho : "#22974C",
                trianguloIzquierdo : "#ffffff",
                cuadrado : "#24DC4F"
            },
            5: {
                trianguloDerecho : "#49BDFF",
                trianguloIzquierdo : "#ffffff",
                cuadrado : "#2D97F7"
            },
            6: {
                trianguloDerecho : "#0000C9",
                trianguloIzquierdo : "#ffffff",
                cuadrado : "#0101F1"
            },
            7: {
                trianguloDerecho : "#8500D3",
                trianguloIzquierdo : "#ffffff",
                cuadrado : "#A000F1"
            }
        }
        return paleta[id] || paleta[1]
    }

    dibujarBloque(x, y, id){
        const margin = this.cellSize / 8;
        const paleta = this.getColorPieza(id);

        this.dibujarTriangulo(
            x , y,
            x + this.cellSize, y,
            x, y + this.cellSize,
            paleta.trianguloIzquierdo
        );

        this.dibujarTriangulo(
            x + this.cellSize, y,
            x + this.cellSize, y + this.cellSize,
            x, y + this.cellSize,
            paleta.trianguloDerecho
        );

        this.dibujarCuadrado(
            x + margin,
            y + margin,
            this.cellSize - (margin * 2),
            paleta.cuadrado
        );
    }

    direccionActual(){
        return this.shapes[this.rotation];
    }

    dibujar(grid){
        const shape = this.direccionActual();
        for (let i = 0; i < shape.length; i++) {
            const position = grid.getCoordenadas(
                this.position.column + shape[i].column,
                this.position.row + shape[i].row
            );
            this.dibujarBloque(position.x, position.y, this.id);
        }
    }
    posicionActual(){
        const positions = [];
        const shape = this.direccionActual();
        for (let i = 0; i < shape.length; i++) {
            positions.push(new Position(
                this.position.row + shape[i].row,
                this.position.column + shape[i].column
            ));
        }
        return positions;
    }

    mover(row, column){
        this.position.row += row,
        this.position.column += column;
    }

    reiniciar(){
        this.rotation = 0;
        this.position = new Position(this.initPosition.row, this.initPosition.column);
    }
}

const TipoPieza = {
    T:{
        id: 1,
        initPosition: new Position(0, 3),
        shapes: [
            [new Position(0, 1), new Position(1, 0), new Position(1, 1), new Position(1, 2)],
            [new Position(0, 1), new Position(1, 1), new Position(1, 2), new Position(2, 1)],
            [new Position(1, 0), new Position(1, 1), new Position(1, 2), new Position(2, 1)],
            [new Position(0, 1), new Position(1, 0), new Position(1, 1), new Position(2, 1)]
        ]
    },
    O:{
        id: 2,
        initPosition: new Position(0, 4),
        shapes: [
            [new Position(0, 0), new Position(0, 1), new Position(1, 0), new Position(1, 1)],
        ]
    },
    I:{
        id: 3,
        initPosition: new Position(-1, 3),
        shapes: [
            [new Position(1, 0), new Position(1, 1), new Position(1, 2), new Position(1, 3)],
            [new Position(0, 2), new Position(1, 2), new Position(2, 2), new Position(3, 2)],
            [new Position(2, 0), new Position(2, 1), new Position(2, 2), new Position(2, 3)],
            [new Position(0, 1), new Position(1, 1), new Position(2, 1), new Position(3, 1)]
        ]
    },
    S:{
        id: 4,
        initPosition: new Position(0, 3),
        shapes: [
            [new Position(0, 1), new Position(0, 2), new Position(1, 0), new Position(1, 1)],
            [new Position(0, 1), new Position(1, 1), new Position(1, 2), new Position(2, 2)],
            [new Position(1, 1), new Position(1, 2), new Position(2, 0), new Position(2, 1)],
            [new Position(0, 0), new Position(1, 0), new Position(1, 1), new Position(2, 1)]
        ]
    },
    Z:{
        id: 5,
        initPosition: new Position(0, 3),
        shapes: [
            [new Position(0, 0), new Position(0, 1), new Position(1, 1), new Position(1, 2)],
            [new Position(0, 2), new Position(1, 1), new Position(1, 2), new Position(2, 1)],
            [new Position(1, 0), new Position(1, 1), new Position(2, 1), new Position(2, 2)],
            [new Position(0, 1), new Position(1, 0), new Position(1, 1), new Position(2, 0)]
        ]
    },
    J:{
        id: 6,
        initPosition: new Position(0, 3),
        shapes: [
            [new Position(0, 0), new Position(1, 0), new Position(1, 1), new Position(1, 2)],
            [new Position(0, 1), new Position(0, 2), new Position(1, 1), new Position(2, 1)],
            [new Position(1, 0), new Position(1, 1), new Position(1, 2), new Position(2, 2)],
            [new Position(0, 1), new Position(1, 1), new Position(2, 0), new Position(2, 1)]
        ]
    },
    L:{
        id: 7,
        initPosition: new Position(0, 3),
        shapes: [
            [new Position(0, 2), new Position(1, 0), new Position(1, 1), new Position(1, 2)],
            [new Position(0, 1), new Position(1, 1), new Position(2, 1), new Position(2, 2)],
            [new Position(1, 0), new Position(1, 1), new Position(1, 2), new Position(2, 0)],
            [new Position(0, 0), new Position(0, 1), new Position(1, 1), new Position(2, 1)]
        ]
    }
}

class BolsaDePiezas{
    constructor(canvas, cellSize){
        this.canvas = canvas;
        this.cellSize = cellSize;
        this.bolsa = [];
        this.tresPiezasSiguientes = [];
    }
    init(){
        for (let i = 0; i < 3; i++) {
            this.tresPiezasSiguientes.push(this.getSiguientePieza());
        }
    }
    llenarBolsa(){
        const tipoPieza = [
            TipoPieza.T,
            TipoPieza.O,
            TipoPieza.I,
            TipoPieza.S,
            TipoPieza.Z,
            TipoPieza.J,
            TipoPieza.L,
        ]
        this.bolsa.length = 0;
        tipoPieza.forEach( (tipoPieza) => {
            this.bolsa.push(new Pieza(
                this.canvas, this.cellSize, tipoPieza.shapes, tipoPieza.initPosition, tipoPieza.id
            ));
        });
        for (let i = this.bolsa.length -1; i>0; i--) {
            let j = Math.floor(Math.random() * (i+1));
            [this.bolsa[i], this.bolsa[j]] = [this.bolsa[j], this.bolsa[i]]
        }
    }
    getSiguientePieza(){
        if (this.bolsa.length == 0) {
            this.llenarBolsa();
        }
        return this.bolsa.pop()
    }
    siguientePieza(){
        const siguiente = this.tresPiezasSiguientes.shift();
        this.tresPiezasSiguientes.push(this.getSiguientePieza());
        return siguiente;
    }
    getTresPiezasSiguientes(){
        return this.tresPiezasSiguientes;
    }
    reset(){
        this.bolsa = [];
        this.tresPiezasSiguientes = [];
        this.init();
    }
}

export {Position, Pieza, TipoPieza, BolsaDePiezas}
