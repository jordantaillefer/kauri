import { SerieExerciceSeance } from "../../domain/SerieExerciceSeance"

export class SerieExerciceSeanceBuilder {
  private id: string = "idSerieExerciceSeance"
  private repetitions: number = 12
  private tempsRepos: number = 45
  private ordre: number = 1

  withId(id: string): SerieExerciceSeanceBuilder {
    this.id = id
    return this
  }

  withRepetitions(repetitions: number): SerieExerciceSeanceBuilder {
    this.repetitions = repetitions
    return this
  }
  withTempsRepos(tempsRepos: number): SerieExerciceSeanceBuilder {
    this.tempsRepos = tempsRepos
    return this
  }

  withOrdre(ordre: number) {
    this.ordre = ordre
    return this
  }

  build(): SerieExerciceSeance {
    return SerieExerciceSeance.creerSerieExerciceSeance({
      id: this.id,
      repetitions: this.repetitions,
      tempsRepos: this.tempsRepos,
      ordre: this.ordre
    })
  }
}
