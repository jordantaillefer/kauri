import { DetailSeanceContrat } from "@/api/app/contrats/DetailSeanceContrat";
import { Link } from "@remix-run/react";
import { FunctionComponent } from "react";

import { SeanceCard } from "~/ui/organisms/SeanceCard";

export const ListeSeance: FunctionComponent<{
  listeSeance: DetailSeanceContrat[]
  idSeanceSelectionne: string | null
}> = ({ listeSeance, idSeanceSelectionne }) => {
  return listeSeance.map(seance => (
    <Link to={seance.id} key={seance.id} >
      <SeanceCard
        name={seance.nomSeance}
        description={`${seance.exerciceSeances.length} exercice${seance.exerciceSeances.length > 1 ? "s" : ""}`}
        active={seance.id === idSeanceSelectionne}
      ></SeanceCard>
    </Link>
  ));
};
