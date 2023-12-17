import { UnauthorizedError } from "../../../app/errors/UnauthorizedError"

export class LUtilisateurNestPasConnecteError extends UnauthorizedError {
  message = "L'utilisateur n'est pas connecté"
}