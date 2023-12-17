import { CATEGORIE } from "@/api/exercice/domain/categorie"
import { ExerciceEntrainement } from "../../domain/ExerciceEntrainement"
import type { SerieEntrainement } from "../../domain/SerieEntrainement"

export class ExerciceEntrainementBuilder {
  private id: string = "idExerciceEntrainement"
  private estRealise: boolean = false
  private nomExercice: string = "nomExercice"
  private categorie: CATEGORIE = CATEGORIE.ISCHIOJAMBIERS
  private listeSerieEntrainement: SerieEntrainement[] = []
  private ordre: number = 1

  withId(id: string) {
    this.id = id
    return this
  }

  withEstRealise(estRealise: boolean) {
    this.estRealise = estRealise
    return this
  }

  withNomExercice(nomExercice: string) {
    this.nomExercice = nomExercice
    return this
  }

  withCategorie(categorie: CATEGORIE) {
    this.categorie = categorie
    return this
  }

  withListeSerieEntrainement(...listeSerieEntrainement: SerieEntrainement[]) {
    this.listeSerieEntrainement = listeSerieEntrainement
    return this
  }

  withOrdre(ordre: number) {
    this.ordre = ordre
    return this
  }

  build(): ExerciceEntrainement {
    return ExerciceEntrainement.creerExerciceEntrainement({
      id: this.id,
      estRealise: this.estRealise,
      nomExercice: this.nomExercice,
      categorie: this.categorie,
      ordre: this.ordre,
      listeSerieEntrainement: this.listeSerieEntrainement
    })
  }
}
