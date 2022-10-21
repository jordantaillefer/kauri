import { Form } from "@remix-run/react"
import { ReactNode } from "react"

import { PrimaryButton } from "~/ui/components/PrimaryButton"

interface ActionButtonProps {
  action: string
  children: ReactNode
}

export function ActionButton({ children, action }: ActionButtonProps) {
  return <Form
    method="post"
    action={action}
  >
    <PrimaryButton>{children}</PrimaryButton>
  </Form>
}