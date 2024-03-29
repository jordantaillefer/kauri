import { DetailSerie } from "../../domain/DetailSerie"

export class DetailSerieBuilder {
  private id: string = "idSerie"
  private nombreRepetition: number = 12
  private tempsRepos: number = 45
  private poids: number = 20
  private ordre: number = 1

  withId(id: string): DetailSerieBuilder {
    this.id = id
    return this
  }

  withNombreRepetition(nombreRepetition: number): DetailSerieBuilder {
    this.nombreRepetition = nombreRepetition
    return this
  }

  withTempsRepos(tempsRepos: number): DetailSerieBuilder {
    this.tempsRepos = tempsRepos
    return this
  }

  withOrdre(ordre: number) {
    this.ordre = ordre
    return this
  }

  withPoids(poids: number) {
    this.poids = poids
    return this
  }

  build() {
    return DetailSerie.creerDetailSerie({ id: this.id, nombreRepetition: this.nombreRepetition, poids: this.poids, tempsRepos: this.tempsRepos, ordre: this.ordre })
  }
}
