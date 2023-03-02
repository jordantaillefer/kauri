import { CATEGORIE } from "../../exercice/domain/categorie"

export interface ExerciceSeanceContrat {
  id: string
  idExercice: string
  nomExercice: string
  categorie: CATEGORIE
}

export interface SeanceContrat {
  id: string
  nomSeance: string,
  exerciceSeances: ExerciceSeanceContrat[]
}