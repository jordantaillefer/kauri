import { NotFoundError } from "../../../app/errors/NotFoundError"

export class SeanceNotFoundError extends NotFoundError {
  get message() {
    return "La séance n'existe pas"
  }
}