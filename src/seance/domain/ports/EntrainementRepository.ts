import { Entrainement } from "../Entrainement"

export interface EntrainementRepository {
  creerEntrainement: (entrainement: Entrainement) => Promise<void>
  mettreAJourSerieEstRealise: (idSerie: string, estRealise: boolean) => Promise<void>

  recupererParId(id: string): Promise<Entrainement>
}
