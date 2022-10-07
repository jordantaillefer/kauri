import { SocialsProvider } from "remix-auth-socials"

import { ActionButton } from "~/ui/components/ActionButton"

export function SeConnecterButton() {
  return (
    <ActionButton action={`/auth/${SocialsProvider.GOOGLE}`}>
      Se connecter
    </ActionButton>
  )
}