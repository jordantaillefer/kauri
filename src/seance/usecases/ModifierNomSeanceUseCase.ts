import { SeanceRepository } from "../domain/ports/SeanceRepository";

export class ModifierNomSeanceUseCase {
  private seanceRepository: SeanceRepository;

  constructor({ seanceRepository }: { seanceRepository: SeanceRepository }) {
    this.seanceRepository = seanceRepository;
  }

  async execute({ idSeance, nouveauNomSeance }: { idSeance: string; nouveauNomSeance: string }) {
    await this.seanceRepository.modifierNomSeance(idSeance, nouveauNomSeance);
  }
}
