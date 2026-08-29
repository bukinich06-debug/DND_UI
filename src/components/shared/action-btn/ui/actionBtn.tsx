interface IActionBtnProps {
  label: string;
  primary?: boolean;
  danger?: boolean;
}

export const ActionBtn = ({ label, primary, danger }: IActionBtnProps) => {
  if (primary)
    return (
      <button className="cursor-pointer border border-accent bg-accent px-3 py-1.5 font-sans text-xs font-semibold text-white">
        {label}
      </button>
    );

  if (danger)
    return (
      <button className="cursor-pointer border border-combat bg-transparent px-3 py-1.5 font-sans text-xs text-combat">
        {label}
      </button>
    );

  return (
    <button className="cursor-pointer border border-border-light bg-panel-alt px-3 py-1.5 font-sans text-xs text-foreground-dim">
      {label}
    </button>
  );
};
