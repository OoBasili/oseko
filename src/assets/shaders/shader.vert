attribute float brightness;
varying float vBrightness;
varying vec3 vNormal;

void main() {
  vBrightness = brightness;
  vNormal = normal;
  gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
}