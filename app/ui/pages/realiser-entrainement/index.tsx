import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react"
import { FunctionComponent } from "react"
import invariant from "tiny-invariant"

import {
  EntrainementContrat,
  ExerciceEntrainementContrat,
  SerieEntrainementContrat
} from "../../../../src/app/contrats/EntrainementContrat"
import { container } from "api"
import { H2Title } from "~/ui/atoms/H2Title"
import { SubmitButton } from "~/ui/molecules/SubmitButton"

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const { _action } = Object.fromEntries(formData)

  const payload = { idSerie: _action.toString() }

  await container.resolve("seanceController").realiserSerie({ request, payload })

  return null

}

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.idEntrainement, "expected idEntrainement to be defined")

  const payload = { idEntrainement: params.idEntrainement }
  const result = await container.resolve("seanceController").recupererEntrainementParId({ request, payload })

  const entrainement = result.data as EntrainementContrat

  let prochainExercice = entrainement.listeExerciceEntrainement.filter(exercice => !exercice.estRealise).at(0)
  let prochaineSerie = prochainExercice?.listeSerieEntrainement.filter(serie => !serie.estRealise).at(0)


  // TODO do this on the backend
  if (!prochaineSerie) {
    const payloadRealiserExercice = { idEntrainement: prochainExercice?.id as string } // TODO change from entrainement to exercice
    await container.resolve("seanceController").realiserEntrainement({ request, payload: payloadRealiserExercice })
    prochainExercice = entrainement.listeExerciceEntrainement.filter(exercice => !exercice.estRealise).at(1)

    if (!prochainExercice) {
      return redirect("/")
    }
    prochaineSerie = prochainExercice?.listeSerieEntrainement.filter(serie => !serie.estRealise).at(0)
  }


  return json({
    entrainement,
    prochainExercice,
    prochaineSerie
  })

}

export const RealiserEntrainement: FunctionComponent = () => {
  const { entrainement, prochainExercice, prochaineSerie } = useLoaderData<{ entrainement: EntrainementContrat, prochainExercice: ExerciceEntrainementContrat, prochaineSerie: SerieEntrainementContrat }>()

  return (
    <div className="container">
      <H2Title>Entrainement : {entrainement.nomSeance}</H2Title>
      <ul>
        <li>Prochain exercice : { prochainExercice.nomExercice } { prochainExercice.id }</li>
        <li>Prochaine serie : { prochaineSerie.nombreRepetition } { prochaineSerie.id }</li>

        <li>Temps Repos : { prochainExercice.tempsRepos }</li>
      </ul>

      <Form method="post">
        <SubmitButton value={ prochaineSerie.id }>Valider serie</SubmitButton>
      </Form>
    </div>
  )
}
