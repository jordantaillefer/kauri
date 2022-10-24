import type { LoaderFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"

import { container } from "api"

export const loader: LoaderFunction = async ({ request }) => {
  const compteUtilisateurController = container.resolve("compteUtilisateurController")
  await compteUtilisateurController.creerCompteUtilisateur(request)
  return redirect("/profil")
}