import React from 'react';

type GameEndProps = {
  onRestart: () => void,
  userWon: boolean,
};

const GameEnd = ({ onRestart, userWon }: GameEndProps) => (
  <div>
    <h1>{userWon ? '🏆 You win!' : '💩 You lose'}</h1>
    <h2>Thanks for playing!</h2>
    <input type="submit" value="Play again" onClick={() => onRestart()} />
  </div>
);

export default GameEnd;
