import { useFetcher } from "@remix-run/react"

import { H2Title } from "~/ui/components/H2Title"
import { PrimaryButton } from "~/ui/components/PrimaryButton"

function CreerProgramme() {
  const creerPrograme = useFetcher<any>()

  return (
    <div className="container">
      <H2Title>Création d'un nouveau programme</H2Title>
      <creerPrograme.Form method="post">
        <div className="mb-5">
          <input
            type="text"
            name="fName"
            id="fName"
            placeholder="Nom du programme"
            className="w-full rounded-md border border-gray bg-white py-3 px-6 text-base font-medium text-gray-darker outline-none focus:border-primary focus:shadow-md"
          />
        </div>

        <PrimaryButton>Créer le programme</PrimaryButton>
      </creerPrograme.Form>
    </div>
  )
}

export default CreerProgramme