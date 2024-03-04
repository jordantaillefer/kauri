import type { SportifEvenement as SportifEvenementModel } from ".prisma/client";

import { prisma } from "~/.server/db/prisma";
import type { SportifEvenement } from "~/.server/sportif/domain/SportifEvenement";
import type { SportifRepository } from "~/.server/sportif/domain/ports/SportifRepository";
import { UUID } from "node:crypto"
import { CorrelationIdService } from "@/api/CorrelationIdService"

export class PrismaSportifRepository implements SportifRepository {
  private readonly correlationId: UUID
  constructor({ correlationIdService }: { correlationIdService: CorrelationIdService }) {
    this.correlationId = correlationIdService.correlationId
  }

  async ajouterEvenement(sportifEvenement: SportifEvenement): Promise<void> {
    const sportifEvenementModel = convertirEnModel(sportifEvenement);
    await prisma.sportifEvenement.create({
      data: {
        ...sportifEvenementModel,
        correlationId: this.correlationId
      }
    })
  }
}

const convertirEnModel = (sportifEvenement: SportifEvenement): Omit<SportifEvenementModel, "correlationId"> => {
  return {
    id: sportifEvenement.id,
    idSeance: sportifEvenement.idSeance,
    idUtilisateur: sportifEvenement.idUtilisateur,
    tempsEvenement: sportifEvenement.tempsEvenement
  };
};
