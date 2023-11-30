import { container, ListeExerciceContrat } from "@/api";
import { DetailSeanceContrat } from "@/api/app/contrats/DetailSeanceContrat"
import { PencilIcon } from "@heroicons/react/24/solid";
import type { ActionFunction, LoaderFunctionArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { NavLink, Outlet, UIMatch, useLoaderData, useMatches, useParams } from "@remix-run/react";
import { ReasonPhrases } from "http-status-codes"
import { FunctionComponent } from "react"

import { H2Title } from "~/ui/atoms/H2Title"
import { CreerSeanceCard } from "~/ui/organisms/CreerSeanceCard"
import { RandomBgColor } from "~/utils/RandomBgColor";

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
    case "creer-seance": {
      await container.resolve("seanceController").initialiserSeance({ request })
      break
    }
  }

  return null
}

export const handle = {
  breadcrumb: () => ({ to: "/trainings", label: "Mes séances", state: "lister-seance" })
}

const randomBgColor = (nomSeance: string) => {
  const randomNumber = nomSeance.split("").reduce((acc, value) => {
    return acc + value.charCodeAt(0);
    }, 0)
  return  `${RandomBgColor[randomNumber % RandomBgColor.length]}`
}

const Trainings: FunctionComponent = () => {
  const { listeSeance } = useLoaderData<typeof loader>()
  const matches = useMatches() as UIMatch<any, { breadcrumb: (match: UIMatch) => { to: string, label: string, state: string } }>[]

  const lastMatch = matches[matches.length - 1]
  const lastState = lastMatch.handle.breadcrumb(lastMatch).state

  const { idSeance } = useParams()

  return (
    <div className="flex h-full">
      <div
        className={`${lastState === "lister-seance" || "max-md:hidden"} ${
          lastState === "ajouter-exercice" || lastState === "modifier-exercice" ? "lg:w-1/3" : "lg:w-2/3"
        } px-4 w-full md:w-1/2`}
      >
        <H2Title>Mes séances</H2Title>
        <ul className="grid grid-cols-1 gap-x-4 gap-y-4 lg:grid-cols-2 xl:gap-x-8">
          {listeSeance.map(seance => (
            <li
              key={seance.id}
              className={`overflow-hidden rounded-xl border shadow-sm ${
                seance.id === idSeance ? "border-main-kauri" : "border-gray-200"
              }`}
            >
              <NavLink className="w-full" to={seance.id}>
                <div className="flex items-center justify-between border-b border-gray-900/5 bg-white p-3 md:p-4">
                  <div className="flex items-center gap-x-4">
                    <p
                      style={{ backgroundColor: `${randomBgColor(seance.nomSeance)}` }}
                      className={
                        "h-12 w-12 flex items-center justify-center rounded-lg text-white text-2xl font-bold object-cover ring-1 ring-gray-900/10"
                      }
                    >
                      {seance.nomSeance.at(0)}
                    </p>
                    <div className="text-sm font-medium leading-6 text-gray-900">{seance.nomSeance}</div>
                  </div>
                  <PencilIcon className="h-4 w-4 text-gray-400" />
                </div>
                <dl className="-mt-1 divide-y divide-gray-100 px-6 py-2 text-sm leading-6 bg-gray-50">
                  <div className="flex justify-between gap-x-4 py-3">
                    <dt className="text-gray-500">Nombre d'exercice</dt>
                    <dd className="text-gray-700">
                      {`${seance.exerciceSeances.length} exercice${seance.exerciceSeances.length > 1 ? "s" : ""}`}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-x-4 py-3">
                    <dt className="text-gray-500">Dernière réalisation</dt>
                    <dd className="flex items-start gap-x-2">
                      <div className="font-medium text-gray-900">29 Novembre 2024</div>
                    </dd>
                  </div>
                </dl>
              </NavLink>
            </li>
          ))}
          <li>
            <CreerSeanceCard />
          </li>
        </ul>
      </div>
      <Outlet context={{ lastState }}></Outlet>
    </div>
  )
}

export default Trainings
