export function currencyStringToNumber(value: string): number {
  const numValue = Number(value);
  if (!isNaN(numValue)) {
    return numValue;
  }

  const normalizedValue = value.replace(/\./g, "").replace(",", ".");
  return Number(normalizedValue);
}
