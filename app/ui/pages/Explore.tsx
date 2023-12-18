import { SeanceExplorationContrat } from "@/api/app/contrats/SeanceExplorationContrat"
import * as serverModule from "@/api/index.server"
import { Menu, Transition } from "@headlessui/react"
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid"
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"
import { NavLink, Outlet, UIMatch, useLoaderData, useMatches } from "@remix-run/react"
import { Fragment, FunctionComponent } from "react"

import { Titre } from "~/ui/shared/Titre"
import { randomBgColor } from "~/utils/RandomBgColor"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const resultListerSeanceExploration = await serverModule.container
    .resolve("seanceExplorationQuery")
    .listerSeanceExploration({ request })

  const listeSeanceExploration = resultListerSeanceExploration.data as SeanceExplorationContrat[]
  return {
    listeSeance: listeSeanceExploration
  }
}
export const handle = {
  breadcrumb: () => ({ to: "/explore", label: "Explorer les séances", state: "explorer-seance" })
}

const Explore: FunctionComponent = () => {
  const { listeSeance } = useLoaderData<typeof loader>()
  const matches = useMatches() as UIMatch<
    any,
    { breadcrumb: (match: UIMatch) => { to: string; label: string; state: string } }
  >[]

  const lastMatch = matches[matches.length - 1]
  const lastState = lastMatch.handle.breadcrumb(lastMatch).state

  return (
    <div className="flex h-full">
      <div
        className={`${lastState === "explorer-seance" || "max-md:hidden"} px-4 w-full ${
          lastState === "consulter-seance" && "lg:w-2/3"
        } `}
      >
        <Titre as="h2">Explorer les séances</Titre>

        <div className="flow-root">
          <div className="-mx-4 -my-2 md:overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                      Créateur
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Nom de la séance
                    </th>
                    <th scope="col" className="max-sm:hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Nombre d'exercice
                    </th>
                    <th
                      scope="col"
                      className="md:w-40 px-3 md:px-6 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {listeSeance.map(seance => (
                    <tr key={seance.nomSeance}>
                      <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                        <div className="flex items-center sm:pl-4">
                          <p
                            style={{ backgroundColor: `${randomBgColor(seance.nomUtilisateur)}` }}
                            className={
                              "h-6 w-6 md:h-10 md:w-10 flex items-center justify-center rounded-lg text-white md:text-2xl font-bold object-cover ring-1 ring-gray-900/10"
                            }
                          >
                            {seance.nomUtilisateur.at(0)}
                          </p>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{seance.nomUtilisateur}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap py-5 text-sm text-gray-500">
                        <div className="text-gray-900 max-w-[40vw] md:max-w-full overflow-hidden overflow-ellipsis">
                          {seance.nomSeance}
                        </div>
                      </td>
                      <td className="max-sm:hidden whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        {seance.nombreExercicesSeance} exercices
                      </td>
                      <td className="whitespace-nowrap py-5 px-4 text-sm text-gray-500">
                        <NavLink
                          to={seance.id}
                          className="hidden md:block rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Voir cette séance
                        </NavLink>
                        <Menu as="div" className="md:hidden relative flex w-full justify-center">
                          <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                            <span className="sr-only">Open options</span>
                            <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                          </Menu.Button>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                              <Menu.Item>
                                <NavLink to={seance.id} className="bg-gray-50 flex justify-center text-black">
                                  Voir cette séance
                                </NavLink>
                              </Menu.Item>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Outlet context={{ lastState }} />
    </div>
  )
}
export default Explore
