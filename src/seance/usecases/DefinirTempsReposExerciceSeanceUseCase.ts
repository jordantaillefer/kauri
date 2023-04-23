import { ExerciceSeanceRepository } from "../domain/ports/ExerciceSeanceRepository";

interface Dependencies {
  exerciceSeanceRepository: ExerciceSeanceRepository;
}

export class DefinirTempsReposExerciceSeanceUseCase {
  private exerciceSeanceRepository: ExerciceSeanceRepository;

  constructor({ exerciceSeanceRepository }: Dependencies) {
    this.exerciceSeanceRepository = exerciceSeanceRepository;
  }

  async execute({ idExerciceSeance, tempsRepos }: { idExerciceSeance: string, tempsRepos: number }) {
    await this.exerciceSeanceRepository.mettreAJourTempsRepos(idExerciceSeance, tempsRepos);
  }
}
