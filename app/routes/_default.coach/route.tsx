import { PencilIcon } from "@heroicons/react/24/solid"
import { NavLink } from "@remix-run/react"
import { FunctionComponent } from "react";

import IllustrationCoachKauri from "~/images/coach-sportif.webp"
import { Titre } from "~/ui/shared/Titre"
import { randomBgColor } from "~/utils/RandomBgColor"

export const handle = {
  breadcrumb: () => ({ to: "/chat", label: "Espace coach", state: "espace-coach" })
}
const Coach: FunctionComponent = () => {
  return (
    <div className="px-4">
      <Titre as={"h2"}>Rechercher un coach</Titre>
      <main className="grid grid-cols-12">
        <div className="col-span-8 pr-4">
          <ul className=" grid grid-cols-1 gap-x-2 gap-y-4 md:grid-cols-2 xl:gap-x-4">
            <li key={"coach-1"} className={"overflow-hidden rounded-xl border shadow-sm border-gray-200"}>
              <NavLink className="w-full" to="#">
                <div className="flex items-center justify-between border-b border-gray-900/5 bg-white p-3 md:p-4">
                  <div className="flex items-center gap-x-4">
                    <p
                      style={{ backgroundColor: `${randomBgColor("Jordan Taillefer")}` }}
                      className={
                        "h-12 w-12 flex items-center justify-center rounded-lg text-white text-2xl font-bold object-cover ring-1 ring-gray-900/10"
                      }
                    >
                      J
                    </p>
                    <div className="text-sm font-medium leading-6 text-gray-900">Jordan Taillefer</div>
                  </div>
                  <PencilIcon className="h-4 w-4 text-gray-400" />
                </div>
                <dl className="-mt-1 divide-y divide-gray-100 px-6 py-2 text-sm leading-6 bg-gray-50">
                  <div className="flex justify-between gap-x-4 py-3">
                    <dt className="text-gray-500">Spécialité</dt>
                    <dd className="text-gray-700">
                      <span className="inline-flex items-center rounded-md bg-blue-400/10 px-2 m-1 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/20">
                        Perte de gras
                      </span>
                      <span className="inline-flex items-center rounded-md bg-red-400/10 px-2 m-1 py-1 text-xs font-medium text-red-400 ring-1 ring-inset ring-red-400/20">
                        Remise en forme
                      </span>
                      <span className="inline-flex items-center rounded-md bg-green-400/10 px-2 m-1 py-1 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-400/20">
                        Prise de masse
                      </span>
                    </dd>
                  </div>
                </dl>
              </NavLink>
            </li>
            <li key={"coach-1"} className={"overflow-hidden rounded-xl border shadow-sm border-gray-200"}>
              <NavLink className="w-full" to="#">
                <div className="flex items-center justify-between border-b border-gray-900/5 bg-white p-3 md:p-4">
                  <div className="flex items-center gap-x-4">
                    <p
                      style={{ backgroundColor: `${randomBgColor("Clément Auprêtre")}` }}
                      className={
                        "h-12 w-12 flex items-center justify-center rounded-lg text-white text-2xl font-bold object-cover ring-1 ring-gray-900/10"
                      }
                    >
                      C
                    </p>
                    <div className="text-sm font-medium leading-6 text-gray-900">Clément Auprêtre</div>
                  </div>
                  <PencilIcon className="h-4 w-4 text-gray-400" />
                </div>
                <dl className="-mt-1 divide-y divide-gray-100 px-6 py-2 text-sm leading-6 bg-gray-50">
                  <div className="flex justify-between gap-x-4 py-3">
                    <dt className="text-gray-500">Spécialité</dt>
                    <dd className="text-gray-700">
                      <span className="inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/20">
                        Perte de gras
                      </span>
                    </dd>
                  </div>
                </dl>
              </NavLink>
            </li>
            <li key={"coach-1"} className={"overflow-hidden rounded-xl border shadow-sm border-gray-200"}>
              <NavLink className="w-full" to="#">
                <div className="flex items-center justify-between border-b border-gray-900/5 bg-white p-3 md:p-4">
                  <div className="flex items-center gap-x-4">
                    <p
                      style={{ backgroundColor: `${randomBgColor("François Bonnet")}` }}
                      className={
                        "h-12 w-12 flex items-center justify-center rounded-lg text-white text-2xl font-bold object-cover ring-1 ring-gray-900/10"
                      }
                    >
                      F
                    </p>
                    <div className="text-sm font-medium leading-6 text-gray-900">Francois Bonnet</div>
                  </div>
                  <PencilIcon className="h-4 w-4 text-gray-400" />
                </div>
                <dl className="-mt-1 divide-y divide-gray-100 px-6 py-2 text-sm leading-6 bg-gray-50">
                  <div className="flex justify-between gap-x-4 py-3">
                    <dt className="text-gray-500">Spécialité</dt>
                    <dd className="text-gray-700">
                      <span className="inline-flex items-center rounded-md bg-red-400/10 px-2 m-1 py-1 text-xs font-medium text-red-400 ring-1 ring-inset ring-red-400/20">
                        Remise en forme
                      </span>
                      <span className="inline-flex items-center rounded-md bg-green-400/10 px-2 m-1 py-1 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-400/20">
                        Prise de masse
                      </span>
                    </dd>
                  </div>
                </dl>
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="border-l col-span-4 px-4">
          <p className="flex justify-center pb-4">Je cherche un coach</p>
          <img className="rounded-full ring-4 ring-main-kauri bg-gray-50 mb-4" src={IllustrationCoachKauri} alt="" />
          <span className="font-bold">Qu'est qu'un coach Kauri ?</span>
          <ul>
            <li>Un suivi des séances de sport</li>
            <li>Un suivi de la nutrition</li>
            <li>Un soutien au quotidien</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
export default Coach
