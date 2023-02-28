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
import { SeanceRepository } from "./seance/domain/ports/SeanceRepository"
import { PrismaSeanceRepository } from "./seance/infrastructure/adapters/PrismaSeanceRepository"
import { SeanceController } from "./seance/infrastructure/controllers/SeanceController"
import { InitialiserSeanceUseCase } from "./seance/usecases/InitialiserSeanceUseCase"

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
  initialiserSeanceUseCase: InitialiserSeanceUseCase
  seanceController: SeanceController
  seanceRepository: SeanceRepository
}

export type ContainerDependencies = ApplicationDependencies
  & CompteUtilisateurDependencies
  & SeanceDependencies

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
    seanceRepository: asClass(PrismaSeanceRepository),
    seanceController: asClass(SeanceController)
  })
}

export * from "./app/contrats"

export { container }
