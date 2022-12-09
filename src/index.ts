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
import { ProgrammeRepository } from "./entrainement/domain/ports/ProgrammeRepository"
import { SeanceEntrainementRepository } from "./entrainement/domain/ports/SeanceEntrainementRepository"
import { PrismaProgrammeRepository } from "./entrainement/infrastructure/adapters/PrismaProgrammeRepository"
import {
  PrismaSeanceEntrainementRepository
} from "./entrainement/infrastructure/adapters/PrismaSeanceEntrainementRepository"
import { ProgrammeController } from "./entrainement/infrastructure/controllers/ProgrammeController"
import { SeanceEntrainementController } from "./entrainement/infrastructure/controllers/SeanceEntrainementController"
import { AjouterSeanceAUnProgrammeUseCase } from "./entrainement/usecases/AjouterSeanceAUnProgrammeUseCase"
import { CreerProgrammeUseCase } from "./entrainement/usecases/CreerProgrammeUseCase"
import { ListerProgrammesUseCase } from "./entrainement/usecases/ListerProgrammesUseCase"
import {
  ListerSeanceEntrainementPourUnProgrammeUseCase
} from "./entrainement/usecases/ListerSeanceEntrainementPourUnProgrammeUseCase"
import { RecupererDetailProgrammeUseCase } from "./entrainement/usecases/RecupererDetailProgrammeUseCase"
import { SupprimerSeanceEntrainementUseCase } from "./entrainement/usecases/SupprimerSeanceEntrainementUseCase"

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

type SeanceEntrainementDependencies = {
  listerSeanceEntrainementPourUnProgrammeUseCase: ListerSeanceEntrainementPourUnProgrammeUseCase
  ajouterSeanceAUnProgrammeUseCase: AjouterSeanceAUnProgrammeUseCase
  supprimerSeanceEntrainementUseCase: SupprimerSeanceEntrainementUseCase
  seanceEntrainementController: SeanceEntrainementController
  seanceEntrainementRepository: SeanceEntrainementRepository
}

export type ContainerDependencies = ApplicationDependencies 
  & CompteUtilisateurDependencies
  & ProgrammeDependencies 
  & SeanceEntrainementDependencies 

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
  container.register({
    listerSeanceEntrainementPourUnProgrammeUseCase: asClass(ListerSeanceEntrainementPourUnProgrammeUseCase),
    ajouterSeanceAUnProgrammeUseCase: asClass(AjouterSeanceAUnProgrammeUseCase),
    supprimerSeanceEntrainementUseCase: asClass(SupprimerSeanceEntrainementUseCase),
    seanceEntrainementController: asClass(SeanceEntrainementController),
    seanceEntrainementRepository: asClass(PrismaSeanceEntrainementRepository)
  })
}

export * from "./app/contrats"

export { container }
