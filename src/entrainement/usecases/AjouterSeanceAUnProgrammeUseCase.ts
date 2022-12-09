import { SeanceEntrainement } from "../domain/SeanceEntrainement"
import { ProgrammeRepository } from "../domain/ports/ProgrammeRepository"
import { SeanceEntrainementRepository } from "../domain/ports/SeanceEntrainementRepository"

interface Dependencies {
  programmeRepository: ProgrammeRepository,
  seanceEntrainementRepository: SeanceEntrainementRepository
}

export class AjouterSeanceAUnProgrammeUseCase {
  private seanceEntrainementRepository: SeanceEntrainementRepository
  private programmeRepository: ProgrammeRepository

  constructor({ programmeRepository, seanceEntrainementRepository }: Dependencies) {
    this.programmeRepository = programmeRepository
    this.seanceEntrainementRepository = seanceEntrainementRepository
  }

  async execute(idUtilisateur: string, idProgramme: string): Promise<SeanceEntrainement> {
    await this.programmeRepository.recupererParIdPourLUtilisateur(idUtilisateur, idProgramme)
    const nouvelleSeanceEntrainement = SeanceEntrainement.creerSeanceEntrainement()
    await this.seanceEntrainementRepository.creerSeanceEntrainement(idProgramme, nouvelleSeanceEntrainement)
    return nouvelleSeanceEntrainement
  }
}