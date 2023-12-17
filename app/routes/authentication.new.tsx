import * as serverModule from "@/api/index.server"
import type { LoaderFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"

export const loader: LoaderFunction = async ({ request }) => {
  console.log("hey")
  const compteUtilisateurController = serverModule.container.resolve("compteUtilisateurController")
  await compteUtilisateurController.creerCompteUtilisateur(request)
  console.log("hey 2")
  return redirect("/trainings")
}
