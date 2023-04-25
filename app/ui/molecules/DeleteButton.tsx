import { Form } from "@remix-run/react"
import type { ReactNode } from "react"

interface PrimaryButtonProps {
  value?: string
  name?: string
  children: ReactNode
  hiddenProps?: Record<string, any>
}

export function DeleteButton({ children, value, name = "_action", hiddenProps }: PrimaryButtonProps) {
  return (
    <Form method="delete">
      {hiddenProps &&
        Object.entries(hiddenProps).map(([key, value]) => <input type="hidden" key={key} name={key} value={value} />)}
      <button
        type="submit"
        aria-label={name}
        value={value}
        name={name}
        className="rounded-md bg-red-800 p-3 text-base font-medium leading-6 text-white whitespace-no-wrap focus focus:outline-none"
      >
        {children}
      </button>
    </Form>
  )
}
