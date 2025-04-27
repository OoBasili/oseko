import { Canvas } from '@react-three/fiber';
import { KeyboardControls, KeyboardControlsEntry, OrbitControls, Stats } from '@react-three/drei';
import React from 'react';

import './styles.css';
import { Cubes } from './cubes';
import { Control } from './types';

export const MainCanvas = () => {
  const map = React.useMemo<KeyboardControlsEntry<Control>[]>(
    () => [
      { name: Control.Space, keys: [Control.Space] },
      { name: Control.ArrowUp, keys: [Control.ArrowUp] },
      { name: Control.ArrowDown, keys: [Control.ArrowDown] },
    ],
    []
  );
  return (
    <div id={'canvas-container'}>
      <Canvas camera={{ position: [0, 0, 16], fov: 60 }}>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          maxAzimuthAngle={Math.PI / 16}
          minAzimuthAngle={-Math.PI / 16}
          minPolarAngle={Math.PI / 2.2}
          maxPolarAngle={Math.PI / 1.8}
        />
        <KeyboardControls map={map}>
          <Cubes />
        </KeyboardControls>
        <Stats />
      </Canvas>
    </div>
  );
};
