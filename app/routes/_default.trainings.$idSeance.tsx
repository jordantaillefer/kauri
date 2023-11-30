import { container } from "@/api"
import { DetailSeanceContrat } from "@/api/app/contrats/DetailSeanceContrat"
import { PencilIcon } from "@heroicons/react/24/solid";
import { ActionFunction } from "@remix-run/node"
import { NavLink, Outlet, useFetcher, useOutletContext, useParams, useRouteLoaderData } from "@remix-run/react";
import { AgnosticDataIndexRouteObject } from "@remix-run/router"
import { FunctionComponent, useEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"

import { H2Title } from "~/ui/atoms/H2Title"
import { ListeExerciceSeance } from "~/ui/pages/trainings/ListeExerciceSeance"

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const { _action } = Object.fromEntries(formData)

  switch (_action) {
    case "modifier-nom-seance": {
      const { idSeance, nomSeance } = Object.fromEntries(formData)

      const payload = {
        idSeance: idSeance.toString(),
        nomSeance: nomSeance.toString()
      }
      await container.resolve("seanceController").mettreAJourNomSeance({ request, payload })
      break
    }
    case "supprimer-exercice": {
      const { idExerciceSeance } = Object.fromEntries(formData)

      const payload = {
        idExerciceSeance: idExerciceSeance.toString(),
      }
      await container.resolve("exerciceSeanceController").supprimerExerciceSeance({ request, payload })
      break
    }
  }

  return null
}

export const handle: AgnosticDataIndexRouteObject["handle"] = {
  breadcrumb: ({ params, data }: { params: { idSeance: string }; data: { listeSeance: DetailSeanceContrat[] } }) => {
    if (data) {
      const seanceSelectionne = data.listeSeance.find(seance => seance.id === params.idSeance) as DetailSeanceContrat

      return { to: `/trainings/${params.idSeance}`, label: seanceSelectionne.nomSeance, state: "consulter-seance", isDynamic: true }
    }
    return { to: `/trainings/${params.idSeance}`, label: "Aucune séance", state: "consulter-seance" }
  }
}

const TrainingSeance: FunctionComponent = () => {
  const data = useRouteLoaderData<{ listeSeance: DetailSeanceContrat[] }>("routes/_default.trainings")

  const { lastState } = useOutletContext<{ idSeanceSelectionne: string, lastState: string }>()

  const { idSeance: idSeanceSelectionne, idExerciceSeance: idExerciceSeanceSelectionne } = useParams()

  const [isEditing, setIsEditing] = useState<boolean>(false)

  const seanceSelectionne = data?.listeSeance.find(seance => seance.id === idSeanceSelectionne) as DetailSeanceContrat

  const inputRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const nomSeanceFetcher = useFetcher()

  useEffect(() => {
    setIsEditing(false)
  }, [idSeanceSelectionne])

  const toogle = () => {
    flushSync(() => {
      setIsEditing(true)
    })
    inputRef.current?.focus()
  }
  return (
    <>
      <div
        className={`${lastState === "consulter-seance" || "max-md:hidden"} flex flex-col w-full lg:w-1/3 px-4 h-full border-l border-gray-300`}
      >
        {idSeanceSelectionne ? (
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
                  <button className="text-lg font-bold mb-4 flex items-center" onClick={toogle} ref={buttonRef}>
                    {seanceSelectionne.nomSeance}
                    <span className="pl-4">
                      <PencilIcon className="h-4 w-4 flex-none text-gray-400"/>
                    </span>
                  </button>
                )}
              </nomSeanceFetcher.Form>
              <ListeExerciceSeance exerciceSeances={seanceSelectionne.exerciceSeances} />
            </div>
            <div className="w-full flex justify-center pb-4">
              {idSeanceSelectionne && (
                <NavLink
                  to="ajouter-exercice"
                  className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Ajouter un exercice
                </NavLink>
              )}
            </div>
          </>
        ) : (
          <H2Title>Aucune séance séléctionnée</H2Title>
        )}
      </div>
      <Outlet context={{ lastState }} key={idExerciceSeanceSelectionne} />
    </>
  )
}
export default TrainingSeance