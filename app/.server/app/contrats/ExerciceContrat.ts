export interface ExerciceContrat {
  id: string
  nomExercice: string
  categorie: string
}

export type ListeExerciceContrat = { [key: string] : ExerciceContrat[] }
