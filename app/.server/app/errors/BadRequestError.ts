import { ReasonPhrases, StatusCodes } from "http-status-codes"

import { DomainError } from "./DomainError"

export abstract class BadRequestError extends DomainError {
  code = StatusCodes.BAD_REQUEST
  reasonPhrase = ReasonPhrases.BAD_REQUEST
}