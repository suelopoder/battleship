import React from 'react';
import { CELL_SIZE, Position } from './constants';

export type CellProps = {
  data: Position,
  onEnter: () => void,
  onLeave?: () => void,
  onClick?: () => void,
  children?: any,
}

const Cell = ({ data, onEnter, onLeave, onClick, children }: CellProps) => (
  <div
    className="cell"
    style={{
      left: data.x * CELL_SIZE,
      top: data.y * CELL_SIZE,
      textAlign: 'center',
      lineHeight: '15px',
    }}
    onMouseEnter={onEnter}
    onMouseLeave={onLeave}
    onClick={onClick}
  >
    {children}
  </div>
);

export default Cell;
