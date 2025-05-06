import type { PointValue } from '../types';
import { getRandomArray, getRandomNumber, increaseLine } from './math';

export function rerollMatrix(matrix: number[][], fixed: number[]) {
  return matrix.map((line) => line.map((number) => (fixed.includes(number) ? number : getRandomNumber())));
}

export function increaseMatrix(matrix: number[][], step = 1) {
  const newMatrix = matrix.map((line) => increaseLine(line, step));
  const cols = getMatrixColumnsNumber(newMatrix);
  return [...getRandomMatrix(step, cols), ...newMatrix, ...getRandomMatrix(step, cols)];
}

export function getRandomMatrix(rows: number, cols = rows) {
  return Array.from({ length: rows }, () => getRandomArray(cols));
}

export function findGroups(matrix: number[][]) {
  const { length } = matrix;
  const cols = getMatrixColumnsNumber(matrix);
  const visited = Array.from({ length }, () => new Array<boolean>(cols).fill(false));
  const groups: PointValue[][] = [];

  const directions = [
    [-1, 0],
    [0, -1],
    [0, 1],
    [1, 0],
  ];

  function exploreGroup(y: number, x: number, value: number, group: PointValue[]) {
    if (x < 0 || x >= cols || y < 0 || y >= length || visited[y][x] || matrix[y][x] !== value) {
      return;
    }

    visited[y][x] = true;
    group.push({ x, y, value, index: x + y * length });

    for (const [dx, dy] of directions) {
      exploreGroup(y + dy, x + dx, value, group);
    }
  }

  for (let i = 0; i < length; i++) {
    for (let j = 0; j < cols; j++) {
      if (!visited[i][j]) {
        const group: PointValue[] = [];
        exploreGroup(i, j, matrix[i][j], group);

        if (group.length >= 5) {
          groups.push(group);
        }
      }
    }
  }

  return groups;
}

export function getMatrixColumnsNumber(matrix: number[][]) {
  return matrix[0]?.length ?? 0;
}
