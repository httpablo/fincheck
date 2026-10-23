import { ChevronDownIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { cn } from "../../app/utils/cn";
import { ColorIcon } from "./icons/ColorIcon";
import { DropdownMenu } from "./Dropdown";

interface ColorsDropDownInputProps {
  className?: string;
  error?: string;
  value?: string;
  onChange?(value: string): void;
}

type Color = {
  color: string;
  bg: string;
  label: string;
};

const colors: Color[] = [
  { color: "#FA5252", bg: "#FFF5F5", label: "Vermelho" },
  { color: "#E64980", bg: "#FFF0F6", label: "Rosa" },
  { color: "#BE4BDB", bg: "#F8F0FC", label: "Roxo" },
  { color: "#7950F2", bg: "#F3F0FF", label: "Violeta" },
  { color: "#4C6EF5", bg: "#EDF2FF", label: "Azul escuro" },
  { color: "#228BE6", bg: "#E7F5FF", label: "Azul" },
  { color: "#15AABF", bg: "#E3FAFC", label: "Ciano" },
  { color: "#12B886", bg: "#E6FCF5", label: "Verde-água" },
  { color: "#40C057", bg: "#EBFBEE", label: "Verde" },
  { color: "#82C91E", bg: "#F4FCE3", label: "Lima" },
  { color: "#FAB005", bg: "#FFF9DB", label: "Amarelo" },
  { color: "#FD7E14", bg: "#FFF4E6", label: "Laranja" },
  { color: "#868E96", bg: "#F8F9FA", label: "Cinza" },
  { color: "#212529", bg: "#F8F9FA", label: "Preto" },
];

export function ColorsDropdownInput({
  className,
  error,
  value,
  onChange,
}: ColorsDropDownInputProps) {
  const selectedColor = colors.find((color) => color.color === value) || null;

  function handleSelectColor(color: Color) {
    onChange?.(color.color);
  }

  return (
    <div>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <button
            className={cn(
              "bg-white w-full rounded-lg border border-gray-500 px-3 h-[52px] text-gray-700 focus:border-gray-800 transition-all outline-none text-left relative",
              error && "border-red-900",
              className
            )}
          >
            Cor
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {!selectedColor && (
                <ChevronDownIcon className="w-6 h-6 text-gray-800" />
              )}
              {selectedColor && (
                <ColorIcon color={selectedColor.color} bg={selectedColor.bg} />
              )}
            </div>
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="grid grid-cols-4">
          {colors.map((color) => (
            <DropdownMenu.Item
              key={color.color}
              aria-label={color.label}
              onSelect={() => handleSelectColor(color)}
            >
              <ColorIcon color={color.color} bg={color.bg} />
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      {error && (
        <div className="flex gap-2 items-center mt-2 text-red-900">
          <CrossCircledIcon />
          <span className=" text-xs">{error}</span>
        </div>
      )}
    </div>
  );
}
