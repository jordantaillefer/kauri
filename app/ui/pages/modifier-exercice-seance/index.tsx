import { ActionFunction, json, LoaderFunction, TypedResponse } from "@remix-run/node"
import { Form, useLoaderData, useSubmit } from "@remix-run/react"
import React, { ChangeEvent, FunctionComponent, MouseEventHandler, useState } from "react"
import invariant from "tiny-invariant"

import { container, ExerciceSeanceContrat, SerieExerciceSeanceContrat } from "api"
import { H2Title } from "~/ui/atoms/H2Title"
import { RoundedButton } from "~/ui/atoms/RoundedButton"

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.idSeance, "params $idSeance required")
  invariant(params.idExerciceSeance, "params $idSeance required")
  const { idSeance, idExerciceSeance } = params
  const formData = await request.formData()

  const inputRepetitions = formData.getAll("repetitions")
  const listeSerieExerciceSeance = inputRepetitions.map(repetitions => ({ repetitions: +repetitions }))
  const payload = { idSeance, idExerciceSeance, listeSerieExerciceSeance }
  await container.resolve("exerciceSeanceController").definirSerieExerciceSeance({ request, payload })

  return null
}

export const loader: LoaderFunction = async ({
  request,
  params
}): Promise<TypedResponse<{ exerciceSeance: ExerciceSeanceContrat }>> => {
  invariant(params.idSeance, "params $idSeance required")
  invariant(params.idExerciceSeance, "params $idSeance required")
  const { idSeance, idExerciceSeance } = params
  const payload = { idSeance, idExerciceSeance }
  const response = await container.resolve("exerciceSeanceController").recupererExerciceSeance({
    request,
    payload
  })
  const exerciceSeance = response.data as ExerciceSeanceContrat

  return json({ exerciceSeance })
}

export const ModifierExerciceSeance: FunctionComponent = () => {
  const { exerciceSeance } = useLoaderData<{ exerciceSeance: ExerciceSeanceContrat }>()

  const handleChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const newFormValues = [...formValues]
    newFormValues[index].repetitions = Number(event.target.value)
    setFormValues(newFormValues)
  }

  const addFormFields = () => {
    setFormValues([...formValues, { repetitions: 0 }])
  }

  const removeFormFields = (index: number) => {
    const newFormValues = [...formValues]
    newFormValues.splice(index, 1)
    setFormValues(newFormValues)
  }

  const submit = useSubmit()

  const submitForm: MouseEventHandler<HTMLButtonElement> = event => {
    submit(event.currentTarget)
  }

  const initSerieExerciceSeance = (listeSerieExerciceSeance: SerieExerciceSeanceContrat[]) => {
    return listeSerieExerciceSeance.length
      ? listeSerieExerciceSeance.map(serieExerciceSeance => ({ repetitions: serieExerciceSeance.repetitions }))
      : [{ repetitions: 0 }]
  }

  const [formValues, setFormValues] = useState(initSerieExerciceSeance(exerciceSeance.listeSerieExerciceSeance))
  return (
    <>
      <div className="container w-full flex flex-col grow">
        <H2Title>Définir les séries</H2Title>
        <div>{exerciceSeance.nomExercice}</div>
        <Form id="modifier-exercice-seance-form" method="post">
          <ul>
            {formValues.map((formValue, index) => {
              return (
                <li key={index}>
                  <span>{index + 1}</span>
                  <input
                    type="number"
                    name="repetitions"
                    value={formValue.repetitions}
                    onFocus={event => event.target.select()}
                    onChange={e => handleChange(index, e)}
                    placeholder="Nombre de répétition"
                  />
                  <button type="button" onClick={() => removeFormFields(index)}>
                    suppr
                  </button>
                </li>
              )
            })}
          </ul>
          <button type="button" onClick={() => addFormFields()}>
            Ajouter une série
          </button>
        </Form>
      </div>
      <div>
        this will be the footer
        <RoundedButton type="button" form="modifier-exercice-seance-form" onClick={submitForm}>
          Confirmer
        </RoundedButton>
      </div>
    </>
  )
}
