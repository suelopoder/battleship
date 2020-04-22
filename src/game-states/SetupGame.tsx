import React from 'react';

type SetupGameProps = {
  onAddBoat: () => void,
  onStart: () => void,
  username: string,
  serUsername: (username: string) => void,
  error?: string,
}

const SetupGame = ({ onAddBoat, onStart, username, serUsername, error }: SetupGameProps) => (
  <>
    <form onSubmit={e => e.preventDefault()}>
      <div>
        <label htmlFor="username">Username</label>
        <input name="username" type="text" value={username} onChange={ev => serUsername(ev.target.value)} />
      </div>
      <button onClick={onAddBoat}>Add boats</button>
      <button onClick={onAddBoat}>Random game!</button>
      <button onClick={onStart}>Start!</button>
    </form>
    {error && <span>{error}</span>}
  </>
)

export default SetupGame;
