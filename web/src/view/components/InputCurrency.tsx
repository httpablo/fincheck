import { NumericFormat } from "react-number-format";

export function InputCurrency() {
  return (
    <NumericFormat
      thousandSeparator="."
      decimalSeparator=","
      prefix="R$ "
      defaultValue="00,00"
      className="w-full text-gray-800 text-[32px] tracking-tightest font-bold outline-none"
    />
  );
}
