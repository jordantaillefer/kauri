import { ReasonPhrases, StatusCodes } from "http-status-codes"

import { CustomError } from "./Error"

export abstract class NotFoundError extends CustomError {
  code = StatusCodes.NOT_FOUND
  reason = ReasonPhrases.NOT_FOUND

}