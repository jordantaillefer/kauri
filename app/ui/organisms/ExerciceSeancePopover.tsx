import { Popover, Transition } from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { Fragment, FunctionComponent, PropsWithChildren } from "react";

export const ExerciceSeancePopover: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <Popover className="relative">
      <Popover.Button className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
        <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute z-10 w-64 mt-5 right-0 flex max-w-max px-4">
          <div className="w-screen max-w-sm flex-auto rounded-3xl bg-white p-2 text-sm leading-6 shadow-lg ring-1 ring-gray-900/5 divide-y divide-gray-100">
            { children }
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}
