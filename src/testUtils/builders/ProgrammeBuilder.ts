import { Programme } from "../../entrainement/domain/Programme"
import { SeanceEntrainement } from "../../entrainement/domain/SeanceEntrainement"

export class ProgrammeBuilder {
  private id: string = "id"
  private idUtilisateur: string = "idUtilisateur"
  private nomProgramme: string = "nomProgramme"
  private seancesEntrainement: SeanceEntrainement[] = []

  withId(id: string): ProgrammeBuilder {
    this.id = id
    return this
  }

  withUserId(idUtilisateur: string): ProgrammeBuilder {
    this.idUtilisateur = idUtilisateur
    return this
  }

  withNomProgramme(nomProgramme: string): ProgrammeBuilder {
    this.nomProgramme = nomProgramme
    return this
  }

  withSeancesEntrainement(...seancesEntrainement: SeanceEntrainement[]): ProgrammeBuilder {
    this.seancesEntrainement.push(...seancesEntrainement)
    return this
  }

  build() {
    const programme = Programme.creerProgramme({ id: this.id, idUtilisateur: this.idUtilisateur, nomProgramme: this.nomProgramme })
    programme.ajouterSeancesEntrainement(...this.seancesEntrainement)
    return programme
  }
}