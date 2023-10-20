import { ActionFunction, json, LoaderFunction } from "@remix-run/node"
import { FunctionComponent } from "react"
import invariant from "tiny-invariant"

import { container } from "api"
import { DetailEntrainementContrat, ExerciceEntrainementContrat } from "api/app/contrats/EntrainementContrat"
import { H2Title } from "~/ui/atoms/H2Title"
import { PrimaryButton } from "~/ui/atoms/PrimaryButton"
import { BlocProchainExercice } from "~/ui/pages/realiser-entrainement/BlocProchainExercice"
import { Timer } from "~/ui/pages/realiser-entrainement/Timer"
import { useEntrainement } from "~/ui/pages/realiser-entrainement/useEntrainement"

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const { idSerie, idExercice } = Object.fromEntries(formData)

  const payload = { idSerie: idSerie.toString(), idExercice: idExercice.toString() }

  await container.resolve("entrainementController").realiserSerie({ request, payload })

  return null
}

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.idEntrainement, "expected idEntrainement to be defined")

  const payload = { idEntrainement: params.idEntrainement }
  const result = await container.resolve("entrainementQuery").recupererEntrainementParId({ request, payload })

  const entrainement = result.data as DetailEntrainementContrat

  const prochainExercice = entrainement.listeExerciceEntrainement
    .filter(exercice => !exercice.estRealise)
    .at(0) as ExerciceEntrainementContrat
  const prochaineSerie = prochainExercice?.listeSerieEntrainement.filter(serie => !serie.estRealise).at(0)

  return json({
    entrainement,
    prochainExercice,
    prochaineSerie
  })
}

export const RealiserEntrainement: FunctionComponent = () => {
  const {
    nomSeance,
    prochainExercice,
    prochaineSerie,
    demarrerRepos,
    isTimerActive, // sortir ca dans un useCountdown
    time
  } = useEntrainement()

  return (
    <div className="container flex flex-grow flex-col">
      <H2Title>{nomSeance}</H2Title>

      <div className="flex flex-col flex-grow">
        <BlocProchainExercice prochainExercice={prochainExercice} prochaineSerie={prochaineSerie} />

        {isTimerActive && (
          <div className="mt-4">
            <Timer time={time} />
          </div>
        )}
      </div>

      <PrimaryButton onClick={demarrerRepos}>Valider serie</PrimaryButton>
    </div>
  )
}
