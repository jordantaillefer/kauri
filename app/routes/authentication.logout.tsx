import { container } from "@/api"
import type { ActionFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"

export const action: ActionFunction = async ({ request }) => {
  return redirect("/", {
    headers: {
      "Set-Cookie": await container.resolve("compteUtilisateurController").seDeconnecter({ request, payload: null })
    }
  })
}
