import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react"
import { FunctionComponent } from "react"
import invariant from "tiny-invariant"

import { container, ExerciceContrat, ExerciceSeanceContrat, ListeExerciceContrat, SeanceContrat } from "api"
import { H2Title } from "~/ui/atoms/H2Title"

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.idSeance, "expected params.idSeance")
  const formData = await request.formData()
  const { _exercice: idExercice } = Object.fromEntries(formData)
  const payload = { idSeance: params.idSeance, idExercice: idExercice.toString() }
  const initialiserExerciceSeanceResult = await container.resolve("exerciceSeanceController").initialiserExerciceSeance({
    request,
    payload
  })
  const nouveauExerciceSeance = initialiserExerciceSeanceResult.data as ExerciceSeanceContrat
  return redirect(nouveauExerciceSeance.id)
}

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.idSeance, "expected params.idSeance")
  const exerciceResult = await container.resolve("exerciceController").listerExercice({ request })
  const payload = { idSeance: params.idSeance }
  const seanceResult = await container.resolve("seanceController").recupererSeanceParId({ request, payload })

  const listeExercice = Array.from((exerciceResult.data as ListeExerciceContrat).entries())
  const seance = seanceResult.data as SeanceContrat

  return json({ listeExercice, seance })
}
export const ModifierSeance: FunctionComponent = () => {
  const {
    listeExercice,
    seance
  } = useLoaderData<{ listeExercice: [string, ExerciceContrat[]][], seance: SeanceContrat }>()
  return (
    <div className="container flex w-full">
      <div className="w-2/4">
        <H2Title>Déroulé de la séance</H2Title>
        <div>
          <span>{seance.nomSeance}</span>
          <ul>
            {
              seance.exerciceSeances.map(exercice => {
                return (
                  <li key={exercice.id}>{exercice.nomExercice}</li>
                )
              })
            }
          </ul>
        </div>
      </div>
      <div className="w-2/4">
        <H2Title>Ajouter un exercice</H2Title>

        <Form method="post">
          {
            listeExercice.map(listeExerciceCategorie => {
              return (
                <ul className="mb-8" key={listeExerciceCategorie[0]}>
                  <li key={listeExerciceCategorie[0]}>{listeExerciceCategorie[0]}</li>
                  {
                    listeExerciceCategorie[1].map(exercice => {
                      return (
                        <li key={exercice.id}>
                          <button
                            type="submit"
                            aria-label="_exercice"
                            value={exercice.id}
                            name="_exercice">
                            {exercice.nomExercice}
                          </button>
                        </li>
                      )
                    })
                  }
                </ul>
              )
            })
          }
        </Form>

      </div>
    </div>
  )
}