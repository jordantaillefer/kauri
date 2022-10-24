import { CompteUtilisateur } from "../../authentification/domain/CompteUtilisateur"

export class CompteUtilisateurBuilder {
  private id: string = "id"

  withId(id: string): CompteUtilisateurBuilder {
    this.id = id
    return this
  }

  build(): CompteUtilisateur {
    return CompteUtilisateur.creerCompteUtilisateur({ id: this.id })
  }
}