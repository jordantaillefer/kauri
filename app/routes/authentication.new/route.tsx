import * as serverModule from "@/api/index.server"
import type { LoaderFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"

export const loader: LoaderFunction = async ({ request }) => {
  const compteUtilisateurController = serverModule.getContainer().resolve("compteUtilisateurController")
  await compteUtilisateurController.creerCompteUtilisateur(request)
  return redirect("/trainings")
}
