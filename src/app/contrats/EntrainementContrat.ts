export interface SerieEntrainementContrat {
  id: string
  nombreRepetition: number
  ordre: number
  estRealise: boolean
}

export interface ExerciceEntrainementContrat {
  id: string
  estRealise: boolean
  tempsRepos: number
  nomExercice: string
  categorie: string
  ordre: number
  listeSerieEntrainement: SerieEntrainementContrat[]
}

export interface EntrainementContrat {
  id: string
  nomSeance: string
}
export interface DetailEntrainementContrat {
  listeExerciceEntrainement: ExerciceEntrainementContrat[]
  id: string
  nomSeance: string
}
