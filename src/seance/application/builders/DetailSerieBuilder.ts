import { DetailSerie } from "../../domain/DetailSerie"

export class DetailSerieBuilder {
  private id: string = "idSerie"
  private nombreRepetition: number = 12

  withId(id: string): DetailSerieBuilder {
    this.id = id
    return this
  }

  withNombreRepetition(nombreRepetition: number): DetailSerieBuilder {
    this.nombreRepetition = nombreRepetition
    return this
  }

  build() {
    return DetailSerie.creerDetailSerie({ id: this.id, nombreRepetition: this.nombreRepetition })
  }
}
