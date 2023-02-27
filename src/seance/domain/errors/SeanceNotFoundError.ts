import { NotFoundError } from "../../../app/errors/NotFoundError"

export class SeanceNotFoundError extends NotFoundError {
  get message() {
    return "Le programme n'existe pas"
  }
}