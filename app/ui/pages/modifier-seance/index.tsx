import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { FunctionComponent } from "react";
import invariant from "tiny-invariant";

import { container, ExerciceContrat, ExerciceSeanceContrat, ListeExerciceContrat, SeanceContrat } from "api";
import { H2Title } from "~/ui/atoms/H2Title";
import { InputDebounced } from "~/ui/molecules/InputDebounced";

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.idSeance, "expected params.idSeance")
  const formData = await request.formData()
  const { _action } = Object.fromEntries(formData)
  switch (_action) {
    case "mettre-a-jour-nom-seance": {
      const { inputNomSeance } = Object.fromEntries(formData)
      const payload = { idSeance: params.idSeance, nomSeance: inputNomSeance.toString() }
      await container
        .resolve("seanceController")
        .mettreAJourNomSeance({
          request,
          payload
        })
      return null;
    }
    case "ajouter-exercice": {
      const { idExercice } = Object.fromEntries(formData)
      const payload = { idSeance: params.idSeance, idExercice: idExercice.toString() }
      const initialiserExerciceSeanceResult = await container
        .resolve("exerciceSeanceController")
        .initialiserExerciceSeance({
          request,
          payload
        })
      const nouveauExerciceSeance = initialiserExerciceSeanceResult.data as ExerciceSeanceContrat
      return redirect(nouveauExerciceSeance.id)
    }
  }
}

interface LoaderData {
  listeExercice: [string, ExerciceContrat[]][]
  seance: SeanceContrat
}

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.idSeance, "expected params.idSeance")

  const exerciceResult = await container.resolve("exerciceController").listerExercice({ request })
  const payload = { idSeance: params.idSeance }
  const seanceResult = await container.resolve("seanceController").recupererSeanceParId({ request, payload })

  const listeExercice = Array.from((exerciceResult.data as ListeExerciceContrat).entries())
  const seance = seanceResult.data as SeanceContrat

  return json<LoaderData>({ listeExercice, seance })
}

export const ModifierSeance: FunctionComponent = () => {
  const { listeExercice, seance } = useLoaderData<LoaderData>()
  return (
    <div className="container flex w-full">
      <div className="w-2/4">
        <H2Title>Déroulé de la séance</H2Title>
        <div>
          <Form method="post" id="form-mettre-a-jour-nom-seance">
            <input type="hidden" key="_action" name="_action" value="mettre-a-jour-nom-seance" />
            <InputDebounced initialValue={seance.nomSeance} form="form-mettre-a-jour-nom-seance" id="input-nom-seance" name="inputNomSeance" />
          </Form>
          <ul>
            {seance.exerciceSeances.map(exercice => (
              <li key={exercice.id}>
                <Link to={`${exercice.id}`}>
                  {exercice.ordre} / {exercice.nomExercice}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="w-2/4">
        <H2Title>Ajouter un exercice</H2Title>

        <Form method="post">
          <input type="hidden" key="_action" name="_action" value="ajouter-exercice" />
          {listeExercice.map(listeExerciceCategorie => {
            return (
              <ul className="mb-8" key={listeExerciceCategorie[0]}>
                <li key={listeExerciceCategorie[0]}>{listeExerciceCategorie[0]}</li>
                {listeExerciceCategorie[1].map(exercice => {
                  return (
                    <li key={exercice.id}>
                      <button type="submit" aria-label="idExercice" value={exercice.id} name="idExercice">
                        {exercice.nomExercice}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )
          })}
        </Form>
      </div>
    </div>
  )
}
