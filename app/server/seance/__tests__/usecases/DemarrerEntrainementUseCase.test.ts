import { describe, expect, it } from "vitest"
import type { CaptorMatcher, MockProxy } from "vitest-mock-extended";
import { captor, mock } from "vitest-mock-extended"

import { CATEGORIE } from "../../../exercice/domain/categorie"
import { DetailExerciceBuilder } from "../../application/builders/DetailExerciceBuilder"
import { DetailSeanceBuilder } from "../../application/builders/DetailSeanceBuilder"
import { DetailSerieBuilder } from "../../application/builders/DetailSerieBuilder"
import type { Entrainement } from "../../domain/Entrainement"
import type {
  CreerEntrainementRepository,
  RecupererDetailSeanceParIdRepository
} from "../../usecases/DemarrerEntrainementUseCase";
import {
  DemarrerEntrainementUseCase
} from "../../usecases/DemarrerEntrainementUseCase"

describe("DemarrerEntrainementUseCase", () => {
  let demarrerEntrainementUseCase: DemarrerEntrainementUseCase
  let seanceRepository: MockProxy<RecupererDetailSeanceParIdRepository>
  let entrainementRepository: MockProxy<CreerEntrainementRepository>

  beforeEach(() => {
    seanceRepository = mock<RecupererDetailSeanceParIdRepository>()
    entrainementRepository = mock<CreerEntrainementRepository>()
    demarrerEntrainementUseCase = new DemarrerEntrainementUseCase({ seanceRepository, entrainementRepository })
  })
  it("doit créer un nouvel entrainement à partir d'une séance", async () => {
    // Arrange
    const idSeance = "idSeance"
    const idUtilisateur = "idUtilisateur"
    const sauvegarderCaptor: CaptorMatcher<Entrainement> = captor()

    const serieExerciceSeance1 = new DetailSerieBuilder()
      .withNombreRepetition(8)
      .withOrdre(1)
      .build()
    const serieExerciceSeance2 = new DetailSerieBuilder()
      .withNombreRepetition(10)
      .withOrdre(1)
      .build()
    const serieExerciceSeance3 = new DetailSerieBuilder()
      .withNombreRepetition(12)
      .withOrdre(2)
      .build()
    const exercice1 = new DetailExerciceBuilder()
      .withNomExercice("nomExercice 1")
      .withCategorie(CATEGORIE.PECTORAUX)
      .withOrdre(1)
      .withTempsRepos(45)
      .withListeDetailSerie(serieExerciceSeance1)
      .build()
    const exercice2 = new DetailExerciceBuilder()
      .withNomExercice("nomExercice 2")
      .withCategorie(CATEGORIE.ISCHIOJAMBIERS)
      .withOrdre(2)
      .withTempsRepos(55)
      .withListeDetailSerie(serieExerciceSeance2, serieExerciceSeance3)
      .build()
    const seance = new DetailSeanceBuilder()
      .withId("4b472a1c-72e9-4465-b2dc-b4dced658ad9")
      .withNomSeance("nomSeance 1")
      .withListeDetailExercice(exercice1, exercice2)
      .build()
    seanceRepository.recupererDetailParId.mockResolvedValue(seance)

    // Act
    const nouvelEntrainement = await demarrerEntrainementUseCase.execute({
      idSeance,
      idUtilisateur
    })

    // Assert
    expect(seanceRepository.recupererDetailParId).toHaveBeenCalledOnce()
    expect(entrainementRepository.creerEntrainement).toHaveBeenNthCalledWith(1, sauvegarderCaptor)

    expect(nouvelEntrainement.id).toBeDefined()
    expect(nouvelEntrainement.idUtilisateur).toEqual("idUtilisateur")
    expect(nouvelEntrainement.nomSeance).toEqual("nomSeance 1")
    expect(nouvelEntrainement.listeExerciceEntrainement).toHaveLength(2)
    expect(nouvelEntrainement.listeExerciceEntrainement.at(0)?.id).toBeDefined()
    expect(nouvelEntrainement.listeExerciceEntrainement.at(0)?.estRealise).toEqual(false)
    expect(nouvelEntrainement.listeExerciceEntrainement.at(0)?.tempsRepos).toEqual(45)
    expect(nouvelEntrainement.listeExerciceEntrainement.at(0)?.nomExercice).toEqual("nomExercice 1")
    expect(nouvelEntrainement.listeExerciceEntrainement.at(0)?.ordre).toEqual(1)
    expect(nouvelEntrainement.listeExerciceEntrainement.at(0)?.categorie).toEqual("Pectoraux")
    expect(nouvelEntrainement.listeExerciceEntrainement.at(0)?.listeSerieEntrainement).toHaveLength(1)
    expect(nouvelEntrainement.listeExerciceEntrainement.at(0)?.listeSerieEntrainement.at(0)?.id).toBeDefined()
    expect(nouvelEntrainement.listeExerciceEntrainement.at(0)?.listeSerieEntrainement.at(0)?.nombreRepetition).toEqual(8)
    expect(nouvelEntrainement.listeExerciceEntrainement.at(0)?.listeSerieEntrainement.at(0)?.ordre).toEqual(1)
    expect(nouvelEntrainement.listeExerciceEntrainement.at(0)?.listeSerieEntrainement.at(0)?.estRealise).toEqual(false)
    expect(nouvelEntrainement.listeExerciceEntrainement.at(1)?.id).toBeDefined()
    expect(nouvelEntrainement.listeExerciceEntrainement.at(1)?.estRealise).toEqual(false)
    expect(nouvelEntrainement.listeExerciceEntrainement.at(1)?.tempsRepos).toEqual(55)
    expect(nouvelEntrainement.listeExerciceEntrainement.at(1)?.nomExercice).toEqual("nomExercice 2")
    expect(nouvelEntrainement.listeExerciceEntrainement.at(1)?.ordre).toEqual(2)
    expect(nouvelEntrainement.listeExerciceEntrainement.at(1)?.categorie).toEqual("Ischio-jambiers")
    expect(nouvelEntrainement.listeExerciceEntrainement.at(1)?.listeSerieEntrainement).toHaveLength(2)
    expect(nouvelEntrainement.listeExerciceEntrainement.at(1)?.listeSerieEntrainement.at(0)?.id).toBeDefined()
    expect(nouvelEntrainement.listeExerciceEntrainement.at(1)?.listeSerieEntrainement.at(0)?.nombreRepetition).toEqual(10)
    expect(nouvelEntrainement.listeExerciceEntrainement.at(1)?.listeSerieEntrainement.at(0)?.ordre).toEqual(1)
    expect(nouvelEntrainement.listeExerciceEntrainement.at(1)?.listeSerieEntrainement.at(0)?.estRealise).toEqual(false)
    expect(nouvelEntrainement.listeExerciceEntrainement.at(1)?.listeSerieEntrainement.at(1)?.id).toBeDefined()
    expect(nouvelEntrainement.listeExerciceEntrainement.at(1)?.listeSerieEntrainement.at(1)?.nombreRepetition).toEqual(12)
    expect(nouvelEntrainement.listeExerciceEntrainement.at(1)?.listeSerieEntrainement.at(1)?.ordre).toEqual(2)
    expect(nouvelEntrainement.listeExerciceEntrainement.at(1)?.listeSerieEntrainement.at(0)?.estRealise).toEqual(false)
  })
})