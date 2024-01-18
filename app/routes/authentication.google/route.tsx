import * as serverModule from "@/api/index.server"
import type { ActionFunction } from "@remix-run/node"

export const action: ActionFunction = async ({ request }) => {
  const compteUtilisateurController = serverModule.container.resolve("compteUtilisateurController")
  await compteUtilisateurController.authenticate(request)
  return null
}
