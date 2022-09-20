import { Request } from "express"
import { VerifyCallback } from "passport-google-oauth2"
import { CreerCompteUtilisateurUseCase } from "../../usecases/CreerCompteUtilisateurUseCase"

export class AuthentificationHandler {
  private _creerCompteUtilisateurUseCase: CreerCompteUtilisateurUseCase

  constructor(creerCompteUtilisateurUseCase: CreerCompteUtilisateurUseCase) {
    this._creerCompteUtilisateurUseCase = creerCompteUtilisateurUseCase
  }


  async handle(request: Request, accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    const user = await this._creerCompteUtilisateurUseCase.execute(profile.id)
    return done(null, user)
  }
}