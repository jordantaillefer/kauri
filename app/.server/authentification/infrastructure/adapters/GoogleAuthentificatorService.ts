import { Authenticator } from "remix-auth"
import type { GoogleProfile} from "remix-auth-socials";
import { GoogleStrategy } from "remix-auth-socials"

import config from "../../../../../config.server"
import type { SessionManager} from "@/api/app/session.server";
import { sessionStorage } from "@/api/app/session.server"
import { CompteUtilisateur } from "../../domain/CompteUtilisateur"
import { LUtilisateurNestPasConnecteError } from "../../domain/errors/LUtilisateurNestPasConnecteError"
import type { AuthentificationService } from "../../domain/ports/AuthentificationService"
import type { CompteUtilisateurRepository } from "../../domain/ports/CompteUtilisateurRepository"

interface Dependencies {
  compteUtilisateurRepository: CompteUtilisateurRepository
  sessionManager: SessionManager
}

export class GoogleAuthentificatorService implements AuthentificationService {
  private authenticator: Authenticator<GoogleProfile>
  private _compteUtilisateurRepository: CompteUtilisateurRepository
  private _sessionManager: SessionManager

  constructor({ compteUtilisateurRepository, sessionManager }: Dependencies) {
    this._compteUtilisateurRepository = compteUtilisateurRepository
    this._sessionManager = sessionManager
    this.authenticator = new Authenticator(sessionStorage)
    this.authenticator.use(
      new GoogleStrategy(
        {
          clientID: config.google.clientId,
          clientSecret: config.google.clientSecret,
          scope: ["openid", "email", "profile"],
          callbackURL: `/authentication/${config.authenticatorStrategy}/callback`,
          prompt: "select_account"
        },
        this.handleSocialAuthCallback
      )
    )
  }

  async seConnecter(request: Request): Promise<CompteUtilisateur> {
    const callbackProfile: GoogleProfile = await this.authenticator.authenticate(config.authenticatorStrategy, request,
      {
        successRedirect: "/authentication/new",
      })

    let compteUtilisateur = await this._compteUtilisateurRepository.recupererCompteUtilisateurParId(callbackProfile.id)
    if (!compteUtilisateur) {
      compteUtilisateur = await this._compteUtilisateurRepository.creerCompteUtilisateur(CompteUtilisateur.creerCompteUtilisateur({ id: callbackProfile.id, nom: callbackProfile.name.familyName, prenom: callbackProfile.name.givenName }))
    }
    return compteUtilisateur
  }

  async seDeconnecter(request: Request): Promise<string> {
    return this._sessionManager.destroySession(request)
  }

  async recupererCompteUtilisateurConnecte(request: Request): Promise<CompteUtilisateur> {
    const session = await this._sessionManager.get(request)
    if (!session.has("user")) {
      throw new LUtilisateurNestPasConnecteError()
    }
    const user = session.get("user")
    return this._compteUtilisateurRepository.recupererCompteUtilisateurParId(user.id)
  }

  private async handleSocialAuthCallback({ profile: callbackProfile }: { profile: GoogleProfile }): Promise<GoogleProfile> {
    return callbackProfile
  }
}
