import type { ReactNode } from "react";

export function Editable({
  path,
  value,
  kind = "text",
  className,
  children,
}: {
  path: string;
  value: string;
  kind?: "text" | "lines" | "number";
  className?: string;
  children: ReactNode;
}) {
  return (
    <span data-edit-path={path} data-edit-kind={kind} data-edit-value={value} className={className}>
      {children}
    </span>
  );
}
