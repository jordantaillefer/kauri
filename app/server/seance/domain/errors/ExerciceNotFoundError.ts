import { NotFoundError } from "../../../app/errors/NotFoundError"

export class ExerciceNotFoundError extends NotFoundError {
  get message() {
    return "L'exercice n'existe pas"
  }
}