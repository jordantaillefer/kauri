import { ReasonPhrases } from "http-status-codes"

export type ServerResponse<T = undefined> = {
  reasonPhrase: ReasonPhrases
  data?: T | string
}
export const success = <T>(data: T): ServerResponse<T> => ({ reasonPhrase: ReasonPhrases.OK, data })
export const created = <T>(data?: T): ServerResponse<T> => ({ reasonPhrase: ReasonPhrases.CREATED, data })