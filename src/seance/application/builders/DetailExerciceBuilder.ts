import { CATEGORIE } from "../../../exercice/domain/categorie"
import { DetailExercice } from "../../domain/DetailExercice"
import { DetailSerie } from "../../domain/DetailSerie"

export class DetailExerciceBuilder {
  private id: string = "idExercice"
  private nomExercice: string = "nomExercice"
  private listeDetailSerie: DetailSerie[] = []
  private categorie: CATEGORIE = CATEGORIE.ABDOMINAUX
  private ordre: number = 1

  withId(id: string): DetailExerciceBuilder {
    this.id = id
    return this
  }

  withNomExercice(nomExercice: string): DetailExerciceBuilder {
    this.nomExercice = nomExercice
    return this
  }

  withListeDetailSerie(...listeDetailSerie: DetailSerie[]): DetailExerciceBuilder {
    this.listeDetailSerie = listeDetailSerie
    return this
  }

  withCategorie(categorie: CATEGORIE): DetailExerciceBuilder {
    this.categorie = categorie
    return this
  }

  withOrdre(ordre: number) {
    this.ordre = ordre
    return this
  }

  build() {
    return DetailExercice.creerDetailExercice({
      id: this.id,
      nomExercice: this.nomExercice,
      categorie: this.categorie,
      ordre: this.ordre,
      listeDetailSerie: this.listeDetailSerie
    })
  }
}
