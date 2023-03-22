import type { LoaderFunction } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { ReasonPhrases } from "http-status-codes"

import { container } from "api"
import HomePage from "~/ui/pages/homepage/HomePage"

export const loader: LoaderFunction = async ({ request }) => {
  const response = await container.resolve("compteUtilisateurController").recupererCompteUtilisateurConnecte(request)
  if (response.reasonPhrase === ReasonPhrases.OK) {
    return redirect("/profil")
  }
  return json({
    authenticated: !!response.data
  })
}

export default HomePage
