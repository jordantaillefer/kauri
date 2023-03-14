import { describe, expect, it } from "vitest"
import { mock, MockProxy } from "vitest-mock-extended"

import { CATEGORIE } from "../../../exercice/domain/categorie"
import { DetailExerciceBuilder } from "../../application/builders/DetailExerciceBuilder"
import { DetailSeanceBuilder } from "../../application/builders/DetailSeanceBuilder"
import { DetailSerieBuilder } from "../../application/builders/DetailSerieBuilder"
import { DetailSeance } from "../../domain/DetailSeance"
import {
  RecupererDetailParIdSeanceRepository,
  RecupererDetailSeanceUseCase
} from "../../usecases/RecupererDetailSeanceUseCase"

describe("RecupererDetailSeanceUseCase", () => {
  let recupererDetailSeanceUseCase: RecupererDetailSeanceUseCase
  let seanceRepository: MockProxy<RecupererDetailParIdSeanceRepository>

  beforeEach(() => {
    seanceRepository = mock<RecupererDetailParIdSeanceRepository>()
    recupererDetailSeanceUseCase = new RecupererDetailSeanceUseCase({ seanceRepository })

  })
  it("doit récupérer le détail d'une séance pour un utilisateur", async () => {
    // Arrange
    const idUtilisateur = "idUtilisateur"
    const idSeance = "idSeance"
    
    const detailSerie1 = new DetailSerieBuilder()
      .withId("idSerie 1")
      .withNombreRepetition(8)
      .build()
    const detailSerie2 = new DetailSerieBuilder()
      .withId("idSerie 2")
      .withNombreRepetition(10)
      .build()
    const detailSerie3 = new DetailSerieBuilder()
      .withId("idSerie 3")
      .withNombreRepetition(12)
      .build()

    const detailExercice1 = new DetailExerciceBuilder()
      .withId("idExercice 1")
      .withNomExercice("nomExercice 1")
      .withCategorie(CATEGORIE.ABDOMINAUX)
      .withListeDetailSerie(detailSerie1)
      .build()
    const detailExercice2 = new DetailExerciceBuilder()
      .withId("idExercice 2")
      .withNomExercice("nomExercice 2")
      .withCategorie(CATEGORIE.PECTORAUX)
      .withListeDetailSerie(detailSerie2, detailSerie3)
      .build()
    const detailSeance = new DetailSeanceBuilder()
      .withId("idSeance")
      .withNomSeance("nomSeance")
      .withListeDetailExercice(detailExercice1, detailExercice2)
      .build()

    seanceRepository.recupererDetailParId.mockResolvedValue(detailSeance)

    // Act
    const resultDetailSeance: DetailSeance = await recupererDetailSeanceUseCase.execute({
      idUtilisateur,
      idSeance
    })
    // Assert
    expect(resultDetailSeance.id).toEqual("idSeance")
    expect(resultDetailSeance.nomSeance).toEqual("nomSeance")
    expect(resultDetailSeance.listeDetailExercice).toHaveLength(2)
    expect(resultDetailSeance.listeDetailExercice.at(0)?.id).toEqual("idExercice 1")
    expect(resultDetailSeance.listeDetailExercice.at(0)?.categorie).toEqual("Abdominaux")
    expect(resultDetailSeance.listeDetailExercice.at(0)?.nomExercice).toEqual("nomExercice 1")
    expect(resultDetailSeance.listeDetailExercice.at(0)?.listeDetailSerie).toHaveLength(1)
    expect(resultDetailSeance.listeDetailExercice.at(0)?.listeDetailSerie.at(0)?.id).toEqual("idSerie 1")
    expect(resultDetailSeance.listeDetailExercice.at(0)?.listeDetailSerie.at(0)?.nombreRepetition).toEqual(8)
    expect(resultDetailSeance.listeDetailExercice.at(1)?.id).toEqual("idExercice 2")
    expect(resultDetailSeance.listeDetailExercice.at(1)?.categorie).toEqual("Pectoraux")
    expect(resultDetailSeance.listeDetailExercice.at(1)?.nomExercice).toEqual("nomExercice 2")
    expect(resultDetailSeance.listeDetailExercice.at(1)?.listeDetailSerie).toHaveLength(2)
    expect(resultDetailSeance.listeDetailExercice.at(1)?.listeDetailSerie.at(0)?.id).toEqual("idSerie 2")
    expect(resultDetailSeance.listeDetailExercice.at(1)?.listeDetailSerie.at(0)?.nombreRepetition).toEqual(10)
    expect(resultDetailSeance.listeDetailExercice.at(1)?.listeDetailSerie.at(1)?.id).toEqual("idSerie 3")
    expect(resultDetailSeance.listeDetailExercice.at(1)?.listeDetailSerie.at(1)?.nombreRepetition).toEqual(12)
  })
})
