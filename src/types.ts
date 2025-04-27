export const enum Control {
  Space = 'Space',
  ArrowUp = 'ArrowUp',
  ArrowDown = 'ArrowDown',
}

export interface Point2 {
  x: number;
  y: number;
}

export interface PointValue extends Point2 {
  value: number;
  index: number;
}

export const enum Color {
  Cyan,
  Yellow,
  Blue,
  Red,
  Pink,
  Green,
}

export const CUBE_SIZE = 2;
export const MATRIX_DELTA = CUBE_SIZE * 1.1;
