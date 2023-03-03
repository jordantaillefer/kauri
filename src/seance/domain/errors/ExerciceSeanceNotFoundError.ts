import { NotFoundError } from "../../../app/errors/NotFoundError"

export class ExerciceSeanceNotFoundError extends NotFoundError {
  get message() {
    return "L'exercice n'existe pas pour cette séance"
  }
}