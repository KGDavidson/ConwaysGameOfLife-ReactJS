import './App.css';
import React from 'react';

let gameGrid;

function initialiseGridStructure(initX, initY) {
    gameGrid = Array(initX);
    for (let i = 0; i < initX; i++) {
        gameGrid[i] = Array(initY);
    }
}

function initialiseGridValues() {
    for (let i = 0; i < gameGrid.length; i++) {
        for (let j = 0; j < gameGrid[i].length; j++) {
            gameGrid[i][j] = Math.floor(Math.random() * 2);
        }
    }
}

function App() {
  return (
    <div>
    </div>
  );
}

initialiseGridStructure(20, 20);
initialiseGridValues();
console.log(gameGrid);
export default App;
