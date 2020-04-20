import { Position, HIT_RESULT, API_GAME_STATUS, ALIGNMENT } from './constants';
import { BoatData } from './Boat';
import { getBoatPositionArray, getTargetShot, positionInArray } from './helpers';

const foeBoats: BoatData[] = [];
const userHits: Position[] = [];
const sankFoeBoats: BoatData[] = [];

type PlayResult = {
  hitResult: string,
  gameStatus: string,
  sankFoeBoats: BoatData[],
  foeBoats?: BoatData[],
}

const startGame = async (userBoats: BoatData[]) => {
  foeBoats.push({ position: new Position(2, 2), alignment: ALIGNMENT.VERTICAL, size: 5 });
  return 'ok';
};

const isBoatDown = (boat: BoatData): boolean => {
  const boatPositions = getBoatPositionArray(boat);
  for (const position of boatPositions) {
    if (!positionInArray(position, userHits)) {
      return false;
    }
  }

  return true;
}

const userPlay = async (position: Position): Promise<PlayResult> => {
  const hitBoat = getTargetShot(foeBoats)(position);
  if (!hitBoat) {
    return {
      hitResult: HIT_RESULT.WATER,
      gameStatus: API_GAME_STATUS.ONGOING,
      sankFoeBoats,
    };
  }

  userHits.push(position);
  if (isBoatDown(hitBoat as BoatData)) {
    sankFoeBoats.push(hitBoat as BoatData);
  }

  return {
    hitResult: isBoatDown(hitBoat as BoatData) ? HIT_RESULT.SANK : HIT_RESULT.HIT,
    gameStatus: foeBoats.length === sankFoeBoats.length ? API_GAME_STATUS.USER_WON : API_GAME_STATUS.ONGOING,
    sankFoeBoats,
  };
};

export default {
  startGame,
  userPlay,
};