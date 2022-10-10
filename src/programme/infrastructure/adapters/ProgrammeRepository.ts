import { Programme } from "../../domain/Programme"

export interface ProgrammeRepository {
  creerProgramme(programme: Programme): Promise<void>
}