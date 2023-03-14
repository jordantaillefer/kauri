import { DetailSeance } from "../../domain/DetailSeance"
import { DetailExercice } from "../../domain/DetailExercice"

export class DetailSeanceBuilder {
  private id: string = "idSeance"
  private nomSeance: string = "nomSeance"
  private listeDetailExercice: DetailExercice[] = []

  withId(id: string): DetailSeanceBuilder {
    this.id = id
    return this
  }

  withNomSeance(nomSeance: string): DetailSeanceBuilder {
    this.nomSeance = nomSeance
    return this
  }

  withListeDetailExercice(...listeDetailExercice: DetailExercice[]): DetailSeanceBuilder {
    this.listeDetailExercice = listeDetailExercice
    return this
  }

  build() {
    return DetailSeance.creerDetailSeance({
      id: this.id,
      nomSeance: this.nomSeance,
      listeDetailExercice: this.listeDetailExercice
    })
  }
}
