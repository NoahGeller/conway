import React from 'react';

import Board from './Board';

function App() {
    return (
        <Board
            width={50}
            height={40}
            cellSize={20}
            />
    );
}

export default App;
