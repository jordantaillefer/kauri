export interface DetailSerieContrat {
  repetitions: number
}

export interface DetailExerciceContrat {
  nomExercice: string,
  categorie: string
  series: DetailSerieContrat[]

}

export interface DetailSeanceContrat {
  id: string
  nomSeance: string
  exerciceSeances: DetailExerciceContrat[]
}
