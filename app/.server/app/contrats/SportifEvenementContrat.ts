import type { SportifEvenement as SportifEvenementModel } from ".prisma/client";

export interface SportifEvenementContrat {
  id: string;
  idSeance: string;
  idUtilisateur: string;
  tempsEvenement: string;
}

export const presenterEnContrat = (sportifEvenementModel: SportifEvenementModel): SportifEvenementContrat => {
  return {
    id: sportifEvenementModel.id,
    idSeance: sportifEvenementModel.idSeance,
    idUtilisateur: sportifEvenementModel.idUtilisateur,
    tempsEvenement: sportifEvenementModel.tempsEvenement
  };
};
