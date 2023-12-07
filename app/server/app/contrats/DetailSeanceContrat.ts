export interface DetailSerieContrat {
  repetitions: number
  poids: number
  tempsRepos: number
  ordre: number
}

export interface DetailExerciceContrat {
  id: string
  idExercice: string,
  nomExercice: string,
  categorie: string
  ordre: number
  series: DetailSerieContrat[]
}

export interface DetailSeanceContrat {
  id: string
  nomSeance: string
  exerciceSeances: DetailExerciceContrat[]
}
