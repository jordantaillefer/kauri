import type { LoaderFunction } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"

import { authenticator } from "~/services/auth.server"
import HomePage from "~/ui/pages/homepage/HomePage"

export const loader: LoaderFunction = async ({ request }) => {
  let user = await authenticator.isAuthenticated(request)
  if (user) {
    return redirect("/profile")
  }
  return json({
    authenticated: !!user
  })
}

export default HomePage