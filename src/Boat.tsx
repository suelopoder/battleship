import React from 'react';
import { CELL_SPACE, CELL_SIZE, Position, ALIGNMENT } from './constants';

export interface BoatData {
  position: Position,
  size: number,
  alignment: ALIGNMENT,
  color?: string, // FIXME smell for bad design
};

const Boat = (boat: BoatData) => {
  let height = boat.alignment === ALIGNMENT.VERTICAL ? boat.size * CELL_SIZE: CELL_SIZE;
  let width = boat.alignment === ALIGNMENT.HORIZONTAL ? boat.size * CELL_SIZE: CELL_SIZE;
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

export default Boat;
