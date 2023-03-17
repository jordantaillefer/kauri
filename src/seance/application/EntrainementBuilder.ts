import { Entrainement } from "../domain/Entrainement"
import { ExerciceEntrainement } from "../domain/ExerciceEntrainement"

export class EntrainementBuilder {
  private id: string = "idEntrainement"
  private nomSeance: string = "nomSeance"
  private listeExerciceEntrainement: ExerciceEntrainement[] = []

  withId(id: string) {
    this.id = id
    return this
  }

  withNomSeance(nomSeance: string) {
    this.nomSeance = nomSeance
    return this
  }

  withListeExerciceEntrainement(...listeExerciceEntrainement: ExerciceEntrainement[]) {
    this.listeExerciceEntrainement = listeExerciceEntrainement
    return this
  }

  build(): Entrainement {
    return Entrainement.creerEntrainement({
      id: this.id,
      nomSeance: this.nomSeance,
      listeExerciceEntrainement: this.listeExerciceEntrainement
    })
  }
}
