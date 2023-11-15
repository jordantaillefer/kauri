import { container } from "@/api"
import type { LoaderFunction } from "@remix-run/node"

export const loader: LoaderFunction = async ({ request }) => {
  const compteUtilisateurController = container.resolve("compteUtilisateurController")
  return await compteUtilisateurController.authenticate(request)
}
