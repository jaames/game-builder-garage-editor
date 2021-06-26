type PlotFn = (x: number, y: number) => void;

// create a line of points using bresenham's line algorithm
export function plotLine(plot: PlotFn, x0: number, y0: number, x1: number, y1: number) {
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = (x0 < x1) ? 1 : -1;
  const sy = (y0 < y1) ? 1 : -1;
  let err = dx - dy;
  let e2 = 0;
  while (true) {
    plot(x0, y0);
    if (x0 === x1 && y0 === y1)
      break;
    e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
}

export function plotRectangle(plot: PlotFn, x0: number, y0: number, x1: number, y1: number) {
  plotLine(plot, x0, y0, x1, y0); // top line
  plotLine(plot, x0, y0, x0, y1); // left line
  plotLine(plot, x1, y0, x1, y1); // right line
  plotLine(plot, x0, y1, x1, y1); // bottom line
}

export function plotFilledRectangle(plot: PlotFn, x0: number, y0: number, x1: number, y1: number) {
  const xMin = Math.min(x0, x1);
  const xMax = Math.max(x0, x1);
  const yMin = Math.min(y0, y1);
  const yMax = Math.max(y0, y1);
  for (let y = yMin; y <= yMax; y++) {
    for (let x = xMin; x <= xMax; x++) {
      plot(x, y);
    }
  }
}

// bresenham midpoint circle algorithm
// TODO: fixme, doesn't work for even widths
// ref: https://observablehq.com/@jheeffer/pixelated-circle
export function plotCircle(plot: PlotFn, x0: number, y0: number, radius: number) {
  const r = radius - 1;
  let x = -r;
  let y = (r % 1 === 0) ? 0 : 0.5; // non-integer radius, move y half down
  let err = 2 - 2 * r;

  while (x < 0) {
    plot(x0 - x, y0 + y);
    plot(x0 - y, y0 - x);
    plot(x0 + x, y0 - y);
    plot(x0 + y, y0 + x);

    if (r <= y) {
      y += 1;
      err += y * 2 + 1;
    }
    if (r > x || err > y) {
      x += 1;
      err += x * 2 + 1;
    }
  }
}

export function plotFilledCircle(plot: PlotFn, x0: number, y0: number, radius: number) {
  let x = -radius;
  let y = 0;
  let err = 2 - 2 * radius;
  while (x < 0) {
    // horiz line 1
    plotLine(plot, x0 - x, y0 - y, x0 + x, y0 - y);
    // horiz line 2
    plotLine(plot, x0 - x, y0 + y, x0 + x, y0 + y);
    radius = err;
    if (radius <= y) {
      y += 1;
      err += y * 2 + 1;
    }
    if (radius > x || err > y) {
      x += 1;
      err += x * 2 + 1;
    }
  }
}