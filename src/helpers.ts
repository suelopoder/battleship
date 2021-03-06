import { Position, BOARD_SIZE, ALIGNMENT } from './constants';
import { BoatData } from './Boat';

export const generateRandom = (max:number = BOARD_SIZE): number =>
  Math.floor(Math.random() * max);

export const getRandomPosition = () =>
  new Position(generateRandom(), generateRandom());

// === all players must have: ===
// 1 boat size 5
// 2 boats size 4
// 3 boats size 3
// 4 boats size 2
// Total 10 boats
const SIZE_AMOUNTS = [ // size, amoutn of boats
  [1, 5],
  [2, 4],
  [3, 3],
  [4, 2],
];

const getRandomAlignment = () =>
  Math.random() > 0.5 ? ALIGNMENT.HORIZONTAL : ALIGNMENT.VERTICAL;

export const generateRandomBoatSet = (): BoatData[] => {
  const boatSet: BoatData[] = [];

  for (const sizeAmount of SIZE_AMOUNTS) {
    const isValid = isValidBoatPosition(boatSet);
    const [amount, size] = sizeAmount;
    for (let i = 0; i < amount; i++) {
      let nextPlay: BoatData;
      do {
        nextPlay = {
          size,
          position: getRandomPosition(),
          alignment: getRandomAlignment(),
        };
      } while (!isValid(nextPlay));

      boatSet.push(nextPlay);
    }
  }

  return boatSet;
}

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

export const sleep = async (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

const GAME_ID_QUERY_NAME = 'gameId';
const objFromQueryString = (): Record<string, string> =>
  window.location.search.replace('?', '').split('&').reduce((obj, pair) => {
    const [key, value] = pair.split('=');
    return {
      ...obj,
      [key]: value,
    }
  }, {});
export const getGameId = (): string => objFromQueryString()[GAME_ID_QUERY_NAME];
