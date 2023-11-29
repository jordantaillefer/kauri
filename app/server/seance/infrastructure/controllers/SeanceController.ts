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

interface Dependencies {
  initialiserSeanceUseCase: InitialiserSeanceUseCase
  modifierNomSeanceUseCase: ModifierNomSeanceUseCase
}

@Controller()
export class SeanceController {
  private initialiserSeanceUseCase: InitialiserSeanceUseCase
  private modifierNomSeanceUseCase: ModifierNomSeanceUseCase

  constructor({
    initialiserSeanceUseCase,
    modifierNomSeanceUseCase
  }: Dependencies) {
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
