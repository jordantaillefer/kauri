import { ReasonPhrases, StatusCodes } from "http-status-codes"

export abstract class CustomError extends Error {
  abstract code: StatusCodes
  abstract reason: ReasonPhrases
  abstract message: string
}
