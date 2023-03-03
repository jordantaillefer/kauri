import { asClass, AwilixContainer, createContainer } from "awilix"

import { SessionManager } from "./app/session.server"
import { AuthentificationService } from "./authentification/domain/ports/AuthentificationService"
import { CompteUtilisateurRepository } from "./authentification/domain/ports/CompteUtilisateurRepository"
import { GoogleAuthentificatorService } from "./authentification/infrastructure/adapters/GoogleAuthentificatorService"
import {
  PrismaCompteUtilisateurRepository
} from "./authentification/infrastructure/adapters/PrismaCompteUtilisateurRepository"
import { CompteUtilisateurController } from "./authentification/infrastructure/controllers/CompteUtilisateurController"
import { CreerCompteUtilisateurUseCase } from "./authentification/usecases/CreerCompteUtilisateurUseCase"
import {
  RecupererCompteUtilisateurConnecteUseCase
} from "./authentification/usecases/RecupererCompteUtilisateurConnecteUseCase"
import { RecupererCompteUtilisateurUseCase } from "./authentification/usecases/RecupererCompteUtilisateurUseCase"
import { SeConnecterUseCase } from "./authentification/usecases/SeConnecterUseCase"
import { SeDeconnecterUseCase } from "./authentification/usecases/SeDeconnecterUseCase"
import { ExerciceRepository } from "./exercice/domain/ports/ExerciceRepository"
import { PrismaExerciceRepository } from "./exercice/infrastructure/adapters/PrismaExerciceRepository"
import { ExerciceController } from "./exercice/infrastructure/controllers/ExerciceController"
import { ListerExerciceUseCase } from "./exercice/usecases/ListerExerciceUseCase"
import { ExerciceSeanceRepository } from "./seance/domain/ports/ExerciceSeanceRepository"
import { SeanceExerciceRepository } from "./seance/domain/ports/SeanceExerciceRepository"
import { SeanceRepository } from "./seance/domain/ports/SeanceRepository"
import { PrismaExerciceSeanceRepository } from "./seance/infrastructure/adapters/PrismaExerciceSeanceRepository"
import { PrismaSeanceExerciceRepository } from "./seance/infrastructure/adapters/PrismaSeanceExerciceRepository"
import { PrismaSeanceRepository } from "./seance/infrastructure/adapters/PrismaSeanceRepository"
import { ExerciceSeanceController } from "./seance/infrastructure/controllers/ExerciceSeanceController"
import { SeanceController } from "./seance/infrastructure/controllers/SeanceController"
import { InitialiserExerciceSeanceUseCase } from "./seance/usecases/InitialiserExerciceSeanceUseCase"
import { InitialiserSeanceUseCase } from "./seance/usecases/InitialiserSeanceUseCase"
import { ListerSeanceUseCase } from "./seance/usecases/ListerSeanceUseCase"
import { RecupererExerciceSeanceUseCase } from "./seance/usecases/RecupererExerciceSeanceUseCase"
import { RecupererSeanceUseCase } from "./seance/usecases/RecupererSeanceUseCase"

type ApplicationDependencies = {
  sessionManager: SessionManager
}

type CompteUtilisateurDependencies = {
  authentificationService: AuthentificationService,
  compteUtilisateurRepository: CompteUtilisateurRepository,
  creerCompteUtilisateurUseCase: CreerCompteUtilisateurUseCase,
  recupererCompteUtilisateurUseCase: RecupererCompteUtilisateurUseCase,
  seConnecterUseCase: SeConnecterUseCase,
  seDeconnecterUseCase: SeDeconnecterUseCase,
  recupererCompteUtilisateurConnecteUseCase: RecupererCompteUtilisateurConnecteUseCase,
  compteUtilisateurController: CompteUtilisateurController,
}

type SeanceDependencies = {
  listerSeanceUseCase: ListerSeanceUseCase
  recupererSeanceUseCase: RecupererSeanceUseCase
  initialiserSeanceUseCase: InitialiserSeanceUseCase
  seanceController: SeanceController
  seanceRepository: SeanceRepository
  initialiserExerciceSeanceUseCase: InitialiserExerciceSeanceUseCase
  recupererExerciceSeanceUseCase: RecupererExerciceSeanceUseCase
  exerciceSeanceController: ExerciceSeanceController
  exerciceSeanceRepository: ExerciceSeanceRepository
  seanceExerciceRepository: SeanceExerciceRepository
}

type ExerciceDependencies = {
  listerExerciceUseCase: ListerExerciceUseCase
  exerciceRepository: ExerciceRepository
  exerciceController: ExerciceController
}

export type ContainerDependencies = ApplicationDependencies
  & CompteUtilisateurDependencies
  & SeanceDependencies
  & ExerciceDependencies

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
    listerSeanceUseCase: asClass(ListerSeanceUseCase),
    seanceRepository: asClass(PrismaSeanceRepository),
    seanceController: asClass(SeanceController),
    exerciceSeanceController: asClass(ExerciceSeanceController),
    exerciceSeanceRepository: asClass(PrismaExerciceSeanceRepository),
    initialiserExerciceSeanceUseCase: asClass(InitialiserExerciceSeanceUseCase),
    recupererExerciceSeanceUseCase: asClass(RecupererExerciceSeanceUseCase),
    seanceExerciceRepository: asClass(PrismaSeanceExerciceRepository)
  })
  container.register({
    listerExerciceUseCase: asClass(ListerExerciceUseCase),
    exerciceRepository: asClass(PrismaExerciceRepository),
    exerciceController: asClass(ExerciceController)
  })
}

export * from "./app/contrats"

export { container }
