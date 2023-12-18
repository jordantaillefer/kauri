import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

export const MoisSelecteur = ({ previousMonth, nextMonth }: { previousMonth: () => void; nextMonth: () => void }) => {
  return (
    <div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
      <button
        type="button"
        onClick={previousMonth}
        className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
      >
        <span className="sr-only">Mois précédent</span>
        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        className="hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
      >
        Aujourd'hui
      </button>
      <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
      <button
        type="button"
        onClick={nextMonth}
        className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
      >
        <span className="sr-only">Mois suivant</span>
        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  )
}
