import { ExerciceSeance } from "../ExerciceSeance"

export interface ExerciceSeanceRepository {
  creerExerciceSeance: (exerciceSeance: ExerciceSeance) => Promise<void>

  recupererTout(): Promise<ExerciceSeance[]>

  recupererParIdSeanceEtParId(idExerciceSeance: string, idSeance: string): Promise<ExerciceSeance>
}
