import invariant from "tiny-invariant";

import type { ServerRequest } from "~/.server/app/ServerRequest";
import type { ServerResponse } from "~/.server/app/ServerResponse";
import { created } from "~/.server/app/ServerResponse";
import { Controller } from "~/.server/app/decorators/ControllerDecorator";
import { DoitEtreAuthentifie } from "~/.server/app/decorators/DoitEtreAuthentifieDecorator";
import { ProduceServerResponse } from "~/.server/app/decorators/ProduceServerResponseDecorator";
import type { AjouterEvenementUseCase } from "~/.server/sportif/usecases/AjouterEvenementUseCase";

@Controller()
export class SportifController {
  private ajouterEvenementUseCase: AjouterEvenementUseCase;
  constructor({ ajouterEvenementUseCase }: { ajouterEvenementUseCase: AjouterEvenementUseCase}) {
    this.ajouterEvenementUseCase = ajouterEvenementUseCase;
  }

  @DoitEtreAuthentifie()
  @ProduceServerResponse()
  async ajouterEvenement({ payload, compteUtilisateurConnecte }: ServerRequest<{ idSeance: string, tempsEvenement: string }> ): Promise<ServerResponse<void>> {
    invariant(compteUtilisateurConnecte, "L'utilisateur doit être connecté")

    await this.ajouterEvenementUseCase.execute({
      idUtilisateur: compteUtilisateurConnecte.id,
      idSeance: payload.idSeance,
      tempsEvenement: payload.tempsEvenement
    })

    return created()
  }
}
