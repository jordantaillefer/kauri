import type { ReactNode } from "react"

interface SubmitButtonProps {
  value?: string
  name?: string
  children: ReactNode
}

export function SubmitButton({ children, value, name = "_action" }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      aria-label={name}
      value={value}
      name={name}
      className="text-base p-3 bg-primary font-medium leading-6 text-white whitespace-no-wrap focus:outline-none focus rounded-md"
    >
      {children}
    </button>
  )
}
