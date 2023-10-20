import { asClass, AwilixContainer, createContainer } from "awilix"

import { SessionManager } from "./app/session.server"
import { AuthentificationService } from "./authentification/domain/ports/AuthentificationService"
import { CompteUtilisateurRepository } from "./authentification/domain/ports/CompteUtilisateurRepository"
import { GoogleAuthentificatorService } from "./authentification/infrastructure/adapters/GoogleAuthentificatorService"
import { PrismaCompteUtilisateurRepository } from "./authentification/infrastructure/adapters/PrismaCompteUtilisateurRepository"
import { CompteUtilisateurController } from "./authentification/infrastructure/controllers/CompteUtilisateurController"
import { CreerCompteUtilisateurUseCase } from "./authentification/usecases/CreerCompteUtilisateurUseCase"
import { RecupererCompteUtilisateurConnecteUseCase } from "./authentification/usecases/RecupererCompteUtilisateurConnecteUseCase"
import { RecupererCompteUtilisateurUseCase } from "./authentification/usecases/RecupererCompteUtilisateurUseCase"
import { SeConnecterUseCase } from "./authentification/usecases/SeConnecterUseCase"
import { SeDeconnecterUseCase } from "./authentification/usecases/SeDeconnecterUseCase"
import { ExerciceRepository } from "./exercice/domain/ports/ExerciceRepository"
import { PrismaExerciceRepository } from "./exercice/infrastructure/adapters/PrismaExerciceRepository"
import { EntrainementRepository } from "./seance/domain/ports/EntrainementRepository"
import { ExerciceSeanceRepository } from "./seance/domain/ports/ExerciceSeanceRepository"
import { SeanceExerciceRepository } from "./seance/domain/ports/SeanceExerciceRepository"
import { SeanceRepository } from "./seance/domain/ports/SeanceRepository"
import { PrismaEntrainementRepository } from "./seance/infrastructure/adapters/PrismaEntrainementRepository"
import { PrismaExerciceSeanceRepository } from "./seance/infrastructure/adapters/PrismaExerciceSeanceRepository"
import { PrismaSeanceExerciceRepository } from "./seance/infrastructure/adapters/PrismaSeanceExerciceRepository"
import { PrismaSeanceRepository } from "./seance/infrastructure/adapters/PrismaSeanceRepository"
import { EntrainementController } from "./seance/infrastructure/controllers/EntrainementController"
import { ExerciceSeanceController } from "./seance/infrastructure/controllers/ExerciceSeanceController"
import { SeanceController } from "./seance/infrastructure/controllers/SeanceController"
import { DefinirSerieExerciceSeanceUseCase } from "./seance/usecases/DefinirSerieExerciceSeanceUseCase"
import { DefinirTempsReposExerciceSeanceUseCase } from "./seance/usecases/DefinirTempsReposExerciceSeanceUseCase"
import { DemarrerEntrainementUseCase } from "./seance/usecases/DemarrerEntrainementUseCase"
import { InitialiserExerciceSeanceUseCase } from "./seance/usecases/InitialiserExerciceSeanceUseCase"
import { InitialiserSeanceUseCase } from "./seance/usecases/InitialiserSeanceUseCase"
import { ModifierNomSeanceUseCase } from "./seance/usecases/ModifierNomSeanceUseCase"
import { RealiserSerieUseCase } from "./seance/usecases/RealiserSerieUseCase"
import { RecupererExerciceSeanceUseCase } from "./seance/usecases/RecupererExerciceSeanceUseCase"
import { ExerciceQuery } from "api/exercice/infrastructure/query/ExerciceQuery";
import { EntrainementQuery } from "api/seance/infrastructure/queries/EntrainementQuery";
import { SeanceQuery } from "api/seance/infrastructure/queries/SeanceQuery";

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
  entrainementController: EntrainementController
  entrainementQuery: EntrainementQuery
  seanceRepository: SeanceRepository
  initialiserExerciceSeanceUseCase: InitialiserExerciceSeanceUseCase
  definirTempsReposExerciceSeanceUseCase: DefinirTempsReposExerciceSeanceUseCase
  recupererExerciceSeanceUseCase: RecupererExerciceSeanceUseCase
  definirSerieExerciceSeanceUseCase: DefinirSerieExerciceSeanceUseCase
  exerciceSeanceController: ExerciceSeanceController
  exerciceSeanceRepository: ExerciceSeanceRepository
  seanceExerciceRepository: SeanceExerciceRepository
  demarrerEntrainementUseCase: DemarrerEntrainementUseCase
  realiserSerieUseCase: RealiserSerieUseCase
  entrainementRepository: EntrainementRepository
}

type ExerciceDependencies = {
  exerciceRepository: ExerciceRepository
  exerciceQuery: ExerciceQuery
}

export type ContainerDependencies = ApplicationDependencies &
  CompteUtilisateurDependencies &
  SeanceDependencies &
  ExerciceDependencies

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
    entrainementController: asClass(EntrainementController),
    entrainementQuery: asClass(EntrainementQuery),
    exerciceSeanceController: asClass(ExerciceSeanceController),
    exerciceSeanceRepository: asClass(PrismaExerciceSeanceRepository),
    initialiserExerciceSeanceUseCase: asClass(InitialiserExerciceSeanceUseCase),
    definirTempsReposExerciceSeanceUseCase: asClass(DefinirTempsReposExerciceSeanceUseCase),
    recupererExerciceSeanceUseCase: asClass(RecupererExerciceSeanceUseCase),
    definirSerieExerciceSeanceUseCase: asClass(DefinirSerieExerciceSeanceUseCase),
    seanceExerciceRepository: asClass(PrismaSeanceExerciceRepository),
    demarrerEntrainementUseCase: asClass(DemarrerEntrainementUseCase),
    realiserSerieUseCase: asClass(RealiserSerieUseCase),
    entrainementRepository: asClass(PrismaEntrainementRepository)
  })
  container.register({
    exerciceRepository: asClass(PrismaExerciceRepository),
    exerciceQuery: asClass(ExerciceQuery)
  })
}

export * from "./app/contrats"

export { container }
