import { Categorie } from "./Categorie"
import { ButtonSelector } from "~/ui/organisms/ButtonSelector"

export const CategorieSelector = ({ categorie, baseUrl }: { categorie: string; baseUrl: string }) => {
  return (
    <div className="flex w-full justify-between mt-4">
      <ButtonSelector
        to={`${baseUrl}?categorie=${Categorie.RESUME_SEANCE}`}
        active={categorie === Categorie.RESUME_SEANCE}
      >
        Résume de la séance
      </ButtonSelector>
      <ButtonSelector
        to={`${baseUrl}?categorie=${Categorie.AJOUTER_EXERCICE}`}
        active={categorie === Categorie.AJOUTER_EXERCICE}
      >
        Ajouter un exercice
      </ButtonSelector>
    </div>
  )
}
