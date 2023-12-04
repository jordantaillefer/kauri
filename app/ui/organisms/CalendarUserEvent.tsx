import { ClockIcon } from "@heroicons/react/24/solid";

import { JourPlanning } from "~/domain/JourPlanning";

export const CalendarUserEvent = ({ selectedDay }: { selectedDay: JourPlanning }) => {
  return (
    <>
      { selectedDay.evenements.length > 0 && (
        <div className="px-4 py-10 sm:px-6 lg:hidden">
          <ol
            className="divide-y divide-gray-100 overflow-hidden rounded-lg bg-white text-sm shadow ring-1 ring-black ring-opacity-5">
            {selectedDay.evenements.map(event => (
              <li key={event.time} className="group flex p-4 pr-6 focus-within:bg-gray-50 hover:bg-gray-50">
                <div className="flex-auto">
                  <p className="font-semibold text-gray-900">{event.name}</p>
                  <time dateTime={event.datetime} className="mt-2 flex items-center text-gray-700">
                    <ClockIcon className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                    {event.time}
                  </time>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </>
  );
};
