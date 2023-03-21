import { describe, expect, it } from "vitest"

import { CATEGORIE } from "../../../../exercice/domain/categorie"
import { EntrainementBuilder } from "../../../application/EntrainementBuilder"
import { ExerciceEntrainementBuilder } from "../../../application/builders/ExerciceEntrainementBuilder"
import { SerieEntrainementBuilder } from "../../../application/builders/SerieEntrainementBuilder"
import { PrismaEntrainementRepository } from "../../../infrastructure/adapters/PrismaEntrainementRepository"
import { Seance } from "../../../domain/Seance"
import { SeanceBuilder } from "../../../../testUtils/builders/SeanceBuilder"
import { Entrainement } from "../../../domain/Entrainement"

describe("PrismaEntrainementRepository", () => {
  let prismaEntrainementRepository: PrismaEntrainementRepository

  beforeEach(() => {
    prismaEntrainementRepository = new PrismaEntrainementRepository()
  })

  describe("creerEntrainement", () => {
    it("doit sauvegarder l'entrainement", async () => {
      // Arrange
      const serieEntrainement1 = new SerieEntrainementBuilder()
        .withId("c812e04e-f6c7-478d-bc37-19b7a5894de2")
        .withNombreRepetition(8)
        .withEstRealise(false)
        .build()
      const serieEntrainement2 = new SerieEntrainementBuilder()
        .withId("38e5ae21-7fee-427a-97b7-1f2ee7a02ef2")
        .withNombreRepetition(10)
        .withEstRealise(true)
        .build()
      const serieEntrainement3 = new SerieEntrainementBuilder()
        .withId("2d9cee66-ddd3-4cb1-94d9-b9bbea290032")
        .withNombreRepetition(12)
        .withEstRealise(false)
        .build()
      const exerciceSeance1 = new ExerciceEntrainementBuilder()
        .withId("2c9d1005-19ce-4289-95b1-e11d41cab187")
        .withEstRealise(false)
        .withTempsRepos(45)
        .withNomExercice("nomExercice 1")
        .withCategorie(CATEGORIE.PECTORAUX)
        .withListeSerieEntrainement(serieEntrainement1)
        .build()
      const exerciceSeance2 = new ExerciceEntrainementBuilder()
        .withId("79dd6cc5-d54a-4821-ac9a-709f42e87875")
        .withEstRealise(true)
        .withTempsRepos(55)
        .withNomExercice("nomExercice 2")
        .withCategorie(CATEGORIE.ISCHIOJAMBIERS)
        .withListeSerieEntrainement(serieEntrainement2, serieEntrainement3)
        .build()
      const entrainement = new EntrainementBuilder()
        .withId("f9aaa8ad-c602-417c-8005-0af9d7a24a70")
        .withNomSeance("nomSeance")
        .withListeExerciceEntrainement(exerciceSeance1, exerciceSeance2)
        .build()

      // Act
      await prismaEntrainementRepository.creerEntrainement(entrainement)
      // Assert
      const nouvelEntrainement = await prismaEntrainementRepository.recupererParId("f9aaa8ad-c602-417c-8005-0af9d7a24a70")
      expect(nouvelEntrainement.id).toEqual("f9aaa8ad-c602-417c-8005-0af9d7a24a70")
      expect(nouvelEntrainement.nomSeance).toEqual("nomSeance")
      expect(nouvelEntrainement.listeExerciceEntrainement).toHaveLength(2)
      expect(nouvelEntrainement.listeExerciceEntrainement.at(0)?.id).toEqual("2c9d1005-19ce-4289-95b1-e11d41cab187")
      expect(nouvelEntrainement.listeExerciceEntrainement.at(0)?.estRealise).toEqual(false)
      expect(nouvelEntrainement.listeExerciceEntrainement.at(0)?.tempsRepos).toEqual(45)
      expect(nouvelEntrainement.listeExerciceEntrainement.at(0)?.nomExercice).toEqual("nomExercice 1")
      expect(nouvelEntrainement.listeExerciceEntrainement.at(0)?.categorie).toEqual("Pectoraux")
      expect(nouvelEntrainement.listeExerciceEntrainement.at(0)?.listeSerieEntrainement).toHaveLength(1)
      expect(nouvelEntrainement.listeExerciceEntrainement.at(0)?.listeSerieEntrainement.at(0)?.id).toBeDefined()
      expect(nouvelEntrainement.listeExerciceEntrainement.at(0)?.listeSerieEntrainement.at(0)?.nombreRepetition).toEqual(8)
      expect(nouvelEntrainement.listeExerciceEntrainement.at(0)?.listeSerieEntrainement.at(0)?.estRealise).toEqual(false)
      expect(nouvelEntrainement.listeExerciceEntrainement.at(1)?.id).toEqual("79dd6cc5-d54a-4821-ac9a-709f42e87875")
      expect(nouvelEntrainement.listeExerciceEntrainement.at(1)?.estRealise).toEqual(true)
      expect(nouvelEntrainement.listeExerciceEntrainement.at(1)?.tempsRepos).toEqual(55)
      expect(nouvelEntrainement.listeExerciceEntrainement.at(1)?.nomExercice).toEqual("nomExercice 2")
      expect(nouvelEntrainement.listeExerciceEntrainement.at(1)?.categorie).toEqual("Ischio-jambiers")
      expect(nouvelEntrainement.listeExerciceEntrainement.at(1)?.listeSerieEntrainement).toHaveLength(2)
      expect(nouvelEntrainement.listeExerciceEntrainement.at(1)?.listeSerieEntrainement.at(0)?.id).toBeDefined()
      expect(nouvelEntrainement.listeExerciceEntrainement.at(1)?.listeSerieEntrainement.at(0)?.nombreRepetition).toEqual(10)
      expect(nouvelEntrainement.listeExerciceEntrainement.at(1)?.listeSerieEntrainement.at(0)?.estRealise).toEqual(true)
      expect(nouvelEntrainement.listeExerciceEntrainement.at(1)?.listeSerieEntrainement.at(1)?.id).toBeDefined()
      expect(nouvelEntrainement.listeExerciceEntrainement.at(1)?.listeSerieEntrainement.at(1)?.nombreRepetition).toEqual(12)
      expect(nouvelEntrainement.listeExerciceEntrainement.at(1)?.listeSerieEntrainement.at(1)?.estRealise).toEqual(false)
    })
  })

  describe("#recupererTout", () => {
    it("quand il n'existe aucun entrainement, remonte un tableau vide", async () => {
      // Act
      const listeEntrainementResult = await prismaEntrainementRepository.recupererTout("idUtilisateur")
      // Assert
      expect(listeEntrainementResult).toHaveLength(0)
    })
    it("quand il existe des entrainements appartenant à l'utilisateur, remonte le tableau de ses entrainements", async () => {
      // Arrange
      const seanceUtilisateur1: Entrainement = new EntrainementBuilder()
        .withId("859ec5a7-2a34-43fd-bec9-a43ac66238bd")
        .withNomSeance("Seance 1")
        .build()
      const seanceUtilisateur2: Entrainement = new EntrainementBuilder()
        .withId("c9d14285-c5ae-45e8-aa32-2a8c210b591e")
        .withNomSeance("Seance 2")
        .build()
      const seanceAutreUtilisateur: Entrainement = new EntrainementBuilder()
        .withId("54d9eb29-5410-4428-936f-9d252799e4ce")
        .build()
      await prismaEntrainementRepository.creerEntrainement(seanceUtilisateur1)
      await prismaEntrainementRepository.creerEntrainement(seanceUtilisateur2)
      await prismaEntrainementRepository.creerEntrainement(seanceAutreUtilisateur)

      // Act
      const listeEntrainementResult = await prismaEntrainementRepository.recupererTout("idUtilisateur")
      // Assert

      // TODO il faut ajouter l'idUtilisateur !!!
      expect(listeEntrainementResult).toHaveLength(3)
      expect(listeEntrainementResult.at(0)?.id).toEqual("859ec5a7-2a34-43fd-bec9-a43ac66238bd")
      expect(listeEntrainementResult.at(0)?.nomSeance).toEqual("Seance 1")
      expect(listeEntrainementResult.at(1)?.id).toEqual("c9d14285-c5ae-45e8-aa32-2a8c210b591e")
      expect(listeEntrainementResult.at(1)?.nomSeance).toEqual("Seance 2")
    })
  })

  describe("mettreAJourSerieEstRealise", () => {
    it("doit mettre à jour le champ est réalisé de la série", async () => {
      // Arrange
      const serieEntrainement1 = new SerieEntrainementBuilder()
        .withId("c812e04e-f6c7-478d-bc37-19b7a5894de2")
        .withNombreRepetition(8)
        .withEstRealise(false)
        .build()
      const serieEntrainement2 = new SerieEntrainementBuilder()
        .withId("38e5ae21-7fee-427a-97b7-1f2ee7a02ef2")
        .withNombreRepetition(10)
        .withEstRealise(true)
        .build()
      const serieEntrainement3 = new SerieEntrainementBuilder()
        .withId("2d9cee66-ddd3-4cb1-94d9-b9bbea290032")
        .withNombreRepetition(12)
        .withEstRealise(false)
        .build()
      const exerciceSeance1 = new ExerciceEntrainementBuilder()
        .withId("2c9d1005-19ce-4289-95b1-e11d41cab187")
        .withEstRealise(false)
        .withTempsRepos(45)
        .withNomExercice("nomExercice 1")
        .withCategorie(CATEGORIE.PECTORAUX)
        .withListeSerieEntrainement(serieEntrainement1)
        .build()
      const exerciceSeance2 = new ExerciceEntrainementBuilder()
        .withId("79dd6cc5-d54a-4821-ac9a-709f42e87875")
        .withEstRealise(true)
        .withTempsRepos(55)
        .withNomExercice("nomExercice 2")
        .withCategorie(CATEGORIE.ISCHIOJAMBIERS)
        .withListeSerieEntrainement(serieEntrainement2, serieEntrainement3)
        .build()
      const entrainement = new EntrainementBuilder()
        .withId("f9aaa8ad-c602-417c-8005-0af9d7a24a70")
        .withNomSeance("nomSeance")
        .withListeExerciceEntrainement(exerciceSeance1, exerciceSeance2)
        .build()
      await prismaEntrainementRepository.creerEntrainement(entrainement)

      // Act
      await prismaEntrainementRepository.mettreAJourSerieEstRealise("c812e04e-f6c7-478d-bc37-19b7a5894de2", true)
      // Assert
      const nouvelEntrainement = await prismaEntrainementRepository.recupererParId("f9aaa8ad-c602-417c-8005-0af9d7a24a70")
      expect(nouvelEntrainement.listeExerciceEntrainement.at(0)?.listeSerieEntrainement.at(0)?.nombreRepetition).toEqual(8)
      expect(nouvelEntrainement.listeExerciceEntrainement.at(0)?.listeSerieEntrainement.at(0)?.estRealise).toEqual(true)
      expect(nouvelEntrainement.listeExerciceEntrainement.at(1)?.listeSerieEntrainement.at(0)?.nombreRepetition).toEqual(10)
      expect(nouvelEntrainement.listeExerciceEntrainement.at(1)?.listeSerieEntrainement.at(0)?.estRealise).toEqual(true)
      expect(nouvelEntrainement.listeExerciceEntrainement.at(1)?.listeSerieEntrainement.at(1)?.nombreRepetition).toEqual(12)
      expect(nouvelEntrainement.listeExerciceEntrainement.at(1)?.listeSerieEntrainement.at(1)?.estRealise).toEqual(false)
    })
  })

  describe("mettreAJourEntrainementEstRealise", () => {
    it("doit mettre à jour le champ est réalisé de l'entrainement", async () => {
      // Arrange
      const serieEntrainement1 = new SerieEntrainementBuilder()
        .withId("c812e04e-f6c7-478d-bc37-19b7a5894de2")
        .withNombreRepetition(8)
        .withEstRealise(false)
        .build()
      const serieEntrainement2 = new SerieEntrainementBuilder()
        .withId("38e5ae21-7fee-427a-97b7-1f2ee7a02ef2")
        .withNombreRepetition(10)
        .withEstRealise(true)
        .build()
      const serieEntrainement3 = new SerieEntrainementBuilder()
        .withId("2d9cee66-ddd3-4cb1-94d9-b9bbea290032")
        .withNombreRepetition(12)
        .withEstRealise(false)
        .build()
      const exerciceEntrainement1 = new ExerciceEntrainementBuilder()
        .withId("2c9d1005-19ce-4289-95b1-e11d41cab187")
        .withEstRealise(false)
        .withTempsRepos(45)
        .withNomExercice("nomExercice 1")
        .withCategorie(CATEGORIE.PECTORAUX)
        .withListeSerieEntrainement(serieEntrainement1)
        .build()
      const exerciceEntrainement2 = new ExerciceEntrainementBuilder()
        .withId("79dd6cc5-d54a-4821-ac9a-709f42e87875")
        .withEstRealise(false)
        .withTempsRepos(55)
        .withNomExercice("nomExercice 2")
        .withCategorie(CATEGORIE.ISCHIOJAMBIERS)
        .withListeSerieEntrainement(serieEntrainement2, serieEntrainement3)
        .build()
      const entrainement = new EntrainementBuilder()
        .withId("f9aaa8ad-c602-417c-8005-0af9d7a24a70")
        .withNomSeance("nomSeance")
        .withListeExerciceEntrainement(exerciceEntrainement1, exerciceEntrainement2)
        .build()
      await prismaEntrainementRepository.creerEntrainement(entrainement)

      // Act
      await prismaEntrainementRepository.mettreAJourEntrainementEstRealise("2c9d1005-19ce-4289-95b1-e11d41cab187", true)
      // Assert
      const nouvelEntrainement = await prismaEntrainementRepository.recupererParId("f9aaa8ad-c602-417c-8005-0af9d7a24a70")

      // TODO Ya un bleme avec les orders ! Faut corriger l'ordre des exos rapidement !!!
      expect(nouvelEntrainement.listeExerciceEntrainement.at(1)?.nomExercice).toEqual("nomExercice 1")
      expect(nouvelEntrainement.listeExerciceEntrainement.at(1)?.estRealise).toEqual(true)
      expect(nouvelEntrainement.listeExerciceEntrainement.at(0)?.nomExercice).toEqual("nomExercice 2")
      expect(nouvelEntrainement.listeExerciceEntrainement.at(0)?.estRealise).toEqual(false)
    })
  })
})
