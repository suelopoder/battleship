import React from 'react';
import Cell from '../Cell';
import { Position } from '../constants';
import { BOARD_ARRAY, PIXEL_SIZE } from './constants';

export type Shot = {
  position: Position,
  data?: string,
}

type ShotBoardProps = {
  history: Shot[],
  onShot: (position: Position) => void,
  playerTurn: boolean,
}

const ShotBoard = (props: ShotBoardProps) => {
  const { history, onShot, playerTurn } = props;
  return (
    <div className="shot-board">
      <h2>{playerTurn ? 'Shot here!' : 'Waiting on AI...'}</h2>
      <div style={{ height: PIXEL_SIZE, width: PIXEL_SIZE, position: 'relative' }}>
        {BOARD_ARRAY.map((col, x) =>
          col.map((y) => {
            const currentPosition = new Position(x, y);
            return (
              <Cell
                key={`${x}_${y}`}
                data={currentPosition}
                onEnter={() => {}}
                onClick={() => onShot(currentPosition)}
                children={history.find(s => s.position.equals(currentPosition))?.data}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

export default ShotBoard;