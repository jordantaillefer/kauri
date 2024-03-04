import { UUID } from "node:crypto"
import { randomUUID } from "crypto"

export class CorrelationIdService {
  private readonly _correlationId: UUID;
  constructor() {
    this._correlationId = randomUUID()
  }

  get correlationId(): UUID {
    return this._correlationId
  }
}
