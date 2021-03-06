import { Position, HIT_RESULT, API_GAME_STATUS } from './constants';
import { BoatData } from './Boat';
import { getBoatPositionArray, getTargetShot, positionInArray, getRandomPosition } from './helpers';

let foeBoats: BoatData[] = [];
const userHits: Position[] = [];
const sankFoeBoats: BoatData[] = [];
const foePlays: Position[] = [];

type PlayResult = {
  playedPosition: Position,
  hitResult: string,
  gameStatus: string,
  sankFoeBoats: BoatData[],
  foeBoats?: BoatData[],
}

type StartGameResponse =
  { status: 'ok', foeName: string, gameId: string } |
  { status: 'error', error: string } |
  { status: 'waiting', gameId: string }
;

const startGame = async (username: string, userBoats: BoatData[]) : Promise<StartGameResponse> => {
  const body = {
    boats: userBoats,
    username: username,
  };
  const res = await fetch('/api/start-game', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: new Headers({ 'Content-Type': 'application/json' })
  });
  try {
    return await res.json();
  } catch (error) {
    return { status: 'error', error: error.message };
  }
};

const joinGame = async (gameId: string, username: string, userBoats: BoatData[]): Promise<StartGameResponse> => {
  const body = {
    boats: userBoats,
    username: username,
  };
  const res = await fetch(`/api/join/${gameId}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: new Headers({ 'Content-Type': 'application/json' })
  });
  try {
    return await res.json();
  } catch (error) {
    return { status: 'error', error: error.message };
  }
}

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
  joinGame,
  userPlay,
  getFoePlay,
};
