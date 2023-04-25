import { ActionFunction, json, LoaderFunction, TypedResponse } from "@remix-run/node"
import { Form, useLoaderData, useSubmit } from "@remix-run/react"
import React, { ChangeEvent, FunctionComponent, MouseEventHandler, useState } from "react"
import invariant from "tiny-invariant"

import { container, ExerciceSeanceContrat, SerieExerciceSeanceContrat } from "api"
import { H2Title } from "~/ui/atoms/H2Title"
import { RoundedButton } from "~/ui/atoms/RoundedButton"
import { TrashIcon } from "~/ui/icons/Trash";
import { InputDebounced } from "~/ui/molecules/InputDebounced";

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.idSeance, "params $idSeance required")
  invariant(params.idExerciceSeance, "params $idSeance required")
  const { idSeance, idExerciceSeance } = params
  const formData = await request.formData()
  const { _action } = Object.fromEntries(formData)
  switch (_action) {
    case "mettre-a-jour-temps-repos": {
      const { inputTempsRepos } = Object.fromEntries(formData)
      const payload = { idExerciceSeance, tempsRepos: Number(inputTempsRepos.toString()) }
      await container.resolve("exerciceSeanceController").modifierTempsDeRepos({ request, payload })
      return null
    }
    case "modifier-exercice-seance": {
      const inputRepetitions = formData.getAll("repetitions")
      const listeSerieExerciceSeance = inputRepetitions.map(repetitions => ({ repetitions: +repetitions }))
      const payload = { idSeance, idExerciceSeance, listeSerieExerciceSeance }
      await container.resolve("exerciceSeanceController").definirSerieExerciceSeance({ request, payload })
      return null
    }
  }
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
      <div className="container flex w-full grow flex-col">
        <H2Title>Définir le temps de repos</H2Title>
        <Form method="post" id="form-mettre-a-jour-temps-repos">
          <input type="hidden" key="_action" name="_action" value="mettre-a-jour-temps-repos" />
          <InputDebounced initialValue={exerciceSeance.tempsRepos} form="form-mettre-a-jour-temps-repos" id="input-temps-repos" name="inputTempsRepos" />
          <span>secondes</span>
        </Form>
        <H2Title>Définir les séries</H2Title>
        <div>{exerciceSeance.nomExercice}</div>
        <Form id="modifier-exercice-seance-form" method="post">
          <input type="hidden" key="_action" name="_action" value="modifier-exercice-seance" />
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
                    <TrashIcon />
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
