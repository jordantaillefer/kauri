import { Dialog, Transition } from "@headlessui/react"
import { Bars3Icon } from "@heroicons/react/20/solid"
import {
  CalendarIcon,
  DocumentDuplicateIcon,
  CalendarDaysIcon,
  SunIcon,
  UsersIcon,
  ChatBubbleLeftEllipsisIcon,
  PresentationChartLineIcon,
  XMarkIcon
} from "@heroicons/react/24/solid"
import { NavLink } from "@remix-run/react"
import React, { Fragment, FunctionComponent, useState } from "react"
import { NavLinkProps } from "react-router-dom"

import LogoKauri from "~/images/logo-kauri-dark.png"
import { AccueilButton } from "~/ui/molecules/AccueilButton"

const updateClassNameLinkIfActive: NavLinkProps["className"] = props => {
  return `${
    props.isActive
      ? "bg-gray-50 text-main-kauri group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
      : "text-primary hover:text-indigo-600 hover:bg-gray-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
  }`
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <>
      <Transition.Root show={isSidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 xl:hidden" onClose={setIsSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setIsSidebarOpen(false)}>
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col overflow-y-auto bg-gray-200 px-6 ring-1 ring-white/10">
                  <div className="flex items-center h-10 pt-2 md:h-20 shrink-0 justify-center w-full">
                    <img className="h-4 md:h-6 w-auto" src={LogoKauri} alt="Kauri" />
                  </div>
                  <nav className="flex flex-1 flex-col justify-between h-full">
                    <ul className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul className="-mx-2 space-y-1">
                          {navigation.map(item => (
                            <li key={item.name}>
                              <NavLink to={item.to} className={updateClassNameLinkIfActive}>
                                <item.icon className={"h-6 w-6 shrink-0"} aria-hidden="true" />
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
                          <UsersIcon
                            className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-main-kauri"
                            aria-hidden="true"
                          />
                          Se déconnecter
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      <div className="md:hidden border-b">
        <button type="button" className="py-2.5 px-4 md:hidden text-gray-900 flex justify-between w-full items-center" onClick={() => setIsSidebarOpen(true)}>
          <span className="sr-only">Open sidebar</span>
          <img className="h-3 w-auto" src={LogoKauri} alt="Kauri" />
          <Bars3Icon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <div className="hidden md:flex fixed z-20 h-full flex-col justify-between w-80 py-4 px-8 border-r border-gray-300 bg-background-main shadow-lg">
        <div className="flex h-16 items-center justify-center md:space-x-6">
          <AccueilButton />
        </div>
        <nav className="flex flex-1 flex-col justify-between h-full">
          <ul className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul className="-mx-2 space-y-1">
                {navigation.map(item => (
                  <li key={item.name}>
                    <NavLink to={item.to} className={updateClassNameLinkIfActive}>
                      <item.icon className={"h-6 w-6 shrink-0"} aria-hidden="true" />
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
    </>
  )
}
