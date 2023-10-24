import type { ReasonPhrases, StatusCodes } from "http-status-codes"

export abstract class DomainError extends Error {
  abstract code: StatusCodes
  abstract reasonPhrase: ReasonPhrases
  abstract message: string
}
