import type { ReactNode } from "react"
import { clsxm } from "~/utils/clsxm";
import clsx from "clsx";

interface PrimaryButtonProps {
  children: ReactNode
  onClick: () => void
}

export function PrimaryButton({ children, onClick }: PrimaryButtonProps) {
  const defaultClasses = clsx(
    "mx-2 px-5 py-2.5",
    "rounded-lg",
    "text-sm font-medium text-center text-white",
    "shadow-lg"
  )
  const classes = clsxm(
    defaultClasses
  )
  return (
    <button
      onClick={onClick}
      className={classes}
    >
      {children}
    </button>
  )
}
