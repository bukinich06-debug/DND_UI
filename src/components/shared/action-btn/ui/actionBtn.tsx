interface IActionBtnProps {
  label: string;
  primary?: boolean;
  danger?: boolean;
}

export const ActionBtn = ({ label, primary, danger }: IActionBtnProps) => {
  if (primary)
    return (
      <button className="cursor-pointer rounded-[3px] border border-gold bg-gold px-3 py-1.5 font-sans text-xs font-semibold text-background">
        {label}
      </button>
    );

  if (danger)
    return (
      <button className="cursor-pointer rounded-[3px] border border-[#60302a] bg-transparent px-3 py-1.5 font-sans text-xs text-combat">
        {label}
      </button>
    );

  return (
    <button className="cursor-pointer rounded-[3px] border border-border-light bg-panel-alt px-3 py-1.5 font-sans text-xs text-foreground-dim">
      {label}
    </button>
  );
};
