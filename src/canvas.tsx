import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { MainSphere } from './sphere';
import './styles.css';

export const MainCanvas = () => {
  return (
    <div id={'canvas-container'}>
      <Canvas>
        <OrbitControls />
        <MainSphere />
      </Canvas>
    </div>
  );
};
