import {
  CalendarIcon,
  DocumentDuplicateIcon,
  CalendarDaysIcon,
  SunIcon,
  UsersIcon,
  ChatBubbleLeftEllipsisIcon,
  PresentationChartLineIcon
} from "@heroicons/react/24/solid"
import { NavLink } from "@remix-run/react"
import { FunctionComponent } from "react"
import { NavLinkProps } from "react-router-dom"

import { AccueilButton } from "~/ui/molecules/AccueilButton"
import { SeConnecterButton } from "~/ui/molecules/SeConnecterButton"

const updateClassNameLinkIfActive: NavLinkProps["className"] = props => {
  return `${props.isActive ? "bg-gray-50 text-main-kauri group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold" : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"}`
}

const navigation = [
  { name: "Ma journée", to: "day", icon: SunIcon },
  { name: "Mes séances", to: "trainings", icon: DocumentDuplicateIcon },
  { name: "Mes statistiques", to: "statistiques", icon: PresentationChartLineIcon },
  { name: "Planning d'entrainement", to: "planning", icon: CalendarDaysIcon },
  { name: "Explorer les programmes", to: "explore", icon: CalendarIcon },
  { name: "Discussions", to: "chat", icon: ChatBubbleLeftEllipsisIcon }
]

export const SideBar: FunctionComponent<{ authenticated: boolean }> = ({ authenticated }) => {
  return (
    <div className="hidden lg:flex flex-col justify-between w-80 py-4 px-8 border-r border-gray-300 bg-background-main shadow-lg">
      <div className="flex h-16 items-center justify-center md:space-x-6">
        <AccueilButton />

        {!authenticated && (
          <div className="flex h-full w-full flex-1 items-center justify-end space-x-10">
            <SeConnecterButton />
          </div>
        )}
      </div>
      <nav className="flex flex-1 flex-col justify-between h-full">
        <ul className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul className="-mx-2 space-y-1">
              {navigation.map(item => (
                <li key={item.name}>
                  <NavLink
                    to={item.to}
                    className={updateClassNameLinkIfActive}
                  >
                    <item.icon
                      className={
                        "h-6 w-6 shrink-0"
                      }
                      aria-hidden="true"
                    />
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </li>
          <li className="mt-auto">
            <a
              href="/"
              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-main-kauri"
            >
              <UsersIcon className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-main-kauri" aria-hidden="true" />
              Se déconnecter
            </a>
          </li>
        </ul>
      </nav>
    </div>
  )
}
