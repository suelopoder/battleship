import React, { useState } from 'react';
import './App.css';
import { Position, ALIGNMENT, HIT_RESULT, API_GAME_STATUS } from './constants';
import Board from './boards/Board';
import { BoatData } from './Boat';
import { GAME_SATES } from './game-states/constants';
import AddingBoats from './game-states/AddingBoats';
import SetupGame from './game-states/SetupGame';
import GameEnd from './game-states/GameEnd';
import ShotBoard, { Shot } from './boards/ShotBoard';
import { isValidBoatPosition, shotOnTarget, generateRandomBoatSet } from './helpers';
import API from './API';

const getRandomName = () => `Annon_${Math.floor(Math.random()*100)}`;

type AppPros = {
  gameId: string | null
};

function App(props: AppPros) {
  const [gameState, setGameState] = useState(GAME_SATES.SETUP);
  const [selectedCell, setSelectedCell] = useState<Position | undefined>();
  const [alignment, setAlignment] = useState(ALIGNMENT.HORIZONTAL);
  const [size, setSize] = useState(3);
  const [boats, setBoats] = useState<BoatData[]>([]);
  const [username, serUsername] = useState<string>(getRandomName());
  const [shotHistory, setShotHistory] = useState<Shot[]>([]);
  const [foeShotHistory, setFoeShotHistory] = useState<Shot[]>([]);
  const [playerTurn, setPlayerTurn] = useState<boolean>(true);
  const [foeName, setFoeName] = useState<string>('');
  const [error, setError] = useState<string | undefined>();
  const [gameId, setGameId] = useState<string>();

  const addBoat = (boat: BoatData) => {
    if (isValidBoatPosition(boats)(boat) && gameState === GAME_SATES.ADDING_BOAT) {
      setBoats([...boats, boat]);
    }
  }

  const onShot = async (position: Position) => {
    if (gameState !== GAME_SATES.GAME_STARTED || !playerTurn) {
      return;
    }

    const playResult = await API.userPlay(position);

    setShotHistory([
      ...shotHistory, {
        position,
        data: playResult.hitResult === HIT_RESULT.WATER ? 'x' : 'o',
      }
    ]);

    if (playResult.gameStatus !== API_GAME_STATUS.ONGOING) {
      setGameState(GAME_SATES.END);
      return;
    }

    setPlayerTurn(false);
    waitForFoePlay();
  }

  const waitForFoePlay = async () => {
    const foePlay = await API.getFoePlay();

    if (foePlay.gameStatus !== API_GAME_STATUS.ONGOING) {
      setGameState(GAME_SATES.END);
      return;
    }

    setFoeShotHistory([
      ...foeShotHistory, {
        position: foePlay.playedPosition,
        data: shotOnTarget(boats)(foePlay.playedPosition) ? 'o' : 'x',
      }
    ]);
    setPlayerTurn(true);
  }

  const onStart = async () => {
    const response = !props.gameId
      ? await API.startGame(username, boats)
      : await API.joinGame(props.gameId, username, boats);

    if (response.status === 'error') {
      setError(response.error);
      return;
    }

    if (response.status === 'waiting') {
      setGameId(response.gameId);
      setError(`Share this url with a friend to play: http://localhost:3000/join?gameId=${response.gameId}`);
      return;
    }

    setFoeName(response.foeName);
    setGameState(GAME_SATES.GAME_STARTED);
  }

  const onRestart = () => {
    setError(undefined);
    setBoats([]);
    setFoeShotHistory([]);
    setPlayerTurn(true);
    setShotHistory([]);
    setGameState(GAME_SATES.SETUP);
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
          <AddingBoats
            alignment={alignment}
            setAlignment={setAlignment}
            size={size}
            setSize={setSize}
            onDone={() => setGameState(GAME_SATES.SETUP)}
          />
        }
        {foeName && (gameState === GAME_SATES.END || gameState === GAME_SATES.GAME_STARTED) &&
          <ShotBoard
            username={username}
            foeName={foeName}
            playerTurn={playerTurn}
            history={shotHistory}
            onShot={onShot}
          />
        }
        {gameState === GAME_SATES.SETUP &&
          <SetupGame
            onAddBoat={() => {
              setError(undefined);
              setGameState(GAME_SATES.ADDING_BOAT);
            }}
            onRandomGame={() => { setBoats(generateRandomBoatSet()); }}
            onStart={onStart}
            username={username}
            serUsername={serUsername}
            error={error}
            startLabel={props.gameId ? 'Join!' : 'Start'}
          />
        }
      </div>
      {gameState === GAME_SATES.END &&
        <GameEnd onRestart={onRestart} userWon={playerTurn} />
      }
    </div>
  );
}

export default App;
