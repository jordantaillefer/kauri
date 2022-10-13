import { NotFoundError } from "../../../app/NotFoundError"

export class ProgrammeNotFoundError extends NotFoundError {
  get message() {
    return "Le programme n'existe pas"
  }
}