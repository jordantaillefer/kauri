import { DetailSeanceContrat } from "@/api/app/contrats/DetailSeanceContrat"
import { SportifEvenementContrat } from "@/api/app/contrats/SportifEvenementContrat"
import * as serverModule from "@/api/index.server"
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { FunctionComponent, useState } from "react"

import { EvenementPlanning } from "~/domain/EvenementPlanning"
import { JourPlanning } from "~/domain/JourPlanning"
import { AjouterUneSeanceEvenementSideBar } from "~/routes/_default.planning/AjouterUneSeanceEvenementSideBar"
import { CalendarBody } from "~/routes/_default.planning/CalendarBody"
import { CalendarHead } from "~/routes/_default.planning/CalendarHead"
import { CalendarMenu } from "~/routes/_default.planning/CalendarMenu"
import { CalendarModeAffichage } from "~/routes/_default.planning/CalendarModeAffichage"
import { CalendarUserEvent } from "~/routes/_default.planning/CalendarUserEvent"
import { MoisSelecteur } from "~/routes/_default.planning/MoisSelecteur"
import { useCalendar } from "~/routes/_default.planning/useCalendar"
import { Titre } from "~/ui/shared/Titre"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const resultListerSeance = await serverModule.getContainer().resolve("seanceQuery").listerSeance({ request })
  const resultListerEvenement = await serverModule.getContainer().resolve("sportifQuery").listerEvenement({ request })

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

      await serverModule.getContainer().resolve("sportifController").ajouterEvenement({ request, payload })

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
      <Titre as="h2">Mon planning</Titre>
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
          <CalendarHead />
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
