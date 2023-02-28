import { Form } from "@remix-run/react"
import { FunctionComponent } from "react"

export const CreerSeanceButton: FunctionComponent = () => {
  return (
    <Form method="post">
      <button
        type="submit"
        aria-label="creer-seance"
        className="text-base p-3 bg-primary font-medium leading-6 text-white whitespace-no-wrap focus:outline-none focus rounded-md">
        Créer une nouvelle séance
      </button>
    </Form>
  )
}