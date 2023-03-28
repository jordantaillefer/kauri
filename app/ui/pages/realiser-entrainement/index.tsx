import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node"
import { useLoaderData, useSubmit } from "@remix-run/react"
import { FunctionComponent, useCallback, useEffect, useState } from "react"
import invariant from "tiny-invariant"

import {
  EntrainementContrat,
  ExerciceEntrainementContrat,
  SerieEntrainementContrat
} from "../../../../src/app/contrats/EntrainementContrat"
import { container } from "api"
import { H2Title } from "~/ui/atoms/H2Title"
import { PrimaryButton } from "~/ui/atoms/PrimaryButton"

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

  if (!prochainExercice) {
    return redirect("/")
  }

  return json({
    entrainement,
    prochainExercice,
    prochaineSerie
  })
}

export const RealiserEntrainement: FunctionComponent = () => {
  const { entrainement, prochainExercice, prochaineSerie } = useLoaderData<{
    entrainement: EntrainementContrat
    prochainExercice: ExerciceEntrainementContrat
    prochaineSerie: SerieEntrainementContrat
  }>()

  const [time, setTime] = useState<number>(0)
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false)

  const submit = useSubmit()

  const demarrerRepos = async () => {
    await setTime(prochainExercice.tempsRepos)
    setIsTimerActive(true)
  }

  const nextExercice = useCallback(() => {
    setIsTimerActive(false)
    setTime(0)
    const formData = new FormData()
    formData.set("idSerie", prochaineSerie.id)
    formData.set("idExercice", prochainExercice.id)
    submit(formData, {
      method: "post"
    })
  }, [prochainExercice.id, prochaineSerie.id, submit])

  useEffect(() => {
    if (isTimerActive) {
      const interval = setInterval(() => {
        if (time === 0) {
          clearInterval(interval)
          nextExercice()
        } else {
          setTime(time - 1)
        }
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isTimerActive, time, nextExercice, prochainExercice.tempsRepos])

  return (
    <div className="container">
      <H2Title>Entrainement : {entrainement.nomSeance}</H2Title>
      {isTimerActive ? (
        <>
          <p>Temps de repos {time} secondes</p>
        </>
      ) : (
        <>
          <ul>
            <li>
              Exercice à réaliser : N°{prochainExercice.ordre} / {prochainExercice.nomExercice}
            </li>
            <li>
              Série n°{prochaineSerie.ordre} : {prochaineSerie.nombreRepetition} répétitions
            </li>

            <li>Temps Repos : {prochainExercice.tempsRepos}</li>
          </ul>

          <PrimaryButton onClick={demarrerRepos}>Valider serie</PrimaryButton>
        </>
      )}
    </div>
  )
}
