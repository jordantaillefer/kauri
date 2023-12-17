import type { SportifEvenement as SportifEvenementModel } from ".prisma/client";

import { prisma } from "~/.server/db/prisma";
import type { SportifEvenement } from "~/.server/sportif/domain/SportifEvenement";
import type { SportifRepository } from "~/.server/sportif/domain/ports/SportifRepository";

const convertirEnModel = (sportifEvenement: SportifEvenement): SportifEvenementModel => {
  return {
    id: sportifEvenement.id,
    idSeance: sportifEvenement.idSeance,
    idUtilisateur: sportifEvenement.idUtilisateur,
    tempsEvenement: sportifEvenement.tempsEvenement
  };
};

export class PrismaSportifRepository implements SportifRepository {
  async ajouterEvenement(sportifEvenement: SportifEvenement): Promise<void> {
    const sportifEvenementModel = convertirEnModel(sportifEvenement);
    await prisma.sportifEvenement.create({
      data: sportifEvenementModel
    });
  }
}
