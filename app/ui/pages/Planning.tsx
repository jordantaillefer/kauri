import { container } from "@/api"
import { DetailSeanceContrat } from "@/api/app/contrats/DetailSeanceContrat"
import { SportifEvenementContrat } from "@/api/app/contrats/SportifEvenementContrat"
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { FunctionComponent, useState } from "react"

import { EvenementPlanning } from "~/domain/EvenementPlanning"
import { JourPlanning } from "~/domain/JourPlanning"
import { H2Title } from "~/ui/atoms/H2Title"
import { AjouterUneSeanceEvenementSideBar } from "~/ui/organisms/AjouterUneSeanceEvenementSideBar"
import { CalendarBody } from "~/ui/organisms/CalendarBody"
import { CalendarMenu } from "~/ui/organisms/CalendarMenu"
import { CalendarModeAffichage } from "~/ui/organisms/CalendarModeAffichage"
import { CalendarUserEvent } from "~/ui/organisms/CalendarUserEvent"
import { CalenderHead } from "~/ui/organisms/CalenderHead"
import { MoisSelecteur } from "~/ui/organisms/MoisSelecteur"
import { useCalendar } from "~/ui/pages/planning/useCalendar"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const resultListerSeance = await container.resolve("seanceQuery").listerSeance({ request })
  const resultListerEvenement = await container.resolve("sportifQuery").listerEvenement({ request })

  const listeSeance = resultListerSeance.data as DetailSeanceContrat[]
  const listeSportifEvenement = resultListerEvenement.data as SportifEvenementContrat[]

  return {
    listeSeance,
    listeSportifEvenement
  }
}
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const { _action } = Object.fromEntries(formData)

  switch (_action) {
    case "ajouter-seance-event": {
      const { idSeance, tempsEvenement, selectedDay } = Object.fromEntries(formData)
      const payload = {
        idSeance: idSeance.toString(),
        tempsEvenement: `${selectedDay.toString()}T${tempsEvenement.toString()}`
      }

      await container.resolve("sportifController").ajouterEvenement({ request, payload })

      break
    }
  }

  return null
}

const ajouterEvenementAuJour = (
  days: JourPlanning[],
  listeSportifEvenement: SportifEvenementContrat[],
  listeSeance: DetailSeanceContrat[]
): JourPlanning[] => {
  const mapSportifEvenement = listeSportifEvenement.reduce((acc, value, id) => {
    const dateEvenement = value.tempsEvenement.split("T")[0]
    acc.set(dateEvenement, [
      ...(acc.get(dateEvenement) || ([] as EvenementPlanning[])),
      {
        name: listeSeance.find(seance => value.idSeance === seance.id)?.nomSeance || "Problème",
        id,
        datetime: value.tempsEvenement,
        time: value.tempsEvenement.split("T")[1]
      }
    ])
    return acc
  }, new Map<string, EvenementPlanning[]>())
  return days.map(day => {
    return {
      ...day,
      evenements: mapSportifEvenement.get(day.date) || []
    }
  })
}

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export const handle = {
  breadcrumb: () => ({ to: "/planning", label: "Mon planning", state: "consulter-planning" })
}

const Planning: FunctionComponent = () => {
  const { isSelected, nextMonth, previousMonth, selectDay, actualDate, selectedDay, setSelectedDay, days } =
    useCalendar()

  const { listeSeance, listeSportifEvenement } = useLoaderData<typeof loader>()

  const [isOpen, setIsOpen] = useState(false)

  const daysAvecEvenement = ajouterEvenementAuJour(days, listeSportifEvenement, listeSeance)

  return (
    <div className="px-4">
      <H2Title>Mon planning</H2Title>
      <div className="lg:flex lg:h-full lg:flex-col 2xl:max-w-[60vw]">
        <header className="flex items-center justify-between border-b border-gray-200 py-4 lg:flex-none">
          <h1 className="text-base font-semibold leading-6 text-gray-900 capitalize">{actualDate()}</h1>
          <div className="flex items-center">
            <MoisSelecteur previousMonth={previousMonth} nextMonth={nextMonth} />
            <CalendarModeAffichage setIsOpen={setIsOpen} />
            <CalendarMenu setIsOpen={setIsOpen} />
          </div>
        </header>
        <div className="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
          <CalenderHead />
          <CalendarBody
            isSelected={isSelected}
            selectDay={selectDay}
            days={daysAvecEvenement}
            setSelectedDay={setSelectedDay}
          />
        </div>
        {selectedDay && <CalendarUserEvent selectedDay={selectedDay} key={selectedDay?.evenements.length} />}
      </div>
      {selectedDay && (
        <AjouterUneSeanceEvenementSideBar isOpen={isOpen} setIsOpen={setIsOpen} selectedDay={selectedDay} />
      )}
    </div>
  )
}
export default Planning
