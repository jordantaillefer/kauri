import { describe, expect, it } from "vitest"
import { mock, MockProxy } from "vitest-mock-extended"

import { EntrainementBuilder } from "../../application/EntrainementBuilder"
import { ExerciceEntrainementBuilder } from "../../application/builders/ExerciceEntrainementBuilder"
import { SerieEntrainementBuilder } from "../../application/builders/SerieEntrainementBuilder"
import {
  RecupererEntrainementUseCase,
  RecupererParIdEntrainementRepository
} from "../../usecases/RecupererEntrainementUseCase"

describe("RecupererEntrainementUseCase", () => {
  let entrainementRepository: MockProxy<RecupererParIdEntrainementRepository>
  let recupererEntrainementUseCase: RecupererEntrainementUseCase

  beforeEach(() => {
    entrainementRepository = mock<RecupererParIdEntrainementRepository>()
    recupererEntrainementUseCase = new RecupererEntrainementUseCase({ entrainementRepository })
  })

  it("doit récupérer l'entrainement", async () => {
    // Arrange
    const idUtilisateur = "idUtilisateur"
    const idSeance = "idUtilisateur"

    const serieEntrainement1 = new SerieEntrainementBuilder()
      .withId("c812e04e-f6c7-478d-bc37-19b7a5894de2")
      .build()
    const serieEntrainement2 = new SerieEntrainementBuilder()
      .withId("38e5ae21-7fee-427a-97b7-1f2ee7a02ef2")
      .build()
    const serieEntrainement3 = new SerieEntrainementBuilder()
      .withId("2d9cee66-ddd3-4cb1-94d9-b9bbea290032")
      .build()
    const exerciceSeance1 = new ExerciceEntrainementBuilder()
      .withId("2c9d1005-19ce-4289-95b1-e11d41cab187")
      .withListeSerieEntrainement(serieEntrainement1)
      .build()
    const exerciceSeance2 = new ExerciceEntrainementBuilder()
      .withId("79dd6cc5-d54a-4821-ac9a-709f42e87875")
      .withListeSerieEntrainement(serieEntrainement2, serieEntrainement3)
      .build()
    const entrainement = new EntrainementBuilder()
      .withId("070f4bbf-7a6b-4cb8-b14e-a03fac26b3e1")
      .withListeExerciceEntrainement(exerciceSeance1, exerciceSeance2)
      .build()

    entrainementRepository.recupererParId.mockResolvedValue(entrainement)
    // Act
    const entrainementResult = await recupererEntrainementUseCase.execute({
      idUtilisateur,
      idEntrainement: idSeance
    })
    // Assert
    expect(entrainementResult.id).toEqual("070f4bbf-7a6b-4cb8-b14e-a03fac26b3e1")
    expect(entrainementResult.listeExerciceEntrainement).toHaveLength(2)
    expect(entrainementResult.listeExerciceEntrainement.at(0)?.id).toEqual("2c9d1005-19ce-4289-95b1-e11d41cab187")
    expect(entrainementResult.listeExerciceEntrainement.at(1)?.id).toEqual("79dd6cc5-d54a-4821-ac9a-709f42e87875")
    expect(entrainementResult.listeExerciceEntrainement.at(1)?.listeSerieEntrainement.at(0)?.id).toEqual("38e5ae21-7fee-427a-97b7-1f2ee7a02ef2")
    expect(entrainementResult.listeExerciceEntrainement.at(1)?.listeSerieEntrainement.at(1)?.id).toEqual("2d9cee66-ddd3-4cb1-94d9-b9bbea290032")
  })
})
