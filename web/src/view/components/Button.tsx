import type { ComponentProps } from "react";
import { cn } from "../../app/utils/cn";
import { Spinner } from "./Spinner";

interface ButtonProps extends ComponentProps<"button"> {
  isLoading?: boolean;
  variant?: "danger" | "ghost";
}

export function Button({
  className,
  isLoading,
  variant,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={cn(
        `flex justify-center items-center bg-teal-900 hover:bg-teal-800 disabled:bg-transparent px-6 rounded-2xl h-12 font-medium text-white disabled:text-gray-400 transition-all disabled:cursor-not-allowed`,
        variant === "danger" && "bg-red-900 hover:bg-red-800",
        variant === "ghost" &&
          "bg-transparent border border-gray-800 text-gray-800 hover:bg-gray-800/5 disabled:border-0",
        className
      )}
    >
      {!isLoading && <p>{children}</p>}
      {isLoading && <Spinner className="w-6 h-6" />}
    </button>
  );
}
