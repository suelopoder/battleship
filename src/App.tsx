import React, { useState } from 'react';
import './App.css';
import { Position, ALIGNMENT } from './constants';
import Board from './Board';
import { BoatData } from './Boat';
import { GAME_SATES } from './game-states/constants';
import AddingBoat from './game-states/AddingBoat';
import { isValidBoatPosition } from './helpers';

function App() {
  const [gameState, setGameState] = useState(GAME_SATES.ADDING_BOAT);
  const [selectedCell, setSelectedCell] = useState<Position | undefined>();
  const [alignment, setAlignment] = useState(ALIGNMENT.HORIZONTAL);
  const [size, setSize] = useState(3);
  const [boats, setBoats] = useState<BoatData[]>([]);

  const addBoat = (boat: BoatData) => {
    if (isValidBoatPosition(boats)(boat)) {
      setBoats([...boats, boat]);
    }
  }

  return (
    <div className="game">
      <Board
        boats={boats}
        onEnterCell={position => setSelectedCell(position)}
        onLeaveCell={() => setSelectedCell(undefined)}
        onClick={() => selectedCell && addBoat({ position: selectedCell, alignment, size })}
      />
      {gameState === GAME_SATES.ADDING_BOAT &&
        <AddingBoat
          selectedCell={selectedCell}
          alignment={alignment}
          setAlignment={setAlignment}
          size={size}
          setSize={setSize}
          isValidBoat={isValidBoatPosition(boats)}
        />
      }
      {gameState === GAME_SATES.SETUP &&
        <button onClick={() => setGameState(GAME_SATES.ADDING_BOAT)}>Add boat</button>
      }
    </div>
  );
}

export default App;
