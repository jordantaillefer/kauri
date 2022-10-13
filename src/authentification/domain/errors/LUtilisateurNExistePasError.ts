import { NotFoundError } from "../../../app/NotFoundError"

export class LUtilisateurNExistePasError extends NotFoundError {
  message = "L'utilisateur n'existe pas"
}