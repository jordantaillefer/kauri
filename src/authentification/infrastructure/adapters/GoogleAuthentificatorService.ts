import { Authenticator } from "remix-auth"
import { GoogleProfile, GoogleStrategy } from "remix-auth-socials"

import config from "../../../../config"
import { SessionManager, sessionStorage } from "../../../app/session.server"
import { CompteUtilisateur } from "../../domain/CompteUtilisateur"
import { CompteUtilisateurRepository } from "../../domain/ports/CompteUtilisateurRepository"
import { LUtilisateurNestPasConnecteError } from "../../domains/errors/LUtilisateurNestPasConnecteError"
import { AuthentificationService } from "../../domains/ports/AuthentificationService"

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
          callbackURL: `${config.baseUrl}/auth/${config.authenticatorStrategy}/callback`,
          prompt: "select_account"
        },
        this.handleSocialAuthCallback
      )
    )
  }

  async seConnecter(request: Request): Promise<CompteUtilisateur> {
    const callbackProfile = await this.authenticator.authenticate(config.authenticatorStrategy, request,
      {
        successRedirect: "/auth/new",
        failureRedirect: "/"
      })

    let compteUtilisateur = await this._compteUtilisateurRepository.recupererCompteUtilisateurParId(callbackProfile.id)
    if (!compteUtilisateur) {
      compteUtilisateur = await this._compteUtilisateurRepository.creerCompteUtilisateur(CompteUtilisateur.creerCompteUtilisateur(callbackProfile.id))
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
