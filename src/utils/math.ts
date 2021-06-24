export const align = (ptr: number, size: number) => ptr + (size - ptr % size) % size;

export const lerp = (a: number, b: number, fac: number) => a + fac * (b - a);

export const degreesToRadians = (deg: number) => deg * (Math.PI / 180);