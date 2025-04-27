import { clamp } from 'three/src/math/MathUtils.js';

function rgb2hsv(r: number, g: number, b: number): number[] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  let h = Number.NaN;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max === min) {
    h = 0;
  } else {
    if (max === r) {
      h = (g - b) / d + (g < b ? 6 : 0);
    } else if (max === g) {
      h = (b - r) / d + 2;
    } else if (max === b) {
      h = (r - g) / d + 4;
    }

    h /= 6;
  }

  return [Math.round(360 * h), s, v];
}

function red(color: number): number {
  return (color & 0xff0000) >> 16;
}

function green(color: number): number {
  return (color & 0xff00) >> 8;
}

function blue(color: number): number {
  return color & 0xff;
}

export function hsv2rgb(h: number, s: number, v: number): number[] {
  let [r, g, b] = [Number.NaN, Number.NaN, Number.NaN];

  const hh = h >= 360 ? 0 : h / 60;
  const f = hh - Math.floor(hh);
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  if (hh >= 0 && hh < 1) {
    [r, g, b] = [v, t, p];
  } else if (hh >= 1 && hh < 2) {
    [r, g, b] = [q, v, p];
  } else if (hh >= 2 && hh < 3) {
    [r, g, b] = [p, v, t];
  } else if (hh >= 3 && hh < 4) {
    [r, g, b] = [p, q, v];
  } else if (hh >= 4 && hh < 5) {
    [r, g, b] = [t, p, v];
  } else if (hh >= 5 && hh < 6) {
    [r, g, b] = [v, p, q];
  } else {
    [r, g, b] = [0, 0, 0];
  }

  r = Math.round(255 * r);
  g = Math.round(255 * g);
  b = Math.round(255 * b);

  return [r, g, b];
}

function twoDigitHexString(v: number): string {
  const res = clamp(v, 0, 255).toString(16);
  return res.length < 2 ? '0' + res : res;
}

function rgbToHexString(red: number, green: number, blue: number): string {
  return '#' + twoDigitHexString(red) + twoDigitHexString(green) + twoDigitHexString(blue);
}

export function darkenColor(color: string, amount: number): string {
  const num = parseInt(color.substring(1), 16);
  const hsv = rgb2hsv(red(num), green(num), blue(num));
  const rgb = hsv2rgb(hsv[0], hsv[1], clamp(hsv[2] - amount, 0, 1));

  return rgbToHexString(rgb[0], rgb[1], rgb[2]);
}
