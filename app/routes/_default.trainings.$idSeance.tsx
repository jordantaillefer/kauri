import { container, ListeExerciceContrat } from "@/api"
import { DetailSeanceContrat } from "@/api/app/contrats/DetailSeanceContrat"
import { ActionFunction, json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, useFetcher, useLoaderData, useOutletContext } from "@remix-run/react"
import { AgnosticDataIndexRouteObject } from "@remix-run/router";
import { ReasonPhrases } from "http-status-codes"
import { FunctionComponent, useEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"

import { H2Title } from "~/ui/atoms/H2Title"
import { AjouterExerciceModale } from "~/ui/pages/trainings/AjouterExerciceModale"
import { ListeExerciceSeance } from "~/ui/pages/trainings/ListeExerciceSeance"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const resultListerSeance = await container.resolve("seanceQuery").listerSeance({ request })

  const resultListerExercice = await container.resolve("exerciceQuery").listerExercice({ request })

  if (resultListerSeance.reasonPhrase === ReasonPhrases.FORBIDDEN) {
    redirect("/")
  }

  const listeSeance = resultListerSeance.data as DetailSeanceContrat[]
  const listeExercice = resultListerExercice.data as ListeExerciceContrat

  return json({
    listeSeance,
    listeExercice,
    listeCategorie: Object.keys(listeExercice).sort()
  })
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const { _action } = Object.fromEntries(formData)

  switch (_action) {
    case "ajouter-exercice": {
      const { idExercice, tempsRepos, idSeance } = Object.fromEntries(formData)
      const inputSeries = formData.getAll("inputSerie")
      const payload = {
        idSeance: idSeance?.toString(),
        idExercice: idExercice?.toString(),
        tempsRepos: Number(tempsRepos.toString()),
        series: inputSeries.map(inputSerie => Number(inputSerie.toString()))
      }
      await container.resolve("exerciceSeanceController").creerExerciceSeance({ request, payload })
      break
    }
  }

  return null
}

export const handle: AgnosticDataIndexRouteObject["handle"] = {
  breadcrumb: ({ params, data }: { params: { idSeance:string }, data: { listeSeance: DetailSeanceContrat[] }}) => {
    const seanceSelectionne = data.listeSeance.find(seance => seance.id === params.idSeance) as DetailSeanceContrat

    return <Link to={`/trainings/${params.idSeance}`}>{ seanceSelectionne.nomSeance }</Link>
  }
}

const TrainingSeance: FunctionComponent = () => {
  const { listeSeance, listeExercice, listeCategorie } = useLoaderData<typeof loader>()

  const { idSeanceSelectionne } = useOutletContext<{ idSeanceSelectionne: string }>()

  const [isEditing, setIsEditing] = useState<boolean>(false)

  const seanceSelectionne = listeSeance.find(seance => seance.id === idSeanceSelectionne) as DetailSeanceContrat

  const inputRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const nomSeanceFetcher = useFetcher()

  useEffect(() => {
    flushSync(() => {
      setIsEditing(false)
    })
  }, [idSeanceSelectionne])

  const toogle = () => {
    flushSync(() => {
      setIsEditing(true)
    })
    inputRef.current?.focus()
  }
  return (
    <>
      <div>
        <H2Title>Résumé de la séance</H2Title>
        <nomSeanceFetcher.Form method="POST">
          <input type="hidden" name="_action" value="modifier-nom-seance" />
          <input type="hidden" name="idSeance" value={seanceSelectionne.id} />
          {isEditing ? (
            <input
              type="text"
              name="nomSeance"
              id="nomSeance"
              placeholder="Nombre de répétition"
              ref={inputRef}
              defaultValue={seanceSelectionne.nomSeance}
              onKeyDown={event => {
                if (event.key === "Escape") {
                  flushSync(() => {
                    setIsEditing(false)
                  })
                  buttonRef.current?.focus()
                }
                if (event.key === "Enter") {
                  if (inputRef.current?.value !== seanceSelectionne?.nomSeance) {
                    nomSeanceFetcher.submit(event.currentTarget.form)
                  }
                  flushSync(() => {
                    setIsEditing(false)
                  })
                }
              }}
              onBlur={event => {
                if (inputRef.current?.value !== seanceSelectionne?.nomSeance) {
                  nomSeanceFetcher.submit(event.currentTarget.form)
                }
                flushSync(() => {
                  setIsEditing(false)
                })
                buttonRef.current?.focus()
              }}
              className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          ) : (
            <button className="text-lg font-bold mb-4" onClick={toogle} ref={buttonRef}>
              {seanceSelectionne.nomSeance}
            </button>
          )}
        </nomSeanceFetcher.Form>
        <div className="pl-4 h-[75vh]">
          <ListeExerciceSeance exerciceSeances={seanceSelectionne.exerciceSeances} />
        </div>
      </div>
      <div className="w-full flex justify-center pb-4 gap-2">
        {idSeanceSelectionne && (
          <AjouterExerciceModale
            idSeance={idSeanceSelectionne}
            listeExercice={listeExercice}
            listeCategorie={listeCategorie}
          />
        )}
      </div>
    </>
  )
}
export default TrainingSeance
