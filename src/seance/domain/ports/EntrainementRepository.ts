import { Entrainement } from "../Entrainement"

export interface EntrainementRepository {
  creerEntrainement: (entrainement: Entrainement) => Promise<void>
  recupererParId(id: string): Promise<Entrainement>
}
