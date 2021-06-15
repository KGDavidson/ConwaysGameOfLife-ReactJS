import './App.css';
import React, {useState, useEffect, useRef} from 'react';

const CANVAS_WIDTH = window.innerWidth;
const CANVAS_HEIGHT = window.innerHeight;

const CELL_SIZE = 20;
const CELL_ALIVE_COLOUR = "#000000"
const CELL_DEAD_COLOUR = "#FFFFFF"
const TIMESTEP = 50;

let gameGrid;

class Cell {
    constructor(ctx, x, y, alive) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.alive = Math.random() > 0.9;
        this.aliveColour = CELL_ALIVE_COLOUR;
        this.deadColour = CELL_DEAD_COLOUR;
    }
    draw() {
        this.ctx.translate(this.x, this.y);
        this.ctx.beginPath();
        this.ctx.rect(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        this.ctx.closePath();
        this.ctx.fillStyle = this.alive ? this.aliveColour : this.deadColour;
        this.ctx.fill();
        this.ctx.translate(-this.x, -this.y);
    }
    checkNeighbours(gameGrid) {
        let aliveNeighbours = -1 * (this.alive ? 1 : 0);
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                try {
                    aliveNeighbours += (gameGrid[this.x + i][this.y + j].alive ? 1 : 0);
                } catch (e) {}
            }
        }

        if (this.alive) {
            if (aliveNeighbours < 2 || aliveNeighbours > 3) {
                this.alive = false;
            }
        } else {
            if (aliveNeighbours === 3) {
                this.alive = true;
            }
        }
    }
}

function initialiseGrid(ctx, initXSize, initYSize) {
    let newGameGrid = Array(initXSize);
    for (let x = 0; x < initXSize; x++) {
        newGameGrid[x] = Array(initYSize);
    }
    for (let x = 0; x < newGameGrid.length; x++) {
        for (let y = 0; y < newGameGrid[x].length; y++) {
            newGameGrid[x][y] = new Cell(ctx, x, y, true)
        }
    }
    return newGameGrid;
}

function App() {
    const canvasRef = useRef(null);

    useEffect(()=>{
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        gameGrid = initialiseGrid(ctx, 40, 40);

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let x = 0; x < gameGrid.length; x++) {
                for (let y = 0; y < gameGrid[x].length; y++) {
                    gameGrid[x][y].checkNeighbours(gameGrid);
                    gameGrid[x][y].draw();
                }
            }

            if (TIMESTEP <= 10) {
                requestAnimationFrame(render);
            } else {
                setTimeout(() => {render()}, TIMESTEP);
            }
        }
        render();
    }, []);

    return (<canvas id="canvas" ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}></canvas>);
}

export default App;
