import { Form } from "@remix-run/react"
import { FunctionComponent } from "react"

import { RoundedButton } from "~/ui/atoms/RoundedButton"

export const SeDeconnecterButton: FunctionComponent = () => {
  return (
    <Form className="inline-flex justify-center" method="post" action={`/logout`}>
      <RoundedButton>
        <img className="md:hidden w-4" src="/assets/icons/account.png" alt="Se connecter" />
        <span className="hidden md:block">Se déconnecter</span>
      </RoundedButton>
    </Form>
  )
}