import { DetailSeance } from "../DetailSeance"
import { IdSeance, IdUtilisateur, Seance } from "../Seance"

export interface SeanceRepository {
  creerSeance: (seance: Seance) => Promise<void>

  recupererDetailParId: (idUtilisateur: string, idSeance: string) => Promise<DetailSeance>

  recupererParId(idSeance: IdSeance): Promise<Seance>

  recupererTout(idUtilisateur: IdUtilisateur): Promise<Seance[]>
}
