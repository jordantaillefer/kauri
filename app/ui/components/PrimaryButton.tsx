import type { ReactNode } from "react"

interface PrimaryButtonProps {
  children: ReactNode;
}

export function PrimaryButton({ children }: PrimaryButtonProps) {
  return (
    <button
      className="text-base p-3 bg-primary font-medium leading-6 text-white whitespace-no-wrap focus:outline-none focus rounded-md">
      {children}
    </button>
  )
}