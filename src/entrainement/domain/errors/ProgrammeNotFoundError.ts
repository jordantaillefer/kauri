import { NotFoundError } from "../../../app/errors/NotFoundError"

export class ProgrammeNotFoundError extends NotFoundError {
  get message() {
    return "Le programme n'existe pas"
  }
}