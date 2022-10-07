import type { LoaderFunction } from "@remix-run/node"
import { SocialsProvider } from "remix-auth-socials"
import { authenticator } from "~/services/auth.server"

export const loader: LoaderFunction = ({ request }) => {
  return authenticator.authenticate(SocialsProvider.GOOGLE, request, {
    successRedirect: "/profile",
    failureRedirect: "/"
  })
}