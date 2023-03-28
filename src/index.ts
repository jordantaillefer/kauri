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
import { ExerciceController } from "./exercice/infrastructure/controllers/ExerciceController"
import { ListerExerciceUseCase } from "./exercice/usecases/ListerExerciceUseCase"
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
import { DemarrerEntrainementUseCase } from "./seance/usecases/DemarrerEntrainementUseCase"
import { InitialiserExerciceSeanceUseCase } from "./seance/usecases/InitialiserExerciceSeanceUseCase"
import { InitialiserSeanceUseCase } from "./seance/usecases/InitialiserSeanceUseCase"
import { ListerEntrainementUseCase } from "./seance/usecases/ListerEntrainementUseCase"
import { ListerSeanceUseCase } from "./seance/usecases/ListerSeanceUseCase"
import { RealiserSerieUseCase } from "./seance/usecases/RealiserSerieUseCase"
import { RecupererDetailSeanceUseCase } from "./seance/usecases/RecupererDetailSeanceUseCase"
import { RecupererEntrainementUseCase } from "./seance/usecases/RecupererEntrainementUseCase"
import { RecupererExerciceSeanceUseCase } from "./seance/usecases/RecupererExerciceSeanceUseCase"
import { RecupererSeanceUseCase } from "./seance/usecases/RecupererSeanceUseCase"

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
  listerSeanceUseCase: ListerSeanceUseCase
  listerEntrainementUseCase: ListerEntrainementUseCase
  recupererSeanceUseCase: RecupererSeanceUseCase
  recupererDetailSeanceUseCase: RecupererDetailSeanceUseCase
  initialiserSeanceUseCase: InitialiserSeanceUseCase
  seanceController: SeanceController
  entrainementController: EntrainementController
  seanceRepository: SeanceRepository
  initialiserExerciceSeanceUseCase: InitialiserExerciceSeanceUseCase
  recupererExerciceSeanceUseCase: RecupererExerciceSeanceUseCase
  definirSerieExerciceSeanceUseCase: DefinirSerieExerciceSeanceUseCase
  exerciceSeanceController: ExerciceSeanceController
  exerciceSeanceRepository: ExerciceSeanceRepository
  seanceExerciceRepository: SeanceExerciceRepository
  demarrerEntrainementUseCase: DemarrerEntrainementUseCase
  realiserSerieUseCase: RealiserSerieUseCase
  recupererEntrainementUseCase: RecupererEntrainementUseCase
  entrainementRepository: EntrainementRepository
}

type ExerciceDependencies = {
  listerExerciceUseCase: ListerExerciceUseCase
  exerciceRepository: ExerciceRepository
  exerciceController: ExerciceController
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
    recupererSeanceUseCase: asClass(RecupererSeanceUseCase),
    recupererDetailSeanceUseCase: asClass(RecupererDetailSeanceUseCase),
    listerSeanceUseCase: asClass(ListerSeanceUseCase),
    seanceRepository: asClass(PrismaSeanceRepository),
    seanceController: asClass(SeanceController),
    entrainementController: asClass(EntrainementController),
    exerciceSeanceController: asClass(ExerciceSeanceController),
    exerciceSeanceRepository: asClass(PrismaExerciceSeanceRepository),
    initialiserExerciceSeanceUseCase: asClass(InitialiserExerciceSeanceUseCase),
    recupererExerciceSeanceUseCase: asClass(RecupererExerciceSeanceUseCase),
    definirSerieExerciceSeanceUseCase: asClass(DefinirSerieExerciceSeanceUseCase),
    seanceExerciceRepository: asClass(PrismaSeanceExerciceRepository),
    demarrerEntrainementUseCase: asClass(DemarrerEntrainementUseCase),
    realiserSerieUseCase: asClass(RealiserSerieUseCase),
    recupererEntrainementUseCase: asClass(RecupererEntrainementUseCase),
    listerEntrainementUseCase: asClass(ListerEntrainementUseCase),
    entrainementRepository: asClass(PrismaEntrainementRepository)
  })
  container.register({
    listerExerciceUseCase: asClass(ListerExerciceUseCase),
    exerciceRepository: asClass(PrismaExerciceRepository),
    exerciceController: asClass(ExerciceController)
  })
}

export * from "./app/contrats"

export { container }
