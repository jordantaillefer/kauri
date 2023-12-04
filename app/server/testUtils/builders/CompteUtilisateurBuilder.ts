import { CompteUtilisateur } from "~/server/authentification/domain/CompteUtilisateur"

export class CompteUtilisateurBuilder {
  private id: string = "id"
  private nom: string = "nom"
  private prenom: string = "prenom"

  withId(id: string): CompteUtilisateurBuilder {
    this.id = id
    return this
  }
  withNom(nom: string): CompteUtilisateurBuilder {
    this.nom = nom
    return this
  }
  withPrenom(prenom: string): CompteUtilisateurBuilder {
    this.prenom = prenom
    return this
  }

  build(): CompteUtilisateur {
    return CompteUtilisateur.creerCompteUtilisateur({ id: this.id, nom: this.nom, prenom: this.prenom })
  }
}
