import { Position, BOARD_SIZE, ALIGNMENT } from './constants';
import { BoatData } from './Boat';

export const generateRandom = (max:number = BOARD_SIZE): number =>
  Math.floor(Math.random() * max);

export const getBoatPositionArray = (boat: BoatData): Position[] => {
  if (boat.alignment === ALIGNMENT.HORIZONTAL) {
    return [...Array(boat.size).keys()].map(index =>
      new Position(boat.position.x + index, boat.position.y)
    );
  }

  return [...Array(boat.size).keys()].map(index =>
    new Position(boat.position.x, boat.position.y + index)
  );
}

const boatCollides = (boat1: BoatData, boat2: BoatData): boolean => {
  const boat1Positions = getBoatPositionArray(boat1);
  const boat2Positions = getBoatPositionArray(boat2);

  for (const position1 of boat1Positions) {
    for (const position2 of boat2Positions) {
      if (position1.equals(position2)) {
        return true;
      }
    }
  }
  return false;
}

export const shotOnTarget = (boats: BoatData[]) => (position: Position): boolean => {
  return getTargetShot(boats)(position) !== undefined;
}

export const getTargetShot = (boats: BoatData[]) => (position: Position): BoatData | undefined => {
  for (const boat of boats) {
    const boatPositions = getBoatPositionArray(boat);
    for (const currentPosition of boatPositions) {
      if (currentPosition.equals(position)) {
        return boat;
      }
    }
  }
}

export const isValidBoatPosition = (boats: BoatData[]) => (newBoat: BoatData): boolean => {
  // right bound
  if (newBoat.alignment === ALIGNMENT.HORIZONTAL
    && newBoat.position.x + newBoat.size > BOARD_SIZE) {
    return false;
  }

  // lower bound
  if (newBoat.alignment === ALIGNMENT.VERTICAL
    && newBoat.position.y + newBoat.size > BOARD_SIZE) {
    return false;
  }

  // boat colition
  for (const currentBoat of boats) {
    if (boatCollides(currentBoat, newBoat)) {
      return false;
    }
  }

  return true;
}

export const positionInArray = (position: Position, array: Position[]): boolean => {
  for (const currentPosition of array) {
    if (currentPosition.equals(position)) {
      return true;
    }
  }
  return false;
}