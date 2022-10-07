import { CompteUtilisateur } from "../../authentification/infrastructure/domain/CompteUtilisateur"

export class CompteUtilisateurBuilder {
  private id: string = "id"

  withId(id: string): CompteUtilisateurBuilder {
    this.id = id
    return this
  }

  build(): CompteUtilisateur {
    return CompteUtilisateur.creerCompteUtilisateur(this.id)
  }
}