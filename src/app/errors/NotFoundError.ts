import { ReasonPhrases, StatusCodes } from "http-status-codes"

import { DomainError } from "./DomainError"

export abstract class NotFoundError extends DomainError {
  code = StatusCodes.NOT_FOUND
  reasonPhrase = ReasonPhrases.NOT_FOUND
}