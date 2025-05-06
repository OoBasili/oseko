export function increaseLine(line: number[], step = 1) {
  return [...getRandomArray(step), ...line, ...getRandomArray(step)];
}

export function getRandomNumber() {
  return convertUint8(globalThis.crypto.getRandomValues(new Uint8Array(1))[0]);
}

export function getRandomArray(width: number) {
  const random = new Uint8Array(width);
  globalThis.crypto.getRandomValues(random);
  return [...random.map(convertUint8)];
}

function convertUint8(value: number) {
  return Math.floor((value / 256) * 6);
}
