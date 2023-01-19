import { Form } from "@remix-run/react"

export function SeDeconnecterButton() {
  return (
    <Form className="h-full" method="post" action={`/logout`}>
      <button
        className="text-base p-3 bg-primary font-medium leading-6 text-white whitespace-no-wrap focus:outline-none focus">
        Se déconnecter
      </button>
    </Form>
  )
}