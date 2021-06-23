function hexByte(int: number) {
  return int.toString(16).padStart(2, '0');
}

export function colorToRgba(color: number) {
  const r = (color >> 24) & 0xFF;
  const g = (color >> 16) & 0xFF;
  const b = (color >> 8) & 0xFF;
  const a = color & 0xFF;
  return [r, g, b, a];
}

export function colorToHex(color: number) {
  const [r, g, b, a] = colorToRgba(color);
  return `#${ hexByte(r) }${ hexByte(g) }${ hexByte(b) }${ hexByte(a) }`;
}

export function colorToRgbaString(color: number) {
  const [r, g, b, a] = colorToRgba(color);
  return `rgba(${ r }, ${ g }, ${ b }, ${ a / 255 })`;
}