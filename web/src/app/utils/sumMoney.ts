export function sumMoney(values: number[]): number {
  const totalCents = values.reduce((acc, value) => {
    return acc + Math.round((value || 0) * 100);
  }, 0);

  const result = totalCents / 100;
  return result === 0 ? 0 : result;
}

export function subtractMoney(minuend: number, subtrahend: number): number {
  const centsMinuend = Math.round((minuend || 0) * 100);
  const centsSubtrahend = Math.round((subtrahend || 0) * 100);
  const diffCents = centsMinuend - centsSubtrahend;

  const result = diffCents / 100;
  return result === 0 ? 0 : result;
}
