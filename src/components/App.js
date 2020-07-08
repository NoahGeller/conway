import React, { useState, useEffect, useCallback } from 'react';

import Board from './Board';

function App() {
    const [cellSize, setCellSize] = useState(20);
    const [width, setWidth] = useState(40);
    const [height, setHeight] = useState(40);
    const [running, setRunning] = useState(false);

    const zoomHandler = useCallback((e) => {
        if (!running) {
            if (e.key === '-') {
                setCellSize(cellSize - 1);
            } else if (e.key === '+') {
                setCellSize(cellSize + 1);
            }
        }
    }, [cellSize, running]);

    useEffect(() => {
        window.addEventListener('keypress', zoomHandler);
        return () => {
            window.removeEventListener('keypress', zoomHandler)
        }
    }, [zoomHandler])

    useEffect(() => {
        setHeight(Math.floor(window.innerHeight * 0.7 / cellSize));
        setWidth(Math.floor(window.innerWidth * 0.9 / cellSize));
    }, [cellSize]);

    return (
        <Board
            width={width}
            height={height}
            cellSize={cellSize}
            running={running}
            setRunning={setRunning}
            />
    );
}

export default App;
