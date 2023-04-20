import { ActionFunction, json, LoaderFunction } from "@remix-run/node"
import { FunctionComponent } from "react"
import invariant from "tiny-invariant"

import { EntrainementContrat, ExerciceEntrainementContrat } from "../../../../src/app/contrats/EntrainementContrat"
import { container } from "api"
import { H2Title } from "~/ui/atoms/H2Title"
import { BlocProchainExercice } from "~/ui/pages/realiser-entrainement/BlocProchainExercice"
import { Timer } from "~/ui/pages/realiser-entrainement/timer"
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
  const result = await container.resolve("entrainementController").recupererEntrainementParId({ request, payload })

  const entrainement = result.data as EntrainementContrat

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
    <div className="container">
      <H2Title>Entrainement : {nomSeance}</H2Title>

      {isTimerActive && <Timer time={time} /> }

      <BlocProchainExercice
        prochainExercice={prochainExercice}
        prochaineSerie={prochaineSerie}
        onClick={demarrerRepos}
      />
    </div>
  )
}
