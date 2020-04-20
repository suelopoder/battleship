import React from 'react';
import { CELL_SIZE, Position } from './constants';

export type CellProps = {
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

export default Cell;
