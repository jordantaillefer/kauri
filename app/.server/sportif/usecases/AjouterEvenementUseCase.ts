import { SportifEvenement } from "~/.server/sportif/domain/SportifEvenement"
import type { SportifRepository } from "~/.server/sportif/domain/ports/SportifRepository"

interface Dependencies {
  sportifRepository: SportifRepository
}

export class AjouterEvenementUseCase {
  private sportifRepository: SportifRepository

  constructor({ sportifRepository }: Dependencies) {
    this.sportifRepository = sportifRepository
  }

  async execute({
    idSeance,
    idUtilisateur,
    tempsEvenement
  }: {
    idSeance: string
    idUtilisateur: string
    tempsEvenement: string
  }): Promise<void> {
    const sportifEvenement = SportifEvenement.creerSportifEvenement({
      idSeance,
      idUtilisateur,
      tempsEvenement
    })

    await this.sportifRepository.ajouterEvenement(sportifEvenement)
  }
}
