import { SerieExerciceSeance } from "../../domain/SerieExerciceSeance"

export class SerieExerciceSeanceBuilder {
  private id: string = "idSerieExerciceSeance"
  private repetitions: number = 0

  withId(id: string): SerieExerciceSeanceBuilder {
    this.id = id
    return this
  }

  withRepetitions(repetitions: number): SerieExerciceSeanceBuilder {
    this.repetitions = repetitions
    return this
  }

  build(): SerieExerciceSeance {
    return SerieExerciceSeance.creerSerieExerciceSeance({
      id: this.id,
      repetitions: this.repetitions
    })
  }
}