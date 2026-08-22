import type { ReactNode } from "react";

interface IStrokeIconProps {
  children: ReactNode;
  size?: number;
  fill?: string;
  strokeWidth?: string;
}

export const StrokeIcon = ({ children, size = 14, fill = "none", strokeWidth = "2" }: IStrokeIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);
