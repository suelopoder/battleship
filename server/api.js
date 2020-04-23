const express = require('express');
const apiRouter = express.Router();
const { validateBoatSet, newId } = require('./helpers');

const games = {};

const runBasicGameValidations = (req, res) => {
  const username = req.body.username;
  if (!username) {
    res.send({
      status: 'error',
      error: 'No username supplied',
    });
    return false;
  }

  const userBoats = req.body.boats;
  const result = validateBoatSet(userBoats);
  if (result !== null) {
    res.send({
      status: 'error',
      error: result,
    });
    return false;
  }

  return true;
}

apiRouter.get('/games', function (req, res) {
  res.send(games);
});

apiRouter.get('/game/:gameId', function (req, res) {
  const gameId = req.params.gameId;
  res.send(games[gameId]);
});

apiRouter.post('/start-game', function (req, res) {
  if (!runBasicGameValidations(req, res)) {
    return;
  }

  const userBoats = req.body.boats;
  const username = req.body.username;
  const newGame = {
    id: newId(),
    status: 'waiting',
    userA: username,
    boatsA: userBoats,
  };

  games[newGame.id] = newGame;

  console.log('games', games);
  return res.send({
    status: 'waiting',
    gameId: newGame.id,
  });
});

apiRouter.post('/join/:gameId', function (req, res) {
  if (!runBasicGameValidations(req, res)) {
    return;
  }

  const gameId = req.params.gameId;
  console.log('searching for', gameId, 'in', games)
  const game = games[gameId];
  if (!game) {
    return res.send({
      status: 'error',
      error: `Invalid game id ${gameId}`,
    });
  }
  if (game.status !== 'waiting') {
    return res.send({
      status: 'error',
      error: `Invalid game status for game id ${gameId}`,
    });
  }

  game.userB = req.body.username;
  game.boatsB = req.body.boats;
  game.status = 'ongoing';
  game.turn = 'player A';

  console.log('games', games);

  return res.send({
    status: 'ok',
    foeName: game.userA,
    gameId: game.id,
  });
});

module.exports = apiRouter;
