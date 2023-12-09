import invariant from "tiny-invariant"

import type { ExerciceSeance } from "../../domain/ExerciceSeance"
import type { Seance } from "../../domain/Seance"
import type { InitialiserSeanceUseCase } from "../../usecases/InitialiserSeanceUseCase"
import type { ModifierNomSeanceUseCase } from "../../usecases/ModifierNomSeanceUseCase"
import type { ExerciceSeanceContrat, SeanceContrat } from "app/server"
import type { ServerRequest, ServerRequestWithoutPayload } from "~/server/app/ServerRequest"
import type { ServerResponse} from "~/server/app/ServerResponse";
import { created, updated } from "~/server/app/ServerResponse";
import { Controller } from "~/server/app/decorators/ControllerDecorator"
import { DoitEtreAuthentifie } from "~/server/app/decorators/DoitEtreAuthentifieDecorator"
import { ProduceServerResponse } from "~/server/app/decorators/ProduceServerResponseDecorator"
import type { DupliquerSeanceUseCase } from "@/api/seance/usecases/DupliquerSeanceUseCase";

interface Dependencies {
  dupliquerSeanceUseCase: DupliquerSeanceUseCase
  initialiserSeanceUseCase: InitialiserSeanceUseCase
  modifierNomSeanceUseCase: ModifierNomSeanceUseCase
}

@Controller()
export class SeanceController {
  private dupliquerSeanceUseCase: DupliquerSeanceUseCase
  private initialiserSeanceUseCase: InitialiserSeanceUseCase
  private modifierNomSeanceUseCase: ModifierNomSeanceUseCase

  constructor({
    dupliquerSeanceUseCase,
    initialiserSeanceUseCase,
    modifierNomSeanceUseCase
  }: Dependencies) {
    this.dupliquerSeanceUseCase = dupliquerSeanceUseCase
    this.initialiserSeanceUseCase = initialiserSeanceUseCase
    this.modifierNomSeanceUseCase = modifierNomSeanceUseCase
  }

  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async initialiserSeance(serverRequest: ServerRequestWithoutPayload): Promise<ServerResponse<SeanceContrat>> {
    invariant(serverRequest.compteUtilisateurConnecte)
    const nouvelleSeance = await this.initialiserSeanceUseCase.execute(serverRequest.compteUtilisateurConnecte.id)
    return created(presenterEnSeanceContrat(nouvelleSeance))
  }

  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async dupliquerSeance(
    serverRequest: ServerRequest<{ idSeance: string }>
  ): Promise<ServerResponse<SeanceContrat>> {
    invariant(serverRequest.compteUtilisateurConnecte)
    const nouvelleSeance = await this.dupliquerSeanceUseCase.execute({
      idSeance: serverRequest.payload.idSeance,
      idUtilisateur: serverRequest.compteUtilisateurConnecte.id
    })
    return created(presenterEnSeanceContrat(nouvelleSeance))
  }

  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async mettreAJourNomSeance(
    serverRequest: ServerRequest<{ idSeance: string; nomSeance: string }>
  ): Promise<ServerResponse<void>> {
    invariant(serverRequest.compteUtilisateurConnecte)
    const { idSeance, nomSeance } = serverRequest.payload
    await this.modifierNomSeanceUseCase.execute({
      idSeance,
      nouveauNomSeance: nomSeance
    })
    return updated()
  }
}

function presenterEnExerciceSeanceContrat(exerciceSeance: ExerciceSeance): ExerciceSeanceContrat {
  return {
    id: exerciceSeance.id,
    nomExercice: exerciceSeance.nomExercice,
    categorie: exerciceSeance.categorie,
    idExercice: exerciceSeance.idExercice,
    ordre: exerciceSeance.ordre,
    listeSerieExerciceSeance: []
  }
}

function presenterEnSeanceContrat(seance: Seance): SeanceContrat {
  return {
    id: seance.id,
    nomSeance: seance.nomSeance,
    exerciceSeances: seance.exerciceSeances.map(presenterEnExerciceSeanceContrat)
  }
}
