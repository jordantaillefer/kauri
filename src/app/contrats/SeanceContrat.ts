import { CATEGORIE } from "../../exercice/domain/categorie"

export interface SerieExerciceSeanceContrat {
  repetitions: number
}

export interface ExerciceSeanceContrat {
  id: string
  idExercice: string
  nomExercice: string
  categorie: CATEGORIE
  ordre: number
  tempsRepos: number
  listeSerieExerciceSeance: SerieExerciceSeanceContrat[]
}

export interface SeanceContrat {
  id: string
  nomSeance: string,
  exerciceSeances: ExerciceSeanceContrat[]
}
