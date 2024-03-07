import { Dispatch, SetStateAction } from "react"

import { JourPlanning } from "~/domain/JourPlanning"
import { classNames } from "~/utils/ClassNames"

export const CalendarBody = ({
  days,
  selectDay,
  isSelected,
  setSelectedDay
}: {
  days: JourPlanning[]
  selectDay: (day: JourPlanning) => void
  isSelected: (day: JourPlanning) => boolean
  setSelectedDay: Dispatch<SetStateAction<JourPlanning | null>>
}) => {
  return (
    <div className="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
      <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px">
        {days.map(day => (
          <button
            key={day.date}
            onClick={() => selectDay(day)}
            className={classNames(
              isSelected(day) ? "bg-white shadow-inner" : day.isCurrentMonth ? "bg-white" : "bg-gray-50 text-gray-500",
              "flex flex-col relative px-3 py-2 min-h-16"
            )}
          >
            <time
              dateTime={day.date}
              className={classNames(
                day.isToday
                  ? "flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white"
                  : "flex",
                isSelected(day) ? "font-semibold" : ""
              )}
            >
              {day.date.split("-").pop()?.replace(/^0/, "")}
            </time>
            {day.evenements.length > 0 && (
              <ol className="mt-1">
                {day.evenements.slice(0, 2).map(event => (
                  <li key={event.id} className={isSelected(day) ? "font-semibold" : ""}>
                    <span className="group flex">
                      <time dateTime={event.datetime} className="mr-2 hidden flex-none text-gray-500 xl:block leading-4">
                        {event.time}
                      </time>
                      <span className="text-gray-900 leading-4 text-left">
                        {isSelected(day)} {event.name}
                      </span>
                    </span>
                  </li>
                ))}
                {day.evenements.length > 2 && <li className="text-gray-500 leading-4 flex">+ {day.evenements.length - 2} de plus</li>}
              </ol>
            )}
          </button>
        ))}
      </div>
      <div className="isolate grid w-full grid-cols-7 grid-rows-6 gap-px lg:hidden">
        {days.map(day => (
          <button
            key={day.date}
            type="button"
            onClick={() => setSelectedDay(day)}
            className={classNames(
              day.isCurrentMonth ? "bg-white" : "bg-gray-50",
              isSelected(day) || day.isToday ? "font-semibold" : "",
              isSelected(day) ? "text-white" : "",
              !isSelected(day) && day.isToday ? "text-indigo-600" : "",
              !isSelected(day) && day.isCurrentMonth && !day.isToday ? "text-gray-900" : "",
              !isSelected(day) && !day.isCurrentMonth && !day.isToday ? "text-gray-500" : "",
              "flex h-14 flex-col px-3 py-2 hover:bg-gray-100 focus:z-10"
            )}
          >
            <time
              dateTime={day.date}
              className={classNames(
                isSelected(day) ? "flex h-6 w-6 items-center justify-center rounded-full" : "",
                isSelected(day) && day.isToday ? "bg-indigo-600" : "",
                isSelected(day) && !day.isToday ? "bg-gray-900" : "",
                "ml-auto"
              )}
            >
              {day.date.split("-").pop()?.replace(/^0/, "")}
            </time>
            <span className="sr-only">{day.evenements.length} events</span>
            {day.evenements.length > 0 && (
              <span className="-mx-0.5 mt-auto flex flex-wrap-reverse">
                {day.evenements.map(event => (
                  <span key={event.id} className="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-gray-400" />
                ))}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
