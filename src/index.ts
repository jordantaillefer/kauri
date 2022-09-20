import { AuthentificationHandler } from "./authentification/infrastructure/handlers/AuthentificationHandler"
import { CreerCompteUtilisateurUseCase } from "./authentification/usecases/CreerCompteUtilisateurUseCase"
import {
  PrismaCompteUtilisateurRepository
} from "./authentification/infrastructure/adapters/compte_utilisateur_repository/PrismaCompteUtilisateurRepository"

const compteUtilisateurRepository = new PrismaCompteUtilisateurRepository()

const creerCompteUtilisateurUseCase = new CreerCompteUtilisateurUseCase(compteUtilisateurRepository)

const authentificationHandler = new AuthentificationHandler(creerCompteUtilisateurUseCase)

export {
  authentificationHandler
}