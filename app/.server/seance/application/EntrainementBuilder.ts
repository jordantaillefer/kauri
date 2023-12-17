import { Entrainement } from "../domain/Entrainement"
import type { ExerciceEntrainement } from "../domain/ExerciceEntrainement"

export class EntrainementBuilder {
  private id: string = "idEntrainement"
  private nomSeance: string = "nomSeance"
  private idUtilisateur: string = "idUtilisateur";
  private listeExerciceEntrainement: ExerciceEntrainement[] = []

  withId(id: string): EntrainementBuilder {
    this.id = id
    return this
  }

  withNomSeance(nomSeance: string): EntrainementBuilder {
    this.nomSeance = nomSeance
    return this
  }

  withIdUtilisateur(idUtilisateur: string): EntrainementBuilder {
    this.idUtilisateur = idUtilisateur;
    return this
  }

  withListeExerciceEntrainement(...listeExerciceEntrainement: ExerciceEntrainement[]) {
    this.listeExerciceEntrainement = listeExerciceEntrainement
    return this
  }

  build(): Entrainement {
    return Entrainement.creerEntrainement({
      id: this.id,
      nomSeance: this.nomSeance,
      idUtilisateur: this.idUtilisateur,
      listeExerciceEntrainement: this.listeExerciceEntrainement
    })
  }
}
