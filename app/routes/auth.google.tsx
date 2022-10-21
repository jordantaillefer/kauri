import type { ActionFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"

import { container } from "api"

export const action: ActionFunction = async ({ request }) => {
  const compteUtilisateurController = container.resolve("compteUtilisateurController")
  await compteUtilisateurController.authenticate(request)
  return redirect("/profile")
}
