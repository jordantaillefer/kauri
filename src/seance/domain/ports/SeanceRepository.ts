import { Seance } from "../Seance"

export interface SeanceRepository {
  creerSeance: (seance: Seance) => Promise<void>
}