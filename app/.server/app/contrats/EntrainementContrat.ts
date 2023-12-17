export interface SerieEntrainementContrat {
  id: string
  repetitions: number
  poids: number
  tempsRepos: number
  ordre: number
  estRealise: boolean
}

export interface ExerciceEntrainementContrat {
  id: string
  estRealise: boolean
  nomExercice: string
  categorie: string
  ordre: number
  series: SerieEntrainementContrat[]
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
