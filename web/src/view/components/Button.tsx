import { cn } from "../../app/utils/cn";

type ButtonProps = React.ComponentProps<"button">;

export function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "bg-teal-700 hover:bg-teal-800 disabled:bg-gray-100 disabled:cursor-not-alloweddisabled:text-gray-400 px-6 h-12 rounded-2xl font-medium text-white transition-all",
        className
      )}
    />
  );
}
