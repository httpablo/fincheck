import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { capitalizeFirstLetter } from "../../app/utils/capitalizeFirstLetter";

interface DatePickerProps {
  value: Date;
  onChange?(date: Date): void;
}

export function DatePicker({ onChange, value }: DatePickerProps) {
  const defaultClassNames = getDefaultClassNames();
  return (
    <DayPicker
      locale={ptBR}
      selected={value}
      mode="single"
      onSelect={(date) => onChange?.(date ?? new Date())}
      classNames={{
        root: `${defaultClassNames.root}`,
        chevron: `${defaultClassNames.chevron} fill-teal-900`,
        caption_label: "flex h-10",
        nav: "absolute flex gap-5 right-3",
        month: "font-medium text-gray-900 tracking-[-0.408px]",
        button_previous:
          "text-teal-900 items-center justify-center !bg-transparent",
        button_next:
          "text-teal-900 items-center justify-center !bg-transparent",
        weekday: "uppercase text-xs text-gray-500 font-medium pt-1 pb-2",
        day_button: " cursor-pointer w-10 h-10 hover:bg-teal-100 rounded-full",
        today: "bg-gray-100 font-bold text-gray-900 rounded-full",
        selected: "bg-teal-900 text-white font-medium rounded-full",
      }}
      formatters={{
        formatCaption: (date, options) =>
          capitalizeFirstLetter(format(date, "LLLL yyyy", options)),
      }}
    />
  );
}
