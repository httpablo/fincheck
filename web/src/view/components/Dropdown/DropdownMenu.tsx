import * as RdxDropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "../../../app/utils/cn";

export function DropdownMenuRoot({ children }: { children: React.ReactNode }) {
  return <RdxDropdownMenu.Root>{children}</RdxDropdownMenu.Root>;
}

export function DropdownMenuTrigger({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RdxDropdownMenu.Trigger asChild className="outline-none">
      {children}
    </RdxDropdownMenu.Trigger>
  );
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  className?: string;
}

export function DropdownMenuContent({
  children,
  className,
}: DropdownMenuContentProps) {
  return (
    <RdxDropdownMenu.Portal>
      <RdxDropdownMenu.Content
        className={cn(
          "z-99 p-2 rounded-2xl bg-white space-y-2 shadow-[0px_11px_20px_0px_rgba(0,0,0,0.10)] data-[side=bottom]:animate-slideDownAndFade",
          "data-[side=top]:animate-slideUpAndFade",
          className
        )}
      >
        {children}
      </RdxDropdownMenu.Content>
    </RdxDropdownMenu.Portal>
  );
}

interface DropDownMenuItemProps {
  children: React.ReactNode;
  className?: string;
  onSelect?(): void;
}

export function DropdownMenuItem({
  children,
  className,
  onSelect,
}: DropDownMenuItemProps) {
  return (
    <RdxDropdownMenu.Item
      onSelect={onSelect}
      className={cn(
        "min-h-10 outline-none flex items-center py-2 px-4 text-sm text-gray-800 data-highlighted:bg-gray-50 rounded-2xl transition-colors cursor-pointer",
        className
      )}
    >
      {children}
    </RdxDropdownMenu.Item>
  );
}
