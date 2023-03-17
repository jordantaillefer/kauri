import { SerieEntrainement } from "../../domain/SerieEntrainement"

export class SerieEntrainementBuilder {
  private id: string = "idSerieEntrainement"
  private nombreRepetition: number = 12
  private estRealise: boolean = false

  withId(id: string) {
    this.id = id
    return this
  }

  withNombreRepetition(nombreRepetition: number) {
    this.nombreRepetition = nombreRepetition
    return this
  }

  withEstRealise(estRealise: boolean) {
    this.estRealise = estRealise
    return this
  }

  build(): SerieEntrainement {
    return SerieEntrainement.creerSerieEntrainement({
      id: this.id,
      nombreRepetition: this.nombreRepetition,
      estRealise: this.estRealise
    })
  }
}
