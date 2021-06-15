import './App.css';
import React, {useState, useEffect, useRef} from 'react';

const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;
let gameGrid;
const CELL_SIZE = 20;
const CELL_ALIVE_COLOUR = "#FFFFFF"
const CELL_DEAD_COLOUR = "#000000"

class Cell {
    constructor(ctx, x, y, alive) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.alive = Math.random() < 0.95;
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
    checkNeighbours() {
        let aliveNeighbours = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                
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
        console.log(gameGrid);

        const render = ()=>{
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            
            for (let x = 0; x < gameGrid.length; x++) {
                for (let y = 0; y < gameGrid[x].length; y++) {
                    gameGrid[x][y].checkNeighbours(gameGrid);
                    gameGrid[x][y].draw();
                }
            }

            /*for (var i = 0; i < boids.length; i++) {
                let boidsNearX = [];
                let boidsNearY = [];
                for (var j = 0; j < boids.length; j++) {
                    let distance = Math.sqrt(Math.pow(boids[i].x - boids[j].x, 2) + Math.pow(boids[i].y - boids[j].y, 2))
                    if (boids[i] !== boids[j] && Math.abs(distance) < boids[i].checkRadius) {
                        boids[i].drawSpecialLine(boids[j]);
                        boidsNearX.push(boids[j].x);
                        boidsNearY.push(boids[j].y);
                        boids[i].alignment(boids[j]);
                        boids[i].separation(boids[j]);
                    }
                }
                boids[i].cohesion(boidsNearX, boidsNearY);
                boids[i].draw();
                boids[i].move();
                boids[i].wallCheck();
            }*/

            requestAnimationFrame(render);
        }
        render();
    }, []);

    return (<canvas id="canvas" ref={canvasRef} width={canvasWidth} height={canvasHeight}></canvas>);
}

export default App;
