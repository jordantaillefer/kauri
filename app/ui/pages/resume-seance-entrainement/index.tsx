import { ActionFunction, json, LoaderFunction } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react"
import { redirect } from "@remix-run/router"
import { FunctionComponent } from "react"
import invariant from "tiny-invariant"

import { DetailSeanceContrat } from "../../../../src/app/contrats/DetailSeanceContrat"
import { EntrainementContrat } from "../../../../src/app/contrats/EntrainementContrat"
import { container } from "api"
import { H2Title } from "~/ui/atoms/H2Title"
import { SubmitButton } from "~/ui/molecules/SubmitButton"

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.idSeance, "expected params.idSeance")
  const payload = { idSeance: params.idSeance }
  const result = await container.resolve("seanceController").demarrerEntrainement({ request, payload })

  const nouvelEntrainement = result.data as EntrainementContrat

  return redirect(`/entrainement/${nouvelEntrainement.id}`)
}
export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.idSeance, "expected params.idSeance")
  const payload = { idSeance: params.idSeance }
  const result = await container.resolve("seanceController").recupererDetailSeanceParId({ request, payload })
  const detailSeance = result.data as DetailSeanceContrat

  return json({
    detailSeance
  })
}
export const ResumeSeanceEntrainement: FunctionComponent = () => {
  const { detailSeance } = useLoaderData<{ detailSeance: DetailSeanceContrat }>()
  return (
    <div className="container">
      <H2Title>Résumé de la séance : {detailSeance.nomSeance} </H2Title>
      <ul>
        {detailSeance.exerciceSeances.map((exercice, indexExercice) => {
          return (
            <li key={indexExercice}>
              <span>
                {exercice.ordre} / {exercice.categorie} / {exercice.nomExercice}
              </span>
              <ul>
                {exercice.series.map((serie, indexSerie) => {
                  return (
                    <li key={`${indexExercice}-${exercice.nomExercice}-${indexSerie}`}>
                      {serie.ordre} / nombre répétitions : {serie.repetitions}
                    </li>
                  )
                })}
              </ul>
            </li>
          )
        })}
      </ul>

      <Form method="post">
        <SubmitButton>Démarrer la séance</SubmitButton>
      </Form>
    </div>
  )
}
