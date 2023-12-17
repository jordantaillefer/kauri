import { container } from "@/api/index.server"
import type { ActionFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"

export const action: ActionFunction = async ({ request }) => {
  const compteUtilisateurController = container.resolve("compteUtilisateurController")
  await compteUtilisateurController.authenticate(request)
  return redirect("/trainings")
}
