import React from 'react';

type GameEndProps = {
  onRestart: () => void,
};

const GameEnd = (props: GameEndProps) => (
  <div>
    <h1>Thanks for playing!</h1>
    <input type="submit" value="Play again" onClick={() => props.onRestart()} />
  </div>
);

export default GameEnd;
