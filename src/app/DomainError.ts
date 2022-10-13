import { ReasonPhrases, StatusCodes } from "http-status-codes"

export abstract class DomainError extends Error {
  abstract code: StatusCodes
  abstract reason: ReasonPhrases
  abstract message: string
}
