import * as React from "react"

import { Categorie } from "./Categorie"
import { ButtonSelector } from "~/ui/organisms/ButtonSelector"

export const CategorieSelector = ({ categorie, baseUrl }: { categorie: string; baseUrl: string }) => {
  return (
    <div className="flex w-full justify-between mt-4">
      <ButtonSelector
        to={`${baseUrl}&categorie=${Categorie.ENTRAINEMENT}`}
        active={categorie === Categorie.ENTRAINEMENT}
      >
        Mon entrainement
      </ButtonSelector>
      <ButtonSelector to={`${baseUrl}&categorie=${Categorie.SEANCE}`} active={categorie === Categorie.SEANCE}>
        Mes séances
      </ButtonSelector>
    </div>
  )
}
