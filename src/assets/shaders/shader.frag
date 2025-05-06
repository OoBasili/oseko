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