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
  const result = await container.resolve("entrainementController").demarrerEntrainement({ request, payload })

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
      <ul className="text-primary">
        {detailSeance.exerciceSeances.map((exercice, indexExercice) => {
          return (
            <li key={indexExercice} className="flex flex-col gap-4 items-center">
              <div className="flex gap-4 items-center">
                <span className="bg-primary text-white border-2 border-primary rounded-full px-2">
                  {exercice.ordre}
                </span>
                <span>
                  {exercice.categorie} / {exercice.nomExercice}
                </span>
              </div>
              <ul>
                {exercice.series.map((serie, indexSerie) => {
                  return (
                    <li key={`${indexExercice}-${exercice.nomExercice}-${indexSerie}`} className="mb-2">
                      <div className="flex gap-4 items-center">
                        <span className="flex items-center justify-center bg-primary text-white border-2 border-primary rounded-full h-6 w-6">
                          {serie.ordre}
                        </span>
                        <span>nombre répétitions : {serie.repetitions}</span>
                      </div>
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
