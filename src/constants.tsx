export const BOARD_SIZE = 10;
export const CELL_SPACE = 2;
export const CELL_SIZE = 16 + CELL_SPACE * 2;

export const AI_DELAY = 300;

export const ALIGNMENT = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical',
}

export class Position {
  public x: number;
  public y: number;

  public constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
  }

  equals(anotherPosition: Position) {
    return this.x === anotherPosition.x && this.y === anotherPosition.y;
  }
}
