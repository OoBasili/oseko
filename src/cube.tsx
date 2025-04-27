import React from 'react';
import * as THREE from 'three';

import { Edges } from '@react-three/drei';
import { CUBE_SIZE, MATRIX_DELTA, Point2, PointValue } from './types';
import { getMatrixColumnsNumber } from './common/matrix';
import { useFrame } from '@react-three/fiber';

interface InstanceProps {
  matrix: number[][];
  groups?: PointValue[][];
}

const DUMMY = new THREE.Object3D();
const MATRIX = new THREE.Matrix4();
const CUBE = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
const TRANSPARENT_MATERIAL = new THREE.MeshBasicMaterial({ opacity: 0, transparent: true });

export const CubeInstances = (props: InstanceProps) => {
  const instancedMeshRef = React.useRef<THREE.InstancedMesh>(null);

  React.useEffect(() => {
    const { current } = instancedMeshRef;
    if (current == null) {
      return;
    }
    const { length } = props.matrix;

    const brightness = new Float32Array(length * getMatrixColumnsNumber(props.matrix)).fill(
      props.groups?.length ? 0.3 : 0.8
    );
    props.groups?.forEach((g) => {
      g.forEach((v) => {
        brightness[v.index] = 0.9;
      });
    });
    for (let y = 0; y < length; y++) {
      for (let x = 0; x < getMatrixColumnsNumber(props.matrix); x++) {
        const i = x + y * length;
        const point = getPoint(x, y, props.matrix);
        DUMMY.position.set(point.x, point.y, 0);
        DUMMY.rotation.set(...getRotation(props.matrix[y][x]));
        DUMMY.updateMatrix();
        current.setMatrixAt(i, DUMMY.matrix);
      }
    }
    current.geometry.setAttribute('brightness', new THREE.InstancedBufferAttribute(brightness, 1));
    current.instanceMatrix.needsUpdate = true;
  }, [props.matrix, props.groups]);

  useFrame(() => {
    const { current } = instancedMeshRef;
    if (current == null || props.groups == undefined) {
      return;
    }

    props.groups.forEach((g) => {
      g.forEach((v) => {
        current.getMatrixAt(v.index, MATRIX);
        MATRIX.decompose(DUMMY.position, DUMMY.quaternion, DUMMY.scale);
        DUMMY.position.lerp(DUMMY.position.clone().setZ(0.8), 0.01);
        DUMMY.updateMatrix();
        current.setMatrixAt(v.index, DUMMY.matrix);
      });
    });
    current.instanceMatrix.needsUpdate = true;
  });

  const count = props.matrix.length * getMatrixColumnsNumber(props.matrix);
  return (
    <group>
      <instancedMesh ref={instancedMeshRef} args={[CUBE, undefined, count]}>
        <shaderMaterial
          vertexShader={`
          attribute float brightness;
          varying float vBrightness;
          varying vec3 vNormal;
          
          void main() {
            vBrightness = brightness;
            vNormal = normal;
            gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
          }
        `}
          fragmentShader={`
          varying float vBrightness;
          varying vec3 vNormal;
          
          void main() {
            vec3 absNormal = abs(vNormal);
            
            vec3 baseColor;
            if (absNormal.x > 0.99 && vNormal.x > 0.0) {
              baseColor = vec3(1, 0.0, 0.0);
            } else if (absNormal.x > 0.99 && vNormal.x < 0.0) {
              baseColor = vec3(0.0, 1, 0.0);
            } else if (absNormal.y > 0.99 && vNormal.y > 0.0) {
              baseColor = vec3(0.0, 0.0, 1);
            } else if (absNormal.y > 0.99 && vNormal.y < 0.0) {
              baseColor = vec3(1, 1, 0.0);
            } else if (absNormal.z > 0.99 && vNormal.z > 0.0) {
              baseColor = vec3(1, 0.0, 1);
            } else {
              baseColor = vec3(0.0, 1, 1);
            }
            
            vec3 finalColor = baseColor * vBrightness;
            gl_FragColor = vec4(clamp(finalColor, 0.0, 1.0), 1.0);
          }
        `}
        />
      </instancedMesh>
      <group>
        {props.matrix.map((line, y) =>
          line.map((number, x) => {
            const winner = props.groups
              ?.flatMap((g) => (g[0].value == number ? g : []))
              .some((v) => v.x == x && v.y == y);
            return (
              <CubeEdge key={`${x.toString()}-${y.toString()}`} point={getPoint(x, y, props.matrix)} winner={winner} />
            );
          })
        )}
      </group>
    </group>
  );
};

interface Props {
  point: Point2;
  winner?: boolean;
}

export const CubeEdge = (props: Props) => {
  const mesh = React.useRef<THREE.Mesh>(null);
  React.useEffect(() => {
    mesh.current?.position.set(props.point.x, props.point.y, 0);
  }, [props.point]);

  useFrame(() => {
    if (props.winner) {
      mesh.current?.position.lerp(mesh.current.position.clone().setZ(0.8), 0.01);
    }
  });
  return (
    <mesh ref={mesh} geometry={CUBE} material={TRANSPARENT_MATERIAL}>
      <Edges linewidth={2} scale={1.004} color={0x000000} threshold={15} />
    </mesh>
  );
};

function getPoint(x: number, y: number, matrix: number[][]): Point2 {
  return { x: x * MATRIX_DELTA - getMatrixOffset(matrix, false), y: y * MATRIX_DELTA - getMatrixOffset(matrix) };
}

function getMatrixOffset(matrix: number[][], vertical = true) {
  return (((vertical ? matrix.length : getMatrixColumnsNumber(matrix)) - 1) * MATRIX_DELTA) / 2;
}

function getRotation(number: number): THREE.EulerTuple {
  switch (number) {
    case 0:
      return [Math.PI / 2, 0, 0];
    case 1:
      return [-Math.PI / 2, 0, 0];
    case 2:
      return [0, Math.PI / 2, 0];
    case 3:
      return [0, -Math.PI / 2, 0];
    case 4:
      return [0, 0, 0];
    default:
      return [0, Math.PI, 0];
  }
}
