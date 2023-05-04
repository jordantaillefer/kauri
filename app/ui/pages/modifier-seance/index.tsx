import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node"
import { Form, Link, useLoaderData } from "@remix-run/react"
import { FunctionComponent, useState } from "react";
import invariant from "tiny-invariant"

import { Categorie } from "./Categorie"
import { CategorieSelector } from "./CategorieSelector"
import { container, ExerciceContrat, ExerciceSeanceContrat, ListeExerciceContrat, SeanceContrat } from "api"
import { H2Title } from "~/ui/atoms/H2Title"
import { InputDebounced } from "~/ui/molecules/InputDebounced"

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.idSeance, "expected params.idSeance")
  const formData = await request.formData()
  const { _action } = Object.fromEntries(formData)
  switch (_action) {
    case "mettre-a-jour-nom-seance": {
      const { inputNomSeance } = Object.fromEntries(formData)
      const payload = { idSeance: params.idSeance, nomSeance: inputNomSeance.toString() }
      await container.resolve("seanceController").mettreAJourNomSeance({
        request,
        payload
      })
      return null
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
  categorie: Categorie
}

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.idSeance, "expected params.idSeance")

  const exerciceResult = await container.resolve("exerciceController").listerExercice({ request })
  const payload = { idSeance: params.idSeance }
  const seanceResult = await container.resolve("seanceController").recupererSeanceParId({ request, payload })

  const listeExercice = Array.from((exerciceResult.data as ListeExerciceContrat).entries())
  const seance = seanceResult.data as SeanceContrat

  const url = new URL(request.url)

  const categorie = (url.searchParams.get("categorie") as Categorie) || Categorie.RESUME_SEANCE

  return json<LoaderData>({ listeExercice, seance, categorie })
}

export const ModifierSeance: FunctionComponent = () => {
  const { listeExercice, seance, categorie } = useLoaderData<LoaderData>()

  const [selectedCategorie, setSelectedCategorie] = useState<number>(0)

  return (
    <div className="container flex w-full flex-col">
      <CategorieSelector baseUrl={`/seance/${seance.id}`} categorie={categorie} />
      {categorie === Categorie.RESUME_SEANCE && (
        <>
          <H2Title>Déroulé de la séance</H2Title>

          <div>
            <Form method="post" id="form-mettre-a-jour-nom-seance">
              <input type="hidden" key="_action" name="_action" value="mettre-a-jour-nom-seance" />
              <InputDebounced
                initialValue={seance.nomSeance}
                form="form-mettre-a-jour-nom-seance"
                id="input-nom-seance"
                name="inputNomSeance"
              />
            </Form>
            <ul className="mt-4 text-primary">
              {seance.exerciceSeances.map(exercice => (
                <li key={exercice.id} className="mb-2">
                  <Link to={`${exercice.id}`} className="flex gap-4 items-center">
                    <span className="bg-primary text-white border-2 border-primary rounded-full px-3 py-1">{exercice.ordre}</span>
                    <span>{exercice.nomExercice}</span>
                  </Link>
                  <span className="before:block before:bg-primary before:w-px before:h-4 before:ml-[18px] after:block after:bg-primary after:w-px after:h-4 after:ml-[18px]">
                    {exercice.tempsRepos} sec
                  </span>
                </li>
              ))}
              <li>
                <div className="flex gap-4 items-center">
                  <span className="bg-primary text-white border-2 border-primary rounded-full px-3 py-1">⭐️</span>
                  <span>Fin de la séance</span>
                </div>
              </li>
            </ul>
          </div>
        </>
      )}
      {categorie === Categorie.AJOUTER_EXERCICE && (
        <>
          <H2Title>Ajouter un exercice</H2Title>

          <Form method="post">
            <input type="hidden" key="_action" name="_action" value="ajouter-exercice" />
            {listeExercice.map((listeExerciceCategorie, index) => {
              return index === selectedCategorie && (
                 <ul className="mb-8 text-primary" key={listeExerciceCategorie[0]}>
                  <li key={listeExerciceCategorie[0]} className="mb-4">
                    <div className="flex w-full justify-center gap-4">
                      <button type="button" className="bg-primary text-white border-2 border-primary rounded-full px-3 py-1" onClick={() => setSelectedCategorie((listeExercice.length + selectedCategorie - 1) % listeExercice.length)}>{"<-"}</button>
                      <span className="bg-primary text-white border-2 border-primary rounded-full px-3 py-1">{listeExerciceCategorie[0]}</span>
                      <button type="button" className="bg-primary text-white border-2 border-primary rounded-full px-3 py-1" onClick={() => setSelectedCategorie((index + 1) % listeExercice.length)}>{"->"}</button>
                    </div>
                  </li>
                  {listeExerciceCategorie[1].map(exercice => {
                    return (
                      <li key={exercice.id} className="mb-2">
                        <button type="submit" aria-label="idExercice" className="flex text-start border-2 p-2 w-full border-primary" value={exercice.id} name="idExercice">
                          {exercice.nomExercice}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )
            })}
          </Form>
        </>
      )}
    </div>
  )
}
