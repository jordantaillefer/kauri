import { Form } from "@remix-run/react"
import { FunctionComponent } from "react"

export const CreerSeanceButton: FunctionComponent = () => {
  return (
    <Form method="post">
      <button
        type="submit"
        aria-label="creer-seance"
        className="rounded-md p-3 text-base font-medium leading-6 text-white bg-primary whitespace-no-wrap focus focus:outline-none"
      >
        Créer une nouvelle séance
      </button>
    </Form>
  )
}
