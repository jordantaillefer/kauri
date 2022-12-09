import { SeanceEntrainement } from "../SeanceEntrainement"

export interface SeanceEntrainementRepository {
  creerSeanceEntrainement(idProgramme: string, seanceEntrainement: SeanceEntrainement): Promise<void>

  recupererToutParIdProgramme(idProgramme: string): Promise<SeanceEntrainement[]>
  supprimerSeanceEntrainement(idSeanceEntrainement: string): Promise<void>
}