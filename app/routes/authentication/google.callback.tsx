import type { LoaderFunction } from "@remix-run/node"

import { container } from "api"

export const loader: LoaderFunction = async ({ request }) => {
  const compteUtilisateurController = container.resolve("compteUtilisateurController")
  return await compteUtilisateurController.authenticate(request)
}