import React, { useState } from 'react';
import './App.css';

const BOARD_SIZE = 10;
const CELL_SPACE = 2;
const CELL_SIZE = 16 + CELL_SPACE * 2;
const AXIS_ARRAY = [...Array(BOARD_SIZE).keys()];
const BOARD_ARRAY = [...Array(BOARD_SIZE).keys()].map(() => AXIS_ARRAY);

const ALIGNMENT = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical',
}

// const boat1 = { position: { x: 1, y: 1 }, length: 3, align: ALIGNMENT.HORIZONTAL };
// const boat2 = { position: { x: 4, y: 5 }, length: 4, align: ALIGNMENT.VERTICAL };
// const boats = [boat1, boat2];

interface Position {
  x: number;
  y: number;
}

type CellProps = {
  data: Position,
  onEnter: () => void,
  onLeave?: () => void,
  onClick?: () => void,
}

const Cell = ({ data, onEnter, onLeave, onClick }: CellProps) => (
  <div
    className="cell"
    style={{
      left: data.x * CELL_SIZE,
      top: data.y * CELL_SIZE,
    }}
    onMouseEnter={onEnter}
    onMouseLeave={onLeave}
    onClick={onClick}
  />
);

interface BoatData {
  position: Position,
  size: number,
  alignment: string, // FIXME use ALIGNMENT
  color?: string,
};

const Boat = (boat: BoatData) => {
  let height = boat.alignment === ALIGNMENT.HORIZONTAL ? boat.size * CELL_SIZE: CELL_SIZE;
  let width = boat.alignment === ALIGNMENT.VERTICAL ? boat.size * CELL_SIZE: CELL_SIZE;
  height -= CELL_SPACE;
  width -= CELL_SPACE;

  return (
    <div
      className="boat"
      style={{
        left: boat.position.x * CELL_SIZE,
        top: boat.position.y * CELL_SIZE,
        height,
        width,
        backgroundColor: boat.color || 'green',
      }}
    />
  );
}

const GAME_SATES = {
  SETUP: 'setup',
  ADDING_BOAT: 'adding_boat',
}

function App() {
  const [gameState, setGameState] = useState(GAME_SATES.ADDING_BOAT);
  const [alignment, setAlignment] = useState(ALIGNMENT.HORIZONTAL);
  const [size, setSize] = useState(3);
  const [selectedCell, setSelectedCell] = useState<Position | null>(null);
  const [boats, setBoats] = useState<BoatData[]>([]);

  const addBoat = (boat: BoatData) => setBoats([...boats, boat]);

  return (
    <>
      <div
        className="board"
        style={{
          height: CELL_SIZE * BOARD_SIZE,
          width: CELL_SIZE * BOARD_SIZE,
        }}
      >
        {BOARD_ARRAY.map((col, x) =>
          col.map((y) =>
            <Cell
              key={`${x}_${y}`}
              data={{ x, y }}
              onEnter={() => setSelectedCell({ x, y })}
              onLeave={() => setSelectedCell(null)}
              onClick={() => selectedCell && addBoat({ position: selectedCell, alignment, size })}
            />
          )
        )}
        {boats.map(boat => <Boat key={`${boat.position.x}_${boat.position.y}`} {...boat} />)}
        {gameState === GAME_SATES.ADDING_BOAT && selectedCell &&
          <Boat
            position={selectedCell as Position}
            alignment={alignment}
            size={size}
            color="red"
          />
        }
      </div>
      {gameState === GAME_SATES.SETUP &&
        <button onClick={() => setGameState(GAME_SATES.ADDING_BOAT)}>Add boat</button>
      }
      {gameState === GAME_SATES.ADDING_BOAT &&
        <>
          <label htmlFor="alignment_horizontal">Horizontal</label>
          <input type="radio" name="alignment_horizontal" checked={alignment === ALIGNMENT.HORIZONTAL} onChange={() => setAlignment(ALIGNMENT.HORIZONTAL)} />
          <label htmlFor="alignment_vertical">Vertical</label>
          <input type="radio" name="alignment_vertical" checked={alignment === ALIGNMENT.VERTICAL} onChange={() => setAlignment(ALIGNMENT.VERTICAL)} />
          <label htmlFor="size">Size</label>
          <input type="number" name="size" value={size} onChange={ev => setSize(Number(ev.target.value))} />
        </>
      }
    </>
  );
}

export default App;
