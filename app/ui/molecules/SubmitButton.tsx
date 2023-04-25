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
      className="rounded-md p-3 text-base font-medium leading-6 text-white bg-primary whitespace-no-wrap focus focus:outline-none"
    >
      {children}
    </button>
  )
}
