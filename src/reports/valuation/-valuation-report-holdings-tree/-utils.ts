export function compareStringArrays(x: string[], y: string[]): number {
  const xLen = x.length;
  const yLen = y.length;
  const minLength = Math.min(xLen, yLen);

  for (let i = 0; i < minLength; i++) {
    const comparison = (x[i] || '').localeCompare(y[i] || '');

    if (comparison !== 0) {
      return comparison;
    }
  }

  return Math.sign(xLen - yLen);
}
