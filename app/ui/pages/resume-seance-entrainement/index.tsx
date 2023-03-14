import { json, LoaderFunction, ActionFunction } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react"
import { FunctionComponent } from "react"
import invariant from "tiny-invariant"

import { DetailSeanceContrat } from "../../../../src/app/contrats/DetailSeanceContrat"
import { container } from "api"
import { H2Title } from "~/ui/atoms/H2Title"
import { SubmitButton } from "~/ui/molecules/SubmitButton"

export const action: ActionFunction = async ({ request, params }) => {

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
        {
          detailSeance.exerciceSeances.map((exercice, indexExercice) => {
            return (
              <li key={indexExercice}>
                <span>{ exercice.categorie } / { exercice.nomExercice }</span>
                <ul>
                  {
                    exercice.series.map((serie, indexSerie) => {
                      return (
                        <li key={`${indexExercice}-${exercice.nomExercice}-${indexSerie}`}>
                          nombre répétitions : { serie.repetitions }
                        </li>
                      )
                    })
                  }
                </ul>
              </li>
            )
          })
        }
      </ul>

      <Form>
        <SubmitButton>Démarrer la séance</SubmitButton>
      </Form>
    </div>
  )
}
