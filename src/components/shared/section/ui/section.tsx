import type { ReactNode } from "react";

interface ISectionProps {
  title: string;
  children: ReactNode;
  leading?: ReactNode;
}

export const Section = ({ title, children, leading }: ISectionProps) => (
  <div className="px-4 py-3">
    <div className="mb-2.5 flex items-center gap-2">
      {leading}
      <div className="font-sans text-xs uppercase tracking-widest text-muted">{title}</div>
    </div>
    {children}
  </div>
);

export const SectionDivider = () => <div className="mx-4 h-px bg-border" />;
