import type { ActionFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"

import { container } from "api"

export const action: ActionFunction = async ({ request }) => {
  return redirect("/",
    {
      headers: {
        "Set-Cookie": await container.resolve("compteUtilisateurController").seDeconnecter({ request, payload: null })
      }
    })
}
