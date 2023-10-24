import { ReasonPhrases, StatusCodes } from "http-status-codes"

import { DomainError } from "./DomainError"

export abstract class UnauthorizedError extends DomainError {
  code = StatusCodes.UNAUTHORIZED
  reasonPhrase = ReasonPhrases.UNAUTHORIZED
}