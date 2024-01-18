import * as serverModule from "@/api/index.server"
import type { LoaderFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"

export const loader: LoaderFunction = async ({ request }) => {
  return redirect("/", {
    headers: {
      "Set-Cookie": await serverModule.container.resolve("compteUtilisateurController").seDeconnecter({ request, payload: null })
    }
  })
}
