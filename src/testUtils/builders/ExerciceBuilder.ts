import { Exercice } from "../../exercice/domain/Exercice"
import { CATEGORIE } from "../../exercice/domain/categorie"

export class ExerciceBuilder {
  private id: string = "id"
  private nomExercice: string = "nomExercice"
  private categorie: CATEGORIE = CATEGORIE.PECTORAUX

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

  build(): Exercice {
    return Exercice.creerExercice({ id: this.id, nomExercice: this.nomExercice, categorie: this.categorie })
  }
}