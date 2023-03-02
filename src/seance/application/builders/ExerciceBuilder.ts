import { CATEGORIE } from "../../../exercice/domain/categorie"
import { Exercice } from "../../domain/Exercice"

export class ExerciceBuilder {
  private id: string = "idExercice"
  private nomExercice: string = "nomExercice"
  private categorie: CATEGORIE = CATEGORIE.BICEPS

  withId(id: string): ExerciceBuilder {
    this.id = id
    return this
  }

  withNomExercice(nomExercice: string): ExerciceBuilder {
    this.nomExercice = nomExercice
    return this
  }

  withCategorie(categorie: CATEGORIE): ExerciceBuilder {
    this.categorie = categorie
    return this
  }

  build() {
    return Exercice.creerExercice({ id: this.id, nomExercice: this.nomExercice, categorie: this.categorie })
  }
}