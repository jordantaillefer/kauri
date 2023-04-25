import { Form } from "@remix-run/react"
import { FunctionComponent } from "react"

import { RoundedButton } from "~/ui/atoms/RoundedButton"

export const SeDeconnecterButton: FunctionComponent = () => {
  return (
    <Form className="inline-flex justify-center" method="post" action={"/authentication/logout"}>
      <RoundedButton type="submit">
        <img className="w-4 md:hidden" src="/assets/icons/account.png" alt="Se connecter" />
        <span className="hidden md:block">Se déconnecter</span>
      </RoundedButton>
    </Form>
  )
}
