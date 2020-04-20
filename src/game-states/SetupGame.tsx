import React from 'react';

type SetupGameProps = {
  onAddBoat: () => void,
  onStart: () => void,
  username: string,
  serUsername: (username: string) => void,
}

const SetupGame = ({ onAddBoat, onStart, username, serUsername }: SetupGameProps) => (
  <>
    <label htmlFor="username">Username</label>
    <input name="username" type="text" value={username} onChange={ev => serUsername(ev.target.value)} />
    <button onClick={onAddBoat}>Add boat</button>
    <button onClick={onStart}>Start!</button>
  </>
)

export default SetupGame;
