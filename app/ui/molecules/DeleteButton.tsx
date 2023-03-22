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
        className="text-base p-3 bg-red-800 font-medium leading-6 text-white whitespace-no-wrap focus:outline-none focus rounded-md"
      >
        {children}
      </button>
    </Form>
  )
}
