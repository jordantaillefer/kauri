import { asClass, AwilixContainer, createContainer } from "awilix"

import { CompteUtilisateurController } from "./authentification/infrastructure/CompteUtilisateurController"
import {
  CompteUtilisateurRepository
} from "./authentification/infrastructure/adapters/compte_utilisateur_repository/CompteUtilisateurRepository"
import {
  PrismaCompteUtilisateurRepository
} from "./authentification/infrastructure/adapters/compte_utilisateur_repository/PrismaCompteUtilisateurRepository"
import { CreerCompteUtilisateurUseCase } from "./authentification/usecases/CreerCompteUtilisateurUseCase"
import { RecupererCompteUtilisateurUseCase } from "./authentification/usecases/RecupererCompteUtilisateurUseCase"

function registerContainer(container: AwilixContainer<ContainerDependencies>) {
  container.register({
    compteUtilisateurRepository: asClass(PrismaCompteUtilisateurRepository),
    creerCompteUtilisateurUseCase: asClass(CreerCompteUtilisateurUseCase),
    recupererCompteUtilisateurUseCase: asClass(RecupererCompteUtilisateurUseCase),
    compteUtilisateurController: asClass(CompteUtilisateurController)
  })
}

export type ContainerDependencies = {
  compteUtilisateurRepository: CompteUtilisateurRepository,
  creerCompteUtilisateurUseCase: CreerCompteUtilisateurUseCase,
  recupererCompteUtilisateurUseCase: RecupererCompteUtilisateurUseCase,
  compteUtilisateurController: CompteUtilisateurController
}

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

export { container }