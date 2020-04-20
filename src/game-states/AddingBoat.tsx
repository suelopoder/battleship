import React from 'react';
import { ALIGNMENT, Position } from '../constants';
import Boat, { BoatData } from '../Boat';

interface AddingBoatProps {
  selectedCell?: Position,
  alignment: string,
  setAlignment: (alignment: string) => void,
  size: number,
  setSize: (size: number) => void,
  isValidBoat: (position: BoatData) => boolean,
  onDone: () => void,
};

const AddingBoat = (props: AddingBoatProps) => {
  const {
    selectedCell,
    alignment,
    setAlignment,
    size,
    setSize,
    isValidBoat,
    onDone
  } = props;

  return (
    <form>
      {selectedCell &&
        <Boat
          position={selectedCell as Position}
          alignment={alignment}
          size={size}
          color={isValidBoat({
            position: selectedCell,
            alignment,
            size,
          }) ? "blue" : "red"}
        />
      }
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
      <label htmlFor="size">Size</label>
      <input
        type="number"
        name="size" value={size}
        onChange={ev => setSize(Number(ev.target.value))}
      />
      <input type="submit" onClick={onDone} value="Done!" />
    </form>
  )
}

export default AddingBoat;
