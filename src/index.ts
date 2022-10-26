import { asClass, AwilixContainer, createContainer } from "awilix"

import { SessionManager } from "./app/session.server"
import { CompteUtilisateurRepository } from "./authentification/domain/ports/CompteUtilisateurRepository"
import { AuthentificationService } from "./authentification/domains/ports/AuthentificationService"
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
import { ProgrammeRepository } from "./programme/domain/ports/ProgrammeRepository"
import { PrismaProgrammeRepository } from "./programme/infrastructure/adapters/PrismaProgrammeRepository"
import { ProgrammeController } from "./programme/infrastructure/controllers/ProgrammeController"
import { CreerProgrammeUseCase } from "./programme/usecases/CreerProgrammeUseCase"
import { ListerProgrammesUseCase } from "./programme/usecases/ListerProgrammesUseCase"
import { RecupererDetailProgrammeUseCase } from "./programme/usecases/RecupererDetailProgrammeUseCase"

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

type ProgrammeDependencies = {
  creerProgrammeUseCase: CreerProgrammeUseCase
  listerProgrammeUseCase: ListerProgrammesUseCase
  recupererDetailProgrammeUseCase: RecupererDetailProgrammeUseCase
  programmeController: ProgrammeController
  programmeRepository: ProgrammeRepository
}

export type ContainerDependencies = CompteUtilisateurDependencies
  & ProgrammeDependencies & ApplicationDependencies

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
    creerProgrammeUseCase: asClass(CreerProgrammeUseCase),
    listerProgrammeUseCase: asClass(ListerProgrammesUseCase),
    recupererDetailProgrammeUseCase: asClass(RecupererDetailProgrammeUseCase),
    programmeController: asClass(ProgrammeController),
    programmeRepository: asClass(PrismaProgrammeRepository)
  })
}

export * from "./app/contrats"

export { container }
