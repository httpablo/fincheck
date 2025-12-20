export function currencyStringToNumber(value: string | number): number {
  if (typeof value === "number") {
    return value;
  }

  const numValue = Number(value);
  if (!isNaN(numValue)) {
    return numValue;
  }

  const normalizedValue = value.replace(/\./g, "").replace(",", ".");
  return Number(normalizedValue);
}
