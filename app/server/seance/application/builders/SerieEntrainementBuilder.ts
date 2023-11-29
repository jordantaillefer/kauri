import { SerieEntrainement } from "../../domain/SerieEntrainement"

export class SerieEntrainementBuilder {
  private id: string = "idSerieEntrainement"
  private nombreRepetition: number = 12
  private tempsRepos: number = 45
  private estRealise: boolean = false
  private ordre: number = 1

  withId(id: string) {
    this.id = id
    return this
  }

  withNombreRepetition(nombreRepetition: number) {
    this.nombreRepetition = nombreRepetition
    return this
  }

  withTempsRepos(tempsRepos: number) {
    this.tempsRepos = tempsRepos
    return this
  }

  withEstRealise(estRealise: boolean) {
    this.estRealise = estRealise
    return this
  }

  withOrdre(ordre: number) {
    this.ordre = ordre
    return this
  }

  build(): SerieEntrainement {
    return SerieEntrainement.creerSerieEntrainement({
      id: this.id,
      nombreRepetition: this.nombreRepetition,
      tempsRepos: this.tempsRepos,
      ordre: this.ordre,
      estRealise: this.estRealise
    })
  }
}
