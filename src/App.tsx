import React, { useState } from 'react';
import './App.css';
import { Position, ALIGNMENT } from './constants';
import Board from './boards/Board';
import { BoatData } from './Boat';
import { GAME_SATES } from './game-states/constants';
import AddingBoat from './game-states/AddingBoat';
import SetupGame from './game-states/SetupGame';
import ShotBoard, { Shot } from './boards/ShotBoard';
import { isValidBoatPosition } from './helpers';

function App() {
  const [gameState, setGameState] = useState(GAME_SATES.GAME_STARTED);
  const [selectedCell, setSelectedCell] = useState<Position | undefined>();
  const [alignment, setAlignment] = useState(ALIGNMENT.HORIZONTAL);
  const [size, setSize] = useState(3);
  const [boats, setBoats] = useState<BoatData[]>([{
    position: new Position(3, 5),
    alignment: ALIGNMENT.HORIZONTAL,
    size: 5,
  }]);
  const [username, serUsername] = useState<string>('annon');
  const [shotHistory, setShotHistory] = useState<Shot[]>([]);

  const addBoat = (boat: BoatData) => {
    if (isValidBoatPosition(boats)(boat) && gameState === GAME_SATES.ADDING_BOAT) {
      setBoats([...boats, boat]);
    }
  }

  const onShot = (position: Position) => {
    if (gameState !== GAME_SATES.GAME_STARTED) {
      return;
    }

    setShotHistory([
      ...shotHistory, {
        position,
        data: 'x',
      }
    ]);
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
          onDone={() => setGameState(GAME_SATES.SETUP)}
        />
      }
      {gameState === GAME_SATES.SETUP &&
        <SetupGame
          onAddBoat={() => setGameState(GAME_SATES.ADDING_BOAT)}
          onStart={() => setGameState(GAME_SATES.GAME_STARTED)}
          username={username}
          serUsername={serUsername}
        />
      }
      {gameState === GAME_SATES.GAME_STARTED &&
        <ShotBoard
          history={shotHistory}
          onShot={onShot}
        />
      }
    </div>
  );
}

export default App;
