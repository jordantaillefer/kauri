import * as serverModule from "@/api/index.server"
import type { LoaderFunction } from "@remix-run/node"

export const loader: LoaderFunction = async ({ request }) => {
  const compteUtilisateurController = serverModule.container.resolve("compteUtilisateurController")
  return await compteUtilisateurController.authenticate(request)
}
