import { randomUUID } from "crypto"

import { SportifEvenement } from "~/server/sportif/domain/SportifEvenement"

export class SportifEvenementBuilder {
  private id: string = randomUUID()
  private tempsEvenement: string = "10:45"
  private idUtilisateur: string = randomUUID()
  private idSeance: string = randomUUID()

  withId(id: string): SportifEvenementBuilder {
    this.id = id
    return this
  }

  withTempsEvenement(tempsEvenement: string): SportifEvenementBuilder {
    this.tempsEvenement = tempsEvenement
    return this
  }

  withIdUtilisateur(idUtilisateur: string): SportifEvenementBuilder {
    this.idUtilisateur = idUtilisateur
    return this
  }

  withIdSeance(idSeance: string): SportifEvenementBuilder {
    this.idSeance = idSeance
    return this
  }

  build(): SportifEvenement {
    return SportifEvenement.creerSportifEvenement({
      id: this.id,
      idSeance: this.idSeance,
      idUtilisateur: this.idUtilisateur,
      tempsEvenement: this.tempsEvenement
    })
  }
}
