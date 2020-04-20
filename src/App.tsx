import React, { useState } from 'react';
import './App.css';
import { Position, ALIGNMENT, AI_DELAY } from './constants';
import Board from './boards/Board';
import { BoatData } from './Boat';
import { GAME_SATES } from './game-states/constants';
import AddingBoat from './game-states/AddingBoat';
import SetupGame from './game-states/SetupGame';
import GameEnd from './game-states/GameEnd';
import ShotBoard, { Shot } from './boards/ShotBoard';
import { isValidBoatPosition, generateRandom, shotOnTarget } from './helpers';

const getRandomName = () => `Annon_${Math.floor(Math.random()*100)}`;

function App() {
  const [gameState, setGameState] = useState(GAME_SATES.SETUP);
  const [selectedCell, setSelectedCell] = useState<Position | undefined>();
  const [alignment, setAlignment] = useState(ALIGNMENT.HORIZONTAL);
  const [size, setSize] = useState(3);
  const [boats, setBoats] = useState<BoatData[]>([]);
  const [username, serUsername] = useState<string>(getRandomName());
  const [shotHistory, setShotHistory] = useState<Shot[]>([]);
  const [foeShotHistory, setFoeShotHistory] = useState<Shot[]>([]);
  const [playerTurn, setPlayerTurn] = useState<boolean>(true);

  const addBoat = (boat: BoatData) => {
    if (isValidBoatPosition(boats)(boat) && gameState === GAME_SATES.ADDING_BOAT) {
      setBoats([...boats, boat]);
    }
  }

  const onShot = (position: Position) => {
    if (gameState !== GAME_SATES.GAME_STARTED || !playerTurn) {
      return;
    }

    setShotHistory([
      ...shotHistory, {
        position,
        data: 'x',
      }
    ]);

    if (shotHistory.length >= 3) {
      setTimeout(() => setGameState(GAME_SATES.END), AI_DELAY);
      return;
    }

    setPlayerTurn(false);
    setTimeout(() => randomAIPlay(), AI_DELAY);
  }

  const randomAIPlay = () => {
    const generatePlay = () => new Position(generateRandom(), generateRandom());
    const wasPlayed = (history: Shot[], position: Position) =>
      history.find(s => s.position.equals(position));

    let currentPlay = generatePlay();
    while (wasPlayed(foeShotHistory, currentPlay)) {
      currentPlay = generatePlay();
    }

    setFoeShotHistory([
      ...foeShotHistory, {
        position: currentPlay,
        data: shotOnTarget(boats)(currentPlay) ? 'o' : 'x',
      }
    ]);
    setPlayerTurn(true);
  }

  const onRestart = () => {
    setBoats([]);
    setFoeShotHistory([]);
    setPlayerTurn(true);
    setShotHistory([]);
    setGameState(GAME_SATES.SETUP)
  }

  return (
    <div className="game">
      <div className="boards">
        <Board
          boats={boats}
          history={foeShotHistory}
          onEnterCell={position => setSelectedCell(position)}
          onLeaveCell={() => setSelectedCell(undefined)}
          onClick={() => selectedCell && addBoat({ position: selectedCell, alignment, size })}
          newBoat={gameState === GAME_SATES.ADDING_BOAT && selectedCell
            ? { position: selectedCell, alignment, size }
            : undefined
          }
        />
        {gameState === GAME_SATES.ADDING_BOAT &&
          <AddingBoat
            alignment={alignment}
            setAlignment={setAlignment}
            size={size}
            setSize={setSize}
            onDone={() => setGameState(GAME_SATES.SETUP)}
          />
        }
        {(gameState === GAME_SATES.END || gameState === GAME_SATES.GAME_STARTED) &&
          <ShotBoard
            username={username}
            playerTurn={playerTurn}
            history={shotHistory}
            onShot={onShot}
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
      </div>
      {gameState === GAME_SATES.END &&
        <GameEnd onRestart={onRestart}/>
      }
    </div>
  );
}

export default App;
