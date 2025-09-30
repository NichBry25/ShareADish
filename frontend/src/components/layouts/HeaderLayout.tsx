import { ReactNode } from "react";

type HeaderSlots = {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
};

export type HeaderLayoutProps = HeaderSlots & {
  className?: string;
  sectionClassName?: string;
};

const baseHeader = "sticky top-0 z-50 flex items-center gap-4 border-b border-neutral-200 bg-[#344f1f] px-6 min-h-16 shadow-sm";
const leftSection = "flex-1 min-w-0";
const centerSection = "flex-1 flex justify-center min-w-0";
const rightSection = "flex-1 flex justify-end min-w-0";

export function HeaderLayout({
  left,
  center,
  right,
  className = "",
  sectionClassName = "",
}: HeaderLayoutProps) {
  return (
    <header className={`${baseHeader} ${className}`.trim()}>
      <div className={`${leftSection} ${sectionClassName}`.trim()}>{left}</div>
      <div className={`${centerSection} ${sectionClassName}`.trim()}>{center}</div>
      <div className={`${rightSection} ${sectionClassName}`.trim()}>{right}</div>
    </header>
  );
}
