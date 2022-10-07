import { Programme } from "../Programme"

export interface ProgrammeRepository {
  creerProgramme(programme: Programme): Promise<void>
}