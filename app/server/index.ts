import type { AwilixContainer} from "awilix";
import { asClass, createContainer } from "awilix"

import { SessionManager } from "./app/session.server"
import type { AuthentificationService } from "./authentification/domain/ports/AuthentificationService"
import type { CompteUtilisateurRepository } from "./authentification/domain/ports/CompteUtilisateurRepository"
import { GoogleAuthentificatorService } from "./authentification/infrastructure/adapters/GoogleAuthentificatorService"
import { PrismaCompteUtilisateurRepository } from "./authentification/infrastructure/adapters/PrismaCompteUtilisateurRepository"
import { CompteUtilisateurController } from "./authentification/infrastructure/controllers/CompteUtilisateurController"
import { CreerCompteUtilisateurUseCase } from "./authentification/usecases/CreerCompteUtilisateurUseCase"
import { RecupererCompteUtilisateurConnecteUseCase } from "./authentification/usecases/RecupererCompteUtilisateurConnecteUseCase"
import { RecupererCompteUtilisateurUseCase } from "./authentification/usecases/RecupererCompteUtilisateurUseCase"
import { SeConnecterUseCase } from "./authentification/usecases/SeConnecterUseCase"
import { SeDeconnecterUseCase } from "./authentification/usecases/SeDeconnecterUseCase"
import type { ExerciceRepository } from "./exercice/domain/ports/ExerciceRepository"
import { PrismaExerciceRepository } from "./exercice/infrastructure/adapters/PrismaExerciceRepository"
import type { EntrainementRepository } from "./seance/domain/ports/EntrainementRepository"
import type { ExerciceSeanceRepository } from "./seance/domain/ports/ExerciceSeanceRepository"
import type { SeanceExerciceRepository } from "./seance/domain/ports/SeanceExerciceRepository"
import type { SeanceRepository } from "./seance/domain/ports/SeanceRepository"
import { PrismaEntrainementRepository } from "./seance/infrastructure/adapters/PrismaEntrainementRepository"
import { PrismaExerciceSeanceRepository } from "./seance/infrastructure/adapters/PrismaExerciceSeanceRepository"
import { PrismaSeanceExerciceRepository } from "./seance/infrastructure/adapters/PrismaSeanceExerciceRepository"
import { PrismaSeanceRepository } from "./seance/infrastructure/adapters/PrismaSeanceRepository"
import { EntrainementController } from "./seance/infrastructure/controllers/EntrainementController"
import { ExerciceSeanceController } from "./seance/infrastructure/controllers/ExerciceSeanceController"
import { SeanceController } from "./seance/infrastructure/controllers/SeanceController"
import { DemarrerEntrainementUseCase } from "./seance/usecases/DemarrerEntrainementUseCase"
import { InitialiserExerciceSeanceUseCase } from "./seance/usecases/InitialiserExerciceSeanceUseCase"
import { InitialiserSeanceUseCase } from "./seance/usecases/InitialiserSeanceUseCase"
import { ModifierNomSeanceUseCase } from "./seance/usecases/ModifierNomSeanceUseCase"
import { RealiserSerieUseCase } from "./seance/usecases/RealiserSerieUseCase"
import { ExerciceQuery } from "~/server/exercice/infrastructure/query/ExerciceQuery"
import { EntrainementQuery } from "~/server/seance/infrastructure/queries/EntrainementQuery"
import { SeanceQuery } from "~/server/seance/infrastructure/queries/SeanceQuery"
import type { SportifRepository } from "~/server/sportif/domain/ports/SportifRepository";
import { PrismaSportifRepository } from "~/server/sportif/infrastructure/adapters/PrismaSportifRepository";
import { SportifController } from "~/server/sportif/infrastructure/controllers/SportifController"
import { SportifQuery } from "~/server/sportif/infrastructure/queries/SportifQuery"
import { AjouterEvenementUseCase } from "~/server/sportif/usecases/AjouterEvenementUseCase";
import { ModifierExerciceSeanceUseCase } from "@/api/seance/usecases/ModifierExerciceSeanceUseCase";
import { SupprimerExerciceSeanceUseCase } from "@/api/seance/usecases/SupprimerExerciceSeanceUseCase";
import { SeanceExplorationQuery } from "@/api/exploration/infrastructure/queries/SeanceExplorationQuery";
import { DupliquerSeanceUseCase } from "@/api/seance/usecases/DupliquerSeanceUseCase";

type ApplicationDependencies = {
  sessionManager: SessionManager
}

type CompteUtilisateurDependencies = {
  authentificationService: AuthentificationService
  compteUtilisateurRepository: CompteUtilisateurRepository
  creerCompteUtilisateurUseCase: CreerCompteUtilisateurUseCase
  recupererCompteUtilisateurUseCase: RecupererCompteUtilisateurUseCase
  seConnecterUseCase: SeConnecterUseCase
  seDeconnecterUseCase: SeDeconnecterUseCase
  recupererCompteUtilisateurConnecteUseCase: RecupererCompteUtilisateurConnecteUseCase
  compteUtilisateurController: CompteUtilisateurController
}

type SeanceDependencies = {
  modifierNomSeanceUseCase: ModifierNomSeanceUseCase
  initialiserSeanceUseCase: InitialiserSeanceUseCase
  seanceController: SeanceController
  seanceQuery: SeanceQuery
  seanceExplorationQuery: SeanceExplorationQuery
  entrainementController: EntrainementController
  entrainementQuery: EntrainementQuery
  seanceRepository: SeanceRepository
  initialiserExerciceSeanceUseCase: InitialiserExerciceSeanceUseCase
  modifierExerciceSeanceUseCase: ModifierExerciceSeanceUseCase
  supprimerExerciceSeanceUseCase: SupprimerExerciceSeanceUseCase
  exerciceSeanceController: ExerciceSeanceController
  exerciceSeanceRepository: ExerciceSeanceRepository
  seanceExerciceRepository: SeanceExerciceRepository
  demarrerEntrainementUseCase: DemarrerEntrainementUseCase
  realiserSerieUseCase: RealiserSerieUseCase
  dupliquerSeanceUseCase: DupliquerSeanceUseCase
  entrainementRepository: EntrainementRepository
}

type ExerciceDependencies = {
  exerciceRepository: ExerciceRepository
  exerciceQuery: ExerciceQuery
}
type SportifDependencies = {
  sportifQuery: SportifQuery
  sportifController: SportifController
  sportifRepository: SportifRepository
  ajouterEvenementUseCase: AjouterEvenementUseCase
}

export type ContainerDependencies = ApplicationDependencies &
  CompteUtilisateurDependencies &
  SeanceDependencies &
  ExerciceDependencies &
  SportifDependencies

let container: AwilixContainer<ContainerDependencies>

declare global {
  var __container: AwilixContainer<ContainerDependencies> | undefined
}

if (process.env.NODE_ENV === "production") {
  container = createContainer<ContainerDependencies, ContainerDependencies>({ injectionMode: "PROXY" })
  registerContainer(container)
} else {
  if (!global.__container) {
    global.__container = createContainer()
    registerContainer(global.__container)
  }
  container = global.__container
}

function registerContainer(container: AwilixContainer<ContainerDependencies>) {
  container.register({
    sessionManager: asClass(SessionManager)
  })
  container.register({
    authentificationService: asClass(GoogleAuthentificatorService),
    compteUtilisateurRepository: asClass(PrismaCompteUtilisateurRepository),
    creerCompteUtilisateurUseCase: asClass(CreerCompteUtilisateurUseCase),
    recupererCompteUtilisateurUseCase: asClass(RecupererCompteUtilisateurUseCase),
    seConnecterUseCase: asClass(SeConnecterUseCase),
    seDeconnecterUseCase: asClass(SeDeconnecterUseCase),
    recupererCompteUtilisateurConnecteUseCase: asClass(RecupererCompteUtilisateurConnecteUseCase),
    compteUtilisateurController: asClass(CompteUtilisateurController)
  })
  container.register({
    initialiserSeanceUseCase: asClass(InitialiserSeanceUseCase),
    modifierNomSeanceUseCase: asClass(ModifierNomSeanceUseCase),
    seanceRepository: asClass(PrismaSeanceRepository),
    seanceController: asClass(SeanceController),
    seanceQuery: asClass(SeanceQuery),
    seanceExplorationQuery: asClass(SeanceExplorationQuery),
    entrainementController: asClass(EntrainementController),
    entrainementQuery: asClass(EntrainementQuery),
    exerciceSeanceController: asClass(ExerciceSeanceController),
    exerciceSeanceRepository: asClass(PrismaExerciceSeanceRepository),
    initialiserExerciceSeanceUseCase: asClass(InitialiserExerciceSeanceUseCase),
    modifierExerciceSeanceUseCase: asClass(ModifierExerciceSeanceUseCase),
    supprimerExerciceSeanceUseCase: asClass(SupprimerExerciceSeanceUseCase),
    seanceExerciceRepository: asClass(PrismaSeanceExerciceRepository),
    demarrerEntrainementUseCase: asClass(DemarrerEntrainementUseCase),
    dupliquerSeanceUseCase: asClass(DupliquerSeanceUseCase),
    realiserSerieUseCase: asClass(RealiserSerieUseCase),
    entrainementRepository: asClass(PrismaEntrainementRepository)
  })
  container.register({
    exerciceRepository: asClass(PrismaExerciceRepository),
    exerciceQuery: asClass(ExerciceQuery)
  })
  container.register({
    sportifController: asClass(SportifController),
    sportifQuery: asClass(SportifQuery),
    sportifRepository: asClass(PrismaSportifRepository),
    ajouterEvenementUseCase: asClass(AjouterEvenementUseCase),
  })
}

export * from "./app/contrats"

export { container }
