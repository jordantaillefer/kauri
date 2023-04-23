import { ExerciceSeance } from "../ExerciceSeance"

export interface ExerciceSeanceRepository {
  mettreAJourTempsRepos(idExerciceSeance: string, tempsRepos: number): Promise<void>

  creerExerciceSeance(exerciceSeance: ExerciceSeance): Promise<void>

  ajouterSerieExerciceSeance(exerciceSeance: ExerciceSeance): Promise<void>

  supprimerSerieExerciceSeance(idExerciceSeance: string): Promise<void>

  recupererTout(): Promise<ExerciceSeance[]>

  recupererParIdSeanceEtParId(idSeance: string, idExerciceSeance: string): Promise<ExerciceSeance>
}
