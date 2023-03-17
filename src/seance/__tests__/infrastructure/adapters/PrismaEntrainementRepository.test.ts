import { describe, expect, it } from "vitest"

import { CATEGORIE } from "../../../../exercice/domain/categorie"
import { EntrainementBuilder } from "../../../application/EntrainementBuilder"
import { ExerciceEntrainementBuilder } from "../../../application/builders/ExerciceEntrainementBuilder"
import { SerieEntrainementBuilder } from "../../../application/builders/SerieEntrainementBuilder"
import { PrismaEntrainementRepository } from "../../../infrastructure/adapters/PrismaEntrainementRepository"

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
})
