import { describe, beforeEach } from "vitest"
import type { SeanceRepository } from "@/api/seance/domain/ports/SeanceRepository";
import type { ExerciceSeanceRepository } from "@/api/seance/domain/ports/ExerciceSeanceRepository";
import type { MockProxy } from "vitest-mock-extended";
import { mock } from "vitest-mock-extended";
import { DupliquerSeanceUseCase } from "@/api/seance/usecases/DupliquerSeanceUseCase";
import { randomUUID } from "crypto";
import { DetailSeanceBuilder } from "@/api/seance/application/builders/DetailSeanceBuilder";
import { DetailExerciceBuilder } from "@/api/seance/application/builders/DetailExerciceBuilder";

// define your tests
describe('DupliquerSeanceUseCase Tests', () => {

  let seanceRepository: MockProxy<SeanceRepository>;
  let exerciceSeanceRepository: MockProxy<ExerciceSeanceRepository>;
  let dupliquerSeanceUseCase: DupliquerSeanceUseCase;

  // initialize before tests
  beforeEach(() => {
    // Add mock initialization for repos here
    seanceRepository = mock<SeanceRepository>()
    exerciceSeanceRepository = mock<ExerciceSeanceRepository>()
    dupliquerSeanceUseCase = new DupliquerSeanceUseCase({ seanceRepository, exerciceSeanceRepository });
  });

  test('execute method should successfully execute and return duplicated Seance', async () => {

    // Given
    const uuidSeance = randomUUID();
    const uuidUtilisateur = randomUUID();

    const exerciceSeance1 = new DetailExerciceBuilder()
      .withId(randomUUID())
      .withOrdre(1)
      .build()
    const seance = new DetailSeanceBuilder()
      .withId(uuidSeance)
      .withNomSeance("nom seance 1")
      .withListeDetailExercice(exerciceSeance1)
      .build()
    seanceRepository.recupererDetailParId.mockResolvedValue(seance)

    // When
    await dupliquerSeanceUseCase.execute({ idSeance: uuidSeance, idUtilisateur: uuidUtilisateur });

    expect(seanceRepository.recupererDetailParId).toHaveBeenCalled()
    expect(seanceRepository.creerSeance).toHaveBeenCalled()
    expect(exerciceSeanceRepository.creerExerciceSeance).toHaveBeenCalled()
  });
});

