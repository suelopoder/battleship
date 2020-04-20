import React from 'react';
import Cell from '../Cell';
import Boat, { BoatData } from '../Boat';
import { Position } from '../constants';
import { BOARD_ARRAY, PIXEL_SIZE } from './constants';

export type BoardProps = {
  boats: BoatData[],
  onEnterCell?: (position: Position) => void,
  onLeaveCell?: () => void,
  onClick?: (position: Position) => void,
}

const Board = (props: BoardProps) => {
  const { onEnterCell, onLeaveCell, onClick } = props;
  return (
    <div>
      <h2>Main board</h2>
      <div style={{ height: PIXEL_SIZE, width: PIXEL_SIZE, position: 'relative' }}>
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
    </div>
  )
};

export default Board;
