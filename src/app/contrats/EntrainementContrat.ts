export interface SerieEntrainementContrat {
  id: string
  nombreRepetition: number
}

export interface ExerciceEntrainementContrat {
  id: string
  estRealise: boolean
  tempsRepos: number
  nomExercice: string
  categorie: string
  listeSerieEntrainement: SerieEntrainementContrat[]
}

export interface EntrainementContrat {
  listeExerciceEntrainement: ExerciceEntrainementContrat[]
  id: string
  nomSeance: string
}
