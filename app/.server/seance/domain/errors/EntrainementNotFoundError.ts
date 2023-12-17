import { NotFoundError } from "../../../app/errors/NotFoundError"

export class EntrainementNotFoundError extends NotFoundError {
  get message(): string {
    return "L'entrainement n'existe pas"
  }
}
