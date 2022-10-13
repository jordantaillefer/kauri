import { asClass, AwilixContainer, createContainer } from "awilix"

import {
  CompteUtilisateurRepository
} from "./authentification/infrastructure/adapters/compte_utilisateur_repository/CompteUtilisateurRepository"
import {
  PrismaCompteUtilisateurRepository
} from "./authentification/infrastructure/adapters/compte_utilisateur_repository/PrismaCompteUtilisateurRepository"
import { CompteUtilisateurController } from "./authentification/infrastructure/controllers/CompteUtilisateurController"
import { CreerCompteUtilisateurUseCase } from "./authentification/usecases/CreerCompteUtilisateurUseCase"
import { RecupererCompteUtilisateurUseCase } from "./authentification/usecases/RecupererCompteUtilisateurUseCase"
import { PrismaProgrammeRepository } from "./programme/infrastructure/adapters/PrismaProgrammeRepository"
import { ProgrammeRepository } from "./programme/infrastructure/adapters/ProgrammeRepository"
import { ProgrammeController } from "./programme/infrastructure/controllers/ProgrammeController"
import { CreerProgrammeUseCase } from "./programme/usecases/CreerProgrammeUseCase"

type CompteUtilisateurDependencies = {
  compteUtilisateurRepository: CompteUtilisateurRepository,
  creerCompteUtilisateurUseCase: CreerCompteUtilisateurUseCase,
  recupererCompteUtilisateurUseCase: RecupererCompteUtilisateurUseCase,
  compteUtilisateurController: CompteUtilisateurController,
}

type ProgrammeDependencies = {
  creerProgrammeUseCase: CreerProgrammeUseCase
  programmeController: ProgrammeController
  programmeRepository: ProgrammeRepository
}

export type ContainerDependencies = CompteUtilisateurDependencies
  & ProgrammeDependencies

let container: AwilixContainer<ContainerDependencies>

declare global {
  var __container: AwilixContainer<ContainerDependencies> | undefined
}

if (process.env.NODE_ENV === "production") {
  container = createContainer<ContainerDependencies, ContainerDependencies>()
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
    compteUtilisateurRepository: asClass(PrismaCompteUtilisateurRepository),
    creerCompteUtilisateurUseCase: asClass(CreerCompteUtilisateurUseCase),
    recupererCompteUtilisateurUseCase: asClass(RecupererCompteUtilisateurUseCase),
    compteUtilisateurController: asClass(CompteUtilisateurController),
  })
  container.register({
    creerProgrammeUseCase: asClass(CreerProgrammeUseCase),
    programmeController: asClass(ProgrammeController),
    programmeRepository: asClass(PrismaProgrammeRepository)
  })
}

export { container }
