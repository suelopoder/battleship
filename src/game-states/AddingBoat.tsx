import React from 'react';
import { ALIGNMENT } from '../constants';

interface AddingBoatProps {
  alignment: string,
  setAlignment: (alignment: string) => void,
  size: number,
  setSize: (size: number) => void,
  onDone: () => void,
};

const AddingBoat = (props: AddingBoatProps) => {
  const {
    alignment,
    setAlignment,
    size,
    setSize,
    onDone
  } = props;

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        onDone();
      }}
    >
      <div>
        <label htmlFor="alignment_horizontal">Horizontal</label>
        <input
          type="radio"
          name="alignment_horizontal"
          checked={alignment === ALIGNMENT.HORIZONTAL}
          onChange={() => setAlignment(ALIGNMENT.HORIZONTAL)}
        />
        <label htmlFor="alignment_vertical">Vertical</label>
        <input
          type="radio"
          name="alignment_vertical"
          checked={alignment === ALIGNMENT.VERTICAL}
          onChange={() => setAlignment(ALIGNMENT.VERTICAL)}
        />
      </div>
      <div>
        <label htmlFor="size">Size</label>
        <input
          type="number"
          name="size" value={size}
          onChange={ev => setSize(Number(ev.target.value))}
        />
      </div>
      <input type="submit" value="Done!" />
    </form>
  )
}

export default AddingBoat;
