import { Authenticator } from "remix-auth"
import { sessionStorage } from "~/services/session.server"
import type { GoogleProfile } from "remix-auth-socials/build/strategies/google"

import { container } from "api"
import { GoogleStrategy, SocialsProvider } from "remix-auth-socials"

export const authenticator = new Authenticator(sessionStorage)

export async function handleSocialAuthCallback({ profile }: { profile: GoogleProfile }) {
  const compteUtilisateurController = container.resolve("compteUtilisateurController")
  const user = await compteUtilisateurController.recupererCompteUtilisateur(profile.id)
  if (!user) {
    return compteUtilisateurController.creerCompteUtilisateur(profile.id)
  }
  return user
}

authenticator.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      scope: ["openid", "email", "profile"],
      callbackURL: `http://localhost:3000/auth/${SocialsProvider.GOOGLE}/callback`
    },
    handleSocialAuthCallback
  )
)