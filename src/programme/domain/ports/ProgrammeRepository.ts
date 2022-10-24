import { Programme } from "../Programme"

export interface ProgrammeRepository {
  creerProgramme(programme: Programme): Promise<void>

  recupererParId(id: string): Promise<Programme | null>

  recupererTout(): Promise<Programme[]>

  recupererToutPourLUtilisateur(idUtilisateur: string): Promise<Programme[]>
}