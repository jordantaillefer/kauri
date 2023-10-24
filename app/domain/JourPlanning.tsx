import { EvenementPlanning } from "~/domain/EvenementPlanning";

export type JourPlanning = {
  date: string
  isCurrentMonth: boolean
  isToday: boolean
  evenements: EvenementPlanning[]
}
