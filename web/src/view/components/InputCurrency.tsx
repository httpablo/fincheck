import { NumericFormat } from "react-number-format";
import { cn } from "../../app/utils/cn";
import { CrossCircledIcon } from "@radix-ui/react-icons";

interface InputCurrencyProps {
  error?: string;
  value?: string | number;
  onChange?(value: string): void;
}

export function InputCurrency({ error, onChange, value }: InputCurrencyProps) {
  return (
    <div>
      <NumericFormat
        thousandSeparator="."
        decimalSeparator=","
        decimalScale={2}
        value={value}
        defaultValue={0}
        onValueChange={(values) => onChange?.(values.value)}
        className={cn(
          "w-full text-gray-800 text-[32px] tracking-tightest font-bold outline-none",
          error && "text-red-900"
        )}
      />

      {error && (
        <div className="flex gap-2 items-center mt-2 text-red-900">
          <CrossCircledIcon />
          <span className="text-red-900 text-xs">{error}</span>
        </div>
      )}
    </div>
  );
}
