import React from 'react';
import { findGroups, getRandomMatrix, increaseMatrix, rerollMatrix } from './common/matrix';
import { CubeInstances } from './cube';
import { useKeyboardControls } from '@react-three/drei';
import { Control, CUBE_SIZE, MATRIX_DELTA, PointValue } from './types';
import { useThree } from '@react-three/fiber';

export const Cubes = () => {
  const [matrix, setMatrix] = React.useState(getRandomMatrix(5));
  const [groups, setGroups] = React.useState<PointValue[][]>();
  const timeout = React.useRef(0);
  const [sub] = useKeyboardControls<Control>();

  const { camera } = useThree();

  React.useEffect(() => {
    const maxDim = (matrix.length - 1) * MATRIX_DELTA + CUBE_SIZE;

    camera.position.set(0, 0, maxDim / 1.4 / Math.sin((Math.PI * 60) / 360));
    camera.updateProjectionMatrix();
  }, [camera, matrix]);

  React.useEffect(() => {
    return sub(
      (state) => state.Space,
      (pressed) => {
        if (pressed && !timeout.current) {
          processMatrix(getRandomMatrix(5));
        }
      }
    );
  }, [sub]);

  React.useEffect(() => {
    return sub(
      (state) => state.ArrowUp,
      (pressed) => {
        if (pressed && !timeout.current && matrix.length < 11) {
          const newMatrix = increaseMatrix(matrix);
          processMatrix(newMatrix);
        }
      }
    );
  }, [sub, matrix]);

  React.useEffect(() => {
    return sub(
      (state) => state.ArrowDown,
      (pressed) => {
        if (pressed && !timeout.current) {
          const max = groups ? Math.max(...groups.map((group) => group.length)) : 0;
          const newMatrix = rerollMatrix(matrix, groups?.filter((g) => g.length == max).map(([v]) => v.value) ?? []);
          processMatrix(newMatrix);
        }
      }
    );
  }, [sub, matrix, groups]);

  const processMatrix = (matrix: number[][]) => {
    setMatrix(matrix);
    setGroups(undefined);
    timeout.current = setTimeout(() => {
      setGroups(findGroups(matrix));
      timeout.current = 0;
    }, 1000);
  };

  return <CubeInstances matrix={matrix} groups={groups} />;
};
