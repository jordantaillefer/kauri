import type { SportifEvenement } from "~/.server/sportif/domain/SportifEvenement";

export interface SportifRepository {
  ajouterEvenement(sportifEvenement: SportifEvenement): Promise<void>;
}
