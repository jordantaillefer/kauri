import { NotFoundError } from "../../../app/errors/NotFoundError"

export class LUtilisateurNExistePasError extends NotFoundError {
  message = "L'utilisateur n'existe pas"
}