import { useFrame } from '@react-three/fiber';
import React from 'react';

import { Mesh, Vector3 } from 'three';

const MIN_SCALE = 1;
const MIN_VECTOR = new Vector3(MIN_SCALE, MIN_SCALE, MIN_SCALE);
const MAX_SCALE = 1.5;
const MAX_VECTOR = new Vector3(MAX_SCALE, MAX_SCALE, MAX_SCALE);
const SCALE_SPEED = 0.005;

export const MainSphere = () => {
  const [hovered, setHovered] = React.useState(false);
  const mesh = React.useRef<Mesh>(null);
  const onPointerEnter = () => setHovered(true);
  const onPointerLeave = () => setHovered(false);
  useFrame(() => {
    mesh.current?.scale.lerp(hovered ? MAX_VECTOR : MIN_VECTOR, SCALE_SPEED);
  });
  return (
    <mesh ref={mesh} onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}>
      <sphereGeometry args={[2, 30, 30]} />
      <meshBasicMaterial wireframe color={hovered ? 0x000000 : 0xffffff} />
    </mesh>
  );
};
