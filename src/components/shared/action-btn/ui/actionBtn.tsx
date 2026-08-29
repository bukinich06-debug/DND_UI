interface IActionBtnProps {
  label: string;
  primary?: boolean;
  danger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const ActionBtn = ({ label, primary, danger, disabled, onClick }: IActionBtnProps) => {
  const state = disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer";

  if (primary)
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={`${state} border border-accent bg-accent px-3 py-1.5 font-sans text-xs font-semibold text-white`}
      >
        {label}
      </button>
    );

  if (danger)
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={`${state} border border-combat bg-transparent px-3 py-1.5 font-sans text-xs text-combat`}
      >
        {label}
      </button>
    );

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`${state} border border-border-light bg-panel-alt px-3 py-1.5 font-sans text-xs text-foreground-dim`}
    >
      {label}
    </button>
  );
};
