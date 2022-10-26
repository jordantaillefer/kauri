import { Form } from "@remix-run/react"
import { SocialsProvider } from "remix-auth-socials"

export function SeConnecterButton() {
  return (
    <Form className="h-full" method="post" action={`/auth/${SocialsProvider.GOOGLE}`}>
      <button
        className="text-base h-full p-3 bg-primary font-medium leading-6 text-white whitespace-no-wrap focus:outline-none focus">
        Se connecter
      </button>
    </Form>

  )
}