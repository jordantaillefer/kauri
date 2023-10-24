import {
  EntrainementContrat,
  ExerciceEntrainementContrat,
  SerieEntrainementContrat
} from "@/api/app/contrats/EntrainementContrat"
import { useLoaderData, useSubmit } from "@remix-run/react"
import { useEffect, useState } from "react"

export function useEntrainement() {
  const { entrainement, prochainExercice, prochaineSerie } = useLoaderData<{
    entrainement: EntrainementContrat
    prochainExercice: ExerciceEntrainementContrat
    prochaineSerie: SerieEntrainementContrat
  }>()

  const [time, setTime] = useState<number>(0)
  const [initialTime, setInitialTime] = useState<number>(0)
  const [tempsRepos, setTempsRepos] = useState<number>(0)
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false)

  const submit = useSubmit()

  const demarrerRepos = async () => {
    await setTime(prochainExercice.tempsRepos)
    await setTempsRepos(prochainExercice.tempsRepos)
    await setInitialTime(Date.now())
    const formData = new FormData()
    formData.set("idSerie", prochaineSerie.id)
    formData.set("idExercice", prochainExercice.id)
    submit(formData, {
      method: "post"
    })
    setIsTimerActive(true)
  }

  useEffect(() => {
    if (isTimerActive) {
      const interval = setInterval(() => {
        if (time <= 0) {
          clearInterval(interval)
          setIsTimerActive(false)
        } else {
          const remainingTime = Date.now()
          setTime(tempsRepos - Math.trunc((remainingTime - initialTime) / 1000))
        }
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isTimerActive, initialTime, time, prochainExercice.tempsRepos, tempsRepos])

  return {
    nomSeance: entrainement.nomSeance,
    prochainExercice,
    prochaineSerie,
    demarrerRepos,
    isTimerActive,
    time
  }
}
