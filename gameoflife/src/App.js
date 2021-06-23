import "./App.css";
import React, { useState, useEffect, useRef } from "react";

const CANVAS_WIDTH = window.innerWidth;
const CANVAS_HEIGHT = window.innerHeight;

const CELL_SIZE = 10;
const CELL_ALIVE_COLOUR = "#000000";
const CELL_DEAD_COLOUR = "#FFFFFF";
const CELL_PAUSED_COLOUR = "#999999";
const TIMESTEP = 50;

let gameGrid;
let canvas;
let playing = true;
let mouseRightLeft = false;
let mouseCounter = 0;

class Cell {
    constructor(ctx, x, y, alive, lastChanged) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.alive = alive;
        this.newAlive = alive;
        this.lastChanged = lastChanged;
    }
    draw() {
        this.alive = this.newAlive;
        this.ctx.translate(this.x * CELL_SIZE, this.y * CELL_SIZE);
        this.ctx.beginPath();
        this.ctx.rect(0, 0, CELL_SIZE - 1, CELL_SIZE - 1);
        this.ctx.closePath();
        this.ctx.fillStyle = this.alive
            ? playing
                ? CELL_ALIVE_COLOUR
                : CELL_PAUSED_COLOUR
            : CELL_DEAD_COLOUR;
        this.ctx.fill();
        this.ctx.translate(-this.x * CELL_SIZE, -this.y * CELL_SIZE);
    }
    setAlive(alive) {
        this.newAlive = alive;
    }
    checkNeighbours(gameGrid) {
        let aliveNeighbours = -1 * (this.alive ? 1 : 0);
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                try {
                    aliveNeighbours += gameGrid[this.x + i][this.y + j].alive
                        ? 1
                        : 0;
                } catch (e) {}
            }
        }

        if (this.alive) {
            this.newAlive =
                aliveNeighbours < 2 || aliveNeighbours > 3 ? false : true;
        } else {
            this.newAlive = aliveNeighbours === 3 ? true : false;
        }
    }
}

function getMillis() {
    return Date.now();
}

function initialiseGrid(ctx, initXSize, initYSize) {
    let newGameGrid = Array(initXSize);
    for (let x = 0; x < initXSize; x++) {
        newGameGrid[x] = Array(initYSize);
    }
    for (let x = 0; x < newGameGrid.length; x++) {
        for (let y = 0; y < newGameGrid[x].length; y++) {
            let alive = false; //Math.random() > 0.9;
            let lastChanged = getMillis();
            newGameGrid[x][y] = new Cell(ctx, x, y, alive, lastChanged);
        }
    }
    return newGameGrid;
}

function App() {
    const canvasRef = useRef(null);

    useEffect(() => {
        canvas = canvasRef.current;
        canvas.focus();
        const ctx = canvas.getContext("2d");
        gameGrid = initialiseGrid(ctx, 80, 80);

        const render = () => {
            //ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.fillStyle = "#e8e8e8";
            ctx.fill();

            for (let x = 0; x < gameGrid.length; x++) {
                for (let y = 0; y < gameGrid[x].length; y++) {
                    if (playing && mouseCounter < 1) {
                        gameGrid[x][y].checkNeighbours(gameGrid);
                    }
                }
            }
            for (let x = 0; x < gameGrid.length; x++) {
                for (let y = 0; y < gameGrid[x].length; y++) {
                    gameGrid[x][y].draw();
                }
            }

            if (TIMESTEP <= 10) {
                requestAnimationFrame(render);
            } else {
                setTimeout(() => {
                    render();
                }, TIMESTEP);
            }
        };
        render();
    }, []);

    function keyPress(event) {
        switch (event.keyCode) {
            case 8:
                for (let x = 0; x < gameGrid.length; x++) {
                    for (let y = 0; y < gameGrid[x].length; y++) {
                        gameGrid[x][y].alive = false;
                    }
                }
                break;
            case 32:
                playing = !playing;
                break;
        }
    }

    function getMousePos(event) {
        var totalOffsetX = 0;
        var totalOffsetY = 0;
        var canvasX = 0;
        var canvasY = 0;
        var currentElement = canvas;

        do {
            totalOffsetX +=
                currentElement.offsetLeft - currentElement.scrollLeft;
            totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
        } while ((currentElement = currentElement.offsetParent));

        canvasX = event.pageX - totalOffsetX;
        canvasY = event.pageY - totalOffsetY;

        return { x: canvasX, y: canvasY };
    }

    function drawCell(event, mouseCounter) {
        if (mouseCounter > 0 && (event.button === 0 || event.button === 2)) {
            let pos = getMousePos(event);
            let cellX = Math.floor(pos.x / CELL_SIZE);
            let cellY = Math.floor(pos.y / CELL_SIZE);
            //console.log(CANVAS_WIDTH, CANVAS_HEIGHT);
            try {
                if (getMillis() - gameGrid[cellX][cellY].lastChanged > 200) {
                    gameGrid[cellX][cellY].setAlive(mouseRightLeft);
                    gameGrid[cellX][cellY].lastChanged = getMillis();
                }
            } catch (e) {}
        }
    }

    function mouseDown(event) {
        mouseCounter++;
        mouseRightLeft = event.button === 0 ? true : false;
        drawCell(event, mouseCounter);
    }

    function mouseUp(e) {
        mouseCounter--;
    }

    function mouseMove(event) {
        drawCell(event, mouseCounter);
    }

    return (
        <canvas
            tabIndex={-1}
            id="canvas"
            onContextMenu={(e) => e.preventDefault()}
            onKeyDown={keyPress}
            onMouseDown={mouseDown}
            onMouseUp={mouseUp}
            onMouseMove={mouseMove}
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
        ></canvas>
    );
}

export default App;
