import { H2Title } from "~/ui/atoms/H2Title"

export const ModifierSeance = () => {
  return (
    <div className="container flex w-full">
      <div className="w-2/4">
        <H2Title>Déroulé de la séance</H2Title>
      </div>
      <div className="w-2/4">
        <H2Title>Ajouter un exercice</H2Title>
      </div>
    </div>
  )
}