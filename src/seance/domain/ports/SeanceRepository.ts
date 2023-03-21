import { DetailSeance } from "../DetailSeance"
import { ExerciceSeance } from "../ExerciceSeance"
import { IdSeance, IdUtilisateur, Seance } from "../Seance"

export interface SeanceRepository {
  creerSeance: (seance: Seance) => Promise<void>

  recupererDetailParId: (idUtilisateur: string, idSeance: string) => Promise<DetailSeance>

  recupererParId(idSeance: IdSeance): Promise<Seance>

  recupererTout(idUtilisateur: IdUtilisateur): Promise<Seance[]>

  ajouterExerciceSeanceASeance(idSeance: string, exerciceAAjouter: ExerciceSeance): Promise<void>
}
