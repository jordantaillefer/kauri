import { CATEGORIE } from "../../../exercice/domain/categorie"
import { ExerciceEntrainement } from "../../domain/ExerciceEntrainement"
import { SerieEntrainement } from "../../domain/SerieEntrainement"

export class ExerciceEntrainementBuilder {
  private id: string = "idExerciceEntrainement"
  private estRealise: boolean = false
  private tempsRepos: number = 45
  private nomExercice: string = "nomExercice"
  private categorie: CATEGORIE = CATEGORIE.ISCHIOJAMBIERS
  private listeSerieEntrainement: SerieEntrainement[] = []

  withId(id: string) {
    this.id = id
    return this
  }

  withEstRealise(estRealise: boolean) {
    this.estRealise = estRealise
    return this
  }

  withTempsRepos(tempsRepos: number) {
    this.tempsRepos = tempsRepos
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

  build(): ExerciceEntrainement {
    return ExerciceEntrainement.creerExerciceEntrainement({
      id: this.id,
      estRealise: this.estRealise,
      tempsRepos: this.tempsRepos,
      nomExercice: this.nomExercice,
      categorie: this.categorie,
      listeSerieEntrainement: this.listeSerieEntrainement
    })
  }
}
