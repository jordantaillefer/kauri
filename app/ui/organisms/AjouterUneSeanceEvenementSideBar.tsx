import { Dialog, Transition } from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/24/solid"
import { useFetcher, useLoaderData } from "@remix-run/react"
import { Dispatch, Fragment, SetStateAction, useState } from "react"

import { JourPlanning } from "~/domain/JourPlanning"
import { SeanceCard } from "~/ui/organisms/SeanceCard"
import { loader } from "~/ui/pages/Planning"
import { useCalendar } from "~/ui/pages/planning/useCalendar"
import { LISTE_HEURE } from "~/utils/ListeHeure"

export const AjouterUneSeanceEvenementSideBar = ({
  isOpen,
  setIsOpen,
  selectedDay
}: {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  selectedDay: JourPlanning
}) => {
  const { listeSeance } = useLoaderData<typeof loader>()

  const ajouterSeanceEvenementFetcher = useFetcher({ key: "ajouter-seance-event" })
  const [idSelectedSeanceEvenement, setIdSelectedSeanceEvenement] = useState<string | null>(null)
  const { formatSelectedDay } = useCalendar()

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setIsOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl justify-between">
                    <ajouterSeanceEvenementFetcher.Form method="POST" className="h-full">
                      {idSelectedSeanceEvenement && (
                        <input type="hidden" name="idSeance" value={idSelectedSeanceEvenement} />
                      )}
                      <input type="hidden" name="selectedDay" value={selectedDay.date} />
                      <input type="hidden" name="_action" value="ajouter-seance-event" />
                      <div className="flex flex-col justify-between">
                        <div className="px-4 sm:px-6">
                          <div className="flex items-start justify-between">
                            <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                              Ajouter une séance pour le {selectedDay && formatSelectedDay(selectedDay)}
                            </Dialog.Title>
                            <div className="ml-3 flex h-7 items-center">
                              <button
                                type="button"
                                className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                onClick={() => setIsOpen(false)}
                              >
                                <span className="absolute -inset-2.5" />
                                <span className="sr-only">Fermer le panel</span>
                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col mx-6">
                          <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                            Heure de réalisation
                          </label>
                          <div className="mt-2">
                            <select
                              id="tempsEvenement"
                              name="tempsEvenement"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            >
                              {LISTE_HEURE.map(heure => (
                                <option key="heure" value={heure}>
                                  {heure}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="relative mt-6 flex-1 px-4 sm:px-6 space-y-4 py-2 max-h-[75vh] overflow-y-scroll flex flex-col">
                          {listeSeance.map(seance => (
                            <button className="text-left" key={seance.id} type="button" onClick={() => setIdSelectedSeanceEvenement(seance.id)}>
                              <SeanceCard
                                name={seance.nomSeance}
                                description={`${seance.exerciceSeances.length} exercice${
                                  seance.exerciceSeances.length > 1 ? "s" : ""
                                }`}
                                active={seance.id === idSelectedSeanceEvenement}
                              ></SeanceCard>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <button
                          type="submit"
                          className="rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
                        >
                          Ajouter cette séance
                        </button>
                      </div>
                    </ajouterSeanceEvenementFetcher.Form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
