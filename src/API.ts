import { Position, HIT_RESULT, API_GAME_STATUS } from './constants';
import { BoatData } from './Boat';
import { getBoatPositionArray, getTargetShot, positionInArray, getRandomPosition, generateRandomBoatSet } from './helpers';

let foeBoats: BoatData[] = [];
const userHits: Position[] = [];
const sankFoeBoats: BoatData[] = [];
const foePlays: Position[] = [];

const validateBoatSet = (boats: BoatData[]): string | null => {
  if (boats.length !== 10) {
    return 'You must have exactly 10 boats';
  }

  return null;
}

type PlayResult = {
  playedPosition: Position,
  hitResult: string,
  gameStatus: string,
  sankFoeBoats: BoatData[],
  foeBoats?: BoatData[],
}

type StartGameResponse =
  { status: 'ok', foeName: string } |
  { status: 'error', error: string }
;

const startGame = async (userBoats: BoatData[]) : Promise<StartGameResponse> => {
  const result = validateBoatSet(userBoats);
  if (result !== null) {
    return {
      status: 'error',
      error: result,
    };
  }

  foeBoats = generateRandomBoatSet();

  return {
    status: 'ok',
    foeName: 'AI',
  };
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
      playedPosition: position,
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
    playedPosition: position,
  };
};

const wasPlayed = (history: Position[], position: Position) =>
  history.find(s => s.equals(position));

const getFoePlay = async (): Promise<PlayResult> => {
  let currentPlay = getRandomPosition();
  while (wasPlayed(foePlays, currentPlay)) {
    currentPlay = getRandomPosition();
  }

  foePlays.push(currentPlay);

  return {
    playedPosition: currentPlay,
    gameStatus: API_GAME_STATUS.ONGOING,
    sankFoeBoats,
    hitResult: HIT_RESULT.SANK,
  }
}

export default {
  startGame,
  userPlay,
  getFoePlay,
};
