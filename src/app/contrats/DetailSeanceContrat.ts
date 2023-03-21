export interface DetailSerieContrat {
  repetitions: number
}

export interface DetailExerciceContrat {
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
