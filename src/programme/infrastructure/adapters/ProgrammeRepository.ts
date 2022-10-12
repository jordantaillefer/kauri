import { Programme } from "../../domain/Programme"

export interface ProgrammeRepository {
  creerProgramme(programme: Programme): Promise<void>

  recupererParId(id: string): Promise<Programme | null>
}