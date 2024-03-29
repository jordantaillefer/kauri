import { CATEGORIE } from "@/api/exercice/domain/categorie"
import { FunctionComponent } from "react"

import { AVAILABLE_MUSCLE } from "~/utils/AvailableMuscle"

export const ImageMuscle: FunctionComponent<{ categorie: string }> = ({ categorie }) => {
  return (
    <img
      className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-main-kauri-lighter"
      src={AVAILABLE_MUSCLE[categorie as CATEGORIE]}
      alt="montrant la position du muscle pectoraux"
    />
  )
}
