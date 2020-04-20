import React from 'react';

type SetupGameProps = {
  onAddBoat: () => void,
  onStart: () => void,
  username: string,
  serUsername: (username: string) => void,
}

const SetupGame = ({ onAddBoat, onStart, username, serUsername }: SetupGameProps) => (
  <form>
    <div>
      <label htmlFor="username">Username</label>
      <input name="username" type="text" value={username} onChange={ev => serUsername(ev.target.value)} />
    </div>
    <button onClick={onAddBoat}>Add boats</button>
    <button onClick={onAddBoat}>Random game!</button>
    <button onClick={onStart}>Start!</button>
  </form>
)

export default SetupGame;
