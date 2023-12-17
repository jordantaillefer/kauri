import type { ExerciceSeance } from "../../seance/domain/ExerciceSeance"
import { Seance } from "../../seance/domain/Seance"

export class SeanceBuilder {
  private id: string = "id"
  private idUtilisateur: string = "idUtilisateur"
  private nomSeance: string = "nomSeance"
  private exerciceSeances: ExerciceSeance[] = []

  withId(id: string): SeanceBuilder {
    this.id = id
    return this
  }

  withIdUtilisateur(idUtilisateur: string): SeanceBuilder {
    this.idUtilisateur = idUtilisateur
    return this
  }

  withNomSeance(nomSeance: string): SeanceBuilder {
    this.nomSeance = nomSeance
    return this
  }

  withListeExerciceSeance(...exerciceSeances: ExerciceSeance[]) {
    this.exerciceSeances = exerciceSeances
    return this
  }

  build(): Seance {
    return Seance.creerSeance({
      id: this.id,
      idUtilisateur: this.idUtilisateur,
      nomSeance: this.nomSeance,
      exerciceSeances: this.exerciceSeances
    })
  }
}
