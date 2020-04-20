import React from 'react';
import Cell from './Cell';
import Boat, { BoatData } from './Boat';
import { CELL_SIZE, BOARD_SIZE, Position } from './constants';

const AXIS_ARRAY = [...Array(BOARD_SIZE).keys()];
const BOARD_ARRAY = [...Array(BOARD_SIZE).keys()].map(() => AXIS_ARRAY);
const PIXEL_SIZE = CELL_SIZE * BOARD_SIZE;

export type BoardProps = {
  boats: BoatData[],
  onEnterCell?: (position: Position) => void,
  onLeaveCell?: () => void,
  onClick?: (position: Position) => void,
}

const Board = (props: BoardProps) => {
  const { onEnterCell, onLeaveCell, onClick } = props;
  return (
    <div style={{ height: PIXEL_SIZE, width: PIXEL_SIZE }}>
      {BOARD_ARRAY.map((col, x) =>
        col.map((y) => {
          const currentPosition = new Position(x, y);
          return (
            <Cell
              key={`${x}_${y}`}
              data={currentPosition}
              onEnter={() => onEnterCell && onEnterCell(currentPosition)}
              onLeave={onLeaveCell}
              onClick={() => onClick && onClick(currentPosition)}
            />
          );
        })
      )}
      {props.boats.map(boat =>
        <Boat key={`${boat.position.x}_${boat.position.y}`} {...boat} />)
      }
    </div>
  )
};

export default Board;
