import type { ExerciceSeanceRepository } from "../domain/ports/ExerciceSeanceRepository";

export class SupprimerExerciceSeanceUseCase {
  private exerciceSeanceRepository: ExerciceSeanceRepository;

  constructor({ exerciceSeanceRepository }: { exerciceSeanceRepository: ExerciceSeanceRepository }) {
    this.exerciceSeanceRepository = exerciceSeanceRepository;
  }

  async execute({ idExerciceSeance }: { idExerciceSeance: string }) {
    await this.exerciceSeanceRepository.supprimerExerciceSeance(idExerciceSeance);
  }
}
