type EnumType<T> = T[keyof T];
export const OControl = {
  Space: 'Space',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
} as const;
export type Control = EnumType<typeof OControl>;

export const OColor = {
  Cyan: 0,
  Yellow: 1,
  Blue: 2,
  Red: 3,
  Pink: 4,
  Green: 5,
} as const;
export type Color = EnumType<typeof OColor>;

export interface Point2 {
  x: number;
  y: number;
}

export interface PointValue extends Point2 {
  value: number;
  index: number;
}

export const CUBE_SIZE = 2;
export const MATRIX_DELTA = CUBE_SIZE * 1.1;
