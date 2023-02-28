import { IdUtilisateur, Seance, IdSeance } from "../Seance"

export interface SeanceRepository {
  creerSeance: (seance: Seance) => Promise<void>

  recupererParId(idSeance: IdSeance): Promise<Seance>

  recupererTout(idUtilisateur: IdUtilisateur): Promise<Seance[]>
}