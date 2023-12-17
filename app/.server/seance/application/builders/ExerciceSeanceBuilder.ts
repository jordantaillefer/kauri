import { CATEGORIE } from "../../../exercice/domain/categorie"
import { ExerciceSeance } from "../../domain/ExerciceSeance"
import type { SerieExerciceSeance } from "../../domain/SerieExerciceSeance"

export class ExerciceSeanceBuilder {
  private id: string = "idExerciceSeance"
  private idSeance: string = "idSeance"
  private idExercice: string = "idExercice"
  private nomExercice: string = "nomExercice"
  private categorie: CATEGORIE = CATEGORIE.ABDOMINAUX
  private listeSerieExerciceSeance: SerieExerciceSeance[] = []
  private ordre: number = 0

  withId(id: string): ExerciceSeanceBuilder {
    this.id = id
    return this
  }

  withIdSeance(idSeance: string): ExerciceSeanceBuilder {
    this.idSeance = idSeance
    return this
  }

  withIdExercice(idExercice: string): ExerciceSeanceBuilder {
    this.idExercice = idExercice
    return this
  }

  withNomExercice(nomExercice: string): ExerciceSeanceBuilder {
    this.nomExercice = nomExercice
    return this
  }

  withCategorie(categorie: CATEGORIE): ExerciceSeanceBuilder {
    this.categorie = categorie
    return this
  }

  withListeSerieExerciceSeance(...listeSerieExerciceSeance: SerieExerciceSeance[]): ExerciceSeanceBuilder {
    this.listeSerieExerciceSeance = listeSerieExerciceSeance
    return this
    
  }

  withOrdre(ordre: number): ExerciceSeanceBuilder {
    this.ordre = ordre
    return this
  }

  build(): ExerciceSeance {
    return ExerciceSeance.creerExerciceSeance({
      id: this.id,
      idSeance: this.idSeance,
      idExercice: this.idExercice,
      nomExercice: this.nomExercice,
      categorie: this.categorie,
      ordre: this.ordre,
      listeSerieExerciceSeance: this.listeSerieExerciceSeance
    })
  }
}
