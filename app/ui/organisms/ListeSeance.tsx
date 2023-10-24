import { DetailSeanceContrat } from "@/api/app/contrats/DetailSeanceContrat";
import { Dispatch, FunctionComponent, SetStateAction } from "react";

import { SeanceCard } from "~/ui/organisms/SeanceCard";

export const ListeSeance: FunctionComponent<{
  listeSeance: DetailSeanceContrat[]
  idSeanceSelectionne: string | null
  setIdSeanceSelectionne: Dispatch<SetStateAction<string | null>>
}> = ({ listeSeance, idSeanceSelectionne, setIdSeanceSelectionne }) => {
  return listeSeance.map(seance => (
    <div key={seance.id} onClick={() => setIdSeanceSelectionne(seance.id)}>
      <SeanceCard
        name={seance.nomSeance}
        description={`${seance.exerciceSeances.length} exercice${seance.exerciceSeances.length > 1 ? "s" : ""}`}
        active={seance.id === idSeanceSelectionne}
      ></SeanceCard>
    </div>
  ));
};
