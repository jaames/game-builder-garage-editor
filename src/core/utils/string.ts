export function stringCompareChr(a: string, b: string) {
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const chrA = a.charCodeAt(i);
    const chrB = b.charCodeAt(i);
    if (chrA === chrB) continue;
    return chrA - chrB;
  }
  return 1;
}