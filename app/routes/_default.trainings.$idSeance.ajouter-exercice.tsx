import { ExerciceContrat, ListeExerciceContrat } from "@/api/app/contrats"
import { CATEGORIE } from "@/api/exercice/domain/categorie"
import * as serverModule from "@/api/index.server"
import { ChevronRightIcon } from "@heroicons/react/24/solid"
import { ActionFunction, redirect } from "@remix-run/node"
import { useFetcher, useOutletContext, useParams, useRouteLoaderData } from "@remix-run/react"
import { AgnosticDataIndexRouteObject } from "@remix-run/router"
import { Fragment, FunctionComponent, useState } from "react"

import { FormulaireSerieExerciceSeance, SerieCreation } from "~/ui/pages/trainings/FormulaireSerieExerciceSeance";
import { Select } from "~/ui/shared/Select"
import { Titre } from "~/ui/shared/Titre"
import { AVAILABLE_MUSCLE } from "~/utils/AvailableMuscle"
import { removeAccents } from "~/utils/RemoveAccents";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const { _action } = Object.fromEntries(formData)

  switch (_action) {
    case "ajouter-exercice": {
      const { idExercice, idSeance } = Object.fromEntries(formData)
      const listeNombreRepetition = formData.getAll("nombreRepetitions")
      const listeTempsRepos = formData.getAll("tempsRepos")
      const listePoids = formData.getAll("poids")
      const payload = {
        idSeance: idSeance?.toString(),
        idExercice: idExercice?.toString(),
        series: listeNombreRepetition.map((inputSerie, index) => ({
          repetitions: Number(inputSerie.toString()),
          tempsRepos: Number(listeTempsRepos.at(index)?.toString() || 45),
          poids: Number(listePoids.at(index)?.toString() || 0)
        }))
      }
      await serverModule.container.resolve("exerciceSeanceController").creerExerciceSeance({ request, payload })
      return redirect(`/trainings/${idSeance}`)
    }
  }
}

export const handle: AgnosticDataIndexRouteObject["handle"] = {
  breadcrumb: ({ params }: { params: { idSeance: string } }) => {
    return {
      to: `/trainings/${params.idSeance}/ajouter-exercice`,
      label: "Ajouter un exercice",
      state: "ajouter-exercice"
    }
  }
}

const MessageDefautAucuneCategorie = "Filtrer par catégorie";
const AjouterExerciceSeance: FunctionComponent = () => {
  const { lastState } = useOutletContext<{ lastState: string }>()
  const { idSeance: idSeanceSelectionne } = useParams()

  const [exerciceSelectionne, setExerciceSelectionne] = useState<ExerciceContrat | null>(null)
  const [listeSerie, setListeSerie] = useState<SerieCreation[]>([
    { id: 0, tempsRepos: "45", nombreRepetitions: "12", poids: "0" }
  ])
  const [filtreExercice, setFiltreExercice] = useState<string>("")
  const [filtreCategorie, setFiltreCategorie] = useState<string>(MessageDefautAucuneCategorie)

  const data = useRouteLoaderData<{ listeExercice: ListeExerciceContrat, listeCategorie: string[] }>("routes/_default.trainings")

  const fetcher = useFetcher<{ nbSerie: number }>({ key: "ajouter-exercice" })

  if (!data) return null

  const listeExercice = Object.values(data.listeExercice).flatMap(exercices => exercices)
  const sortedListeByCategorie = filtreCategorie !== MessageDefautAucuneCategorie ? listeExercice.filter(exercice => exercice.categorie === filtreCategorie) : listeExercice

  const sortedListeExercice = sortedListeByCategorie
    .filter(exercice => removeAccents(exercice.nomExercice).toLowerCase().includes(removeAccents(filtreExercice).toLowerCase()))
    .sort((exercice1, exercice2) => exercice1.nomExercice.localeCompare(exercice2.nomExercice))

 const listeCategorie = [MessageDefautAucuneCategorie, ...data.listeCategorie]

  return (
    <div
      className={`${
        lastState === "ajouter-exercice" ? "" : "max-md:hidden"
      } flex flex-col w-full lg:w-1/3 px-4 h-full border-l border-gray-300 divide-y divide-gray-200`}
    >
      <Titre as="h2">Ajouter un exercice</Titre>
      {exerciceSelectionne ? (
        <fetcher.Form method="POST">
          <input type="hidden" name="_action" value="ajouter-exercice" />
          <input type="hidden" name="idSeance" value={idSeanceSelectionne} />
          <input type="hidden" name="idExercice" value={exerciceSelectionne.id} />
          <FormulaireSerieExerciceSeance exerciceSelectionne={exerciceSelectionne} setExerciceSelectionne={setExerciceSelectionne} listeSerie={listeSerie} setListeSerie={setListeSerie} />
          <div className="w-full flex justify-center mt-4">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Confirmer la création
            </button>
          </div>
        </fetcher.Form>
      ) : (
        <>
          <div className="w-full py-2">
            <Select itemSelectionne={filtreCategorie} setItemSelectionne={setFiltreCategorie} listeItem={listeCategorie}/>
          </div>
          <div className="w-full py-2">
            <input
              type="filtreExercice"
              name="filtreExercice"
              id="filtreExercice"
              onChange={event => setFiltreExercice(event.target.value)}
              className="block w-full rounded-md border-0 py-1.5 pl-3 my-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Rechercher un exercice..."
            />
          </div>
          <ul className="divide-y divide-main-kauri-lighter overflow-auto">
            {sortedListeExercice.map(exercice => (
              <li
                key={exercice.id}
                className="group relative flex justify-between gap-x-6 py-3 hover:bg-gray-50"
              >
                <div className="flex min-w-0 gap-x-4">
                  <img
                    className="h-12 w-12 flex-none rounded-full bg-gray-50"
                    src={AVAILABLE_MUSCLE[exercice.categorie as CATEGORIE]}
                    alt=""
                  />
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold leading-6 text-gray-900">
                      <button className="flex text-left" onClick={() => setExerciceSelectionne(exercice)}>
                        <span className="absolute inset-x-0 -top-px bottom-0" />
                        {exercice.nomExercice}
                      </button>
                    </p>
                    <p className="mt-1 flex text-xs leading-5 text-gray-500">
                      <span className="relative truncate hover:underline">{exercice.categorie}</span>
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-x-4">
                  <div className="hidden sm:flex sm:flex-col sm:items-end">
                    <p className="text-background-main group-hover:text-primary text-sm leading-6 text-gray-900">
                      Ajouter
                    </p>
                  </div>
                  <ChevronRightIcon className="h-5 w-5 flex-none text-main-kauri-lighter" aria-hidden="true" />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
export default AjouterExerciceSeance
