import { Form } from "@remix-run/react"
import { FunctionComponent } from "react"
import { SocialsProvider } from "remix-auth-socials"

import { RoundedButton } from "~/ui/atoms/RoundedButton"

export const SeConnecterButton: FunctionComponent = () => {
  return (
    <Form className="inline-flex justify-center" method="post" action={`/authentication/${SocialsProvider.GOOGLE}`}>
      <RoundedButton>
        <img className="md:hidden w-4" src="/assets/icons/account.png" alt="Se connecter" />
        <span className="hidden md:block">Se connecter</span>
      </RoundedButton>
    </Form>
  )
}