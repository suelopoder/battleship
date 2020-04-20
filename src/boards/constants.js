import { CELL_SIZE, BOARD_SIZE } from '../constants';

const AXIS_ARRAY = [...Array(BOARD_SIZE).keys()];
export const BOARD_ARRAY = [...Array(BOARD_SIZE).keys()].map(() => AXIS_ARRAY);
export const PIXEL_SIZE = CELL_SIZE * BOARD_SIZE;