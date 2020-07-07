import React, { useState, useEffect, useRef } from 'react';

import ControlPanel from './ControlPanel';

import '../styles/Board.css';

function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

function Board(props) {

    const makeEmptyBoard = () => {
        let board = []
        for (let x = 0; x < props.width; x++) {
            board.push([]);
            for (let y = 0; y < props.height; y++) {
                board[x].push(false);
            }
        }
        return board;
    }

    const [dots, setDots] = useState(makeEmptyBoard());
    const [lastDots, setLastDots] = useState();
    const [overlay, setOverlay] = useState();
    const [running, setRunning] = useState(false);
    const [delay, setDelay] = useState(100);
    const [generations, setGenerations] = useState(0);
    const [density, setDensity] = useState(0.6);
    const [gridlines, setGridlines] = useState(false);

    useEffect(() => {
        setOverlay(() => {
            let divs = [];
            for (let x = 0; x < props.width; x++) {
                for (let y = 0; y < props.height; y++) {
                    if (dots[x][y]) {
                        divs.push(
                            <div
                                className='dot'
                                style={gridlines ? {
                                    width: props.cellSize - 1,
                                    height: props.cellSize - 1,
                                    top: props.cellSize * y + 1,
                                    left: props.cellSize * x + 1
                                } :
                                {
                                    width: props.cellSize,
                                    height: props.cellSize,
                                    top: props.cellSize * y,
                                    left: props.cellSize * x
                                }}
                                key={[x, y]} />
                        )
                    }
                }
            }
            return divs;
        });
    }, [dots, props.cellSize, props.height, props.width, gridlines]);


    // 
    const toggleDot = (x, y) => {
        let newDots = dots.slice();
        if (dots[x][y]) {
            newDots[x][y] = false;
        } else {
            newDots[x][y] = true;
        }
        setDots(newDots);
    }

    const numLiveNeighbors = (x, y) => {
        let num = 0;
        for (let a = -1; a < 2; a++) {
            for (let b = -1; b < 2; b++) {
                if (a === 0 && b === 0) continue;
                else if (x + a < 0 || x + a >= props.width ||
                         y + b < 0 || y + b >= props.height) continue;
                else if (dots[x+a][y+b]) num++;
            }
        }
        return num;
    }

    const step = () => {
        let newDots = dots.map(row => row.slice());
        let dead = lastDots ? true : false;
        for (let x = 0; x < props.width; x++) {
            for (let y = 0; y < props.height; y++) {
                if (dead && lastDots[x][y] !== dots[x][y]) dead = false;
                let neighbors = numLiveNeighbors(x, y);
                if (dots[x][y]) {
                    if (neighbors < 2 || neighbors > 3) {
                        newDots[x][y] = false;
                    }
                } else {
                    if (neighbors === 3) {
                        newDots[x][y] = true;
                    }
                }
            }
        }

        if (dead) {
            setRunning(false);    
        } else {
            setLastDots(dots);
            setDots(newDots);
            setGenerations(generations + 1);
        }
    }

    useInterval(() => step(), running ? delay : null);

    const handleClick = (e) => {
        let x = Math.floor(e.nativeEvent.offsetX / props.cellSize);
        let y = Math.floor(e.nativeEvent.offsetY / props.cellSize);
        toggleDot(x, y); 
    }

    const reset = () => {
        setRunning(false);
        setDots(makeEmptyBoard());
        setGenerations(0);
    }

    const start = () => {
        setRunning(true);
    }

    const stop = () => {
        setRunning(false);
    }

    const randomize = () => {
        setRunning(false);
        let newDots = makeEmptyBoard();
        for (let x = 0; x < props.width; x++) {
            for (let y = 0; y < props.height; y++) {
                let rand = Math.random();
                if (rand >= density) {
                    newDots[x][y] = true;
                }
            }
        }
        setDots(newDots);
        setGenerations(0);
        if (running) setRunning(true);
    }

    return (
        <div>
            <div
                className='board'
                style={gridlines ? {
                    width: (props.width * props.cellSize) + 1,
                    height: (props.height * props.cellSize) + 1,
                    backgroundSize: `${props.cellSize}px ${props.cellSize}px`,
                } : {
                    width: (props.width * props.cellSize) + 1,
                    height: (props.height * props.cellSize) + 1,
                    backgroundSize: `${props.cellSize}px ${props.cellSize}px`,
                    backgroundImage: 'none'
                }}
                onClick={(e) => handleClick(e)}
                >
                {overlay}
            </div>
            <div className='generations'>
                Number of generations: {generations}.
            </div>
            <ControlPanel
                running={running}
                delay={delay}
                density={density}
                reset={reset}
                start={start}
                stop={stop}
                randomize={randomize}
                updateDelay={setDelay}
                updateDensity={setDensity}
                />
        </div>
    );
}

export default Board;
