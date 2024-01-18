import { addDays, format, isToday, parseISO, subDays } from "date-fns";
import { fr } from "date-fns/locale"
import { useState } from "react";
import type { JourPlanning } from "~/domain/JourPlanning";

export const useCalendar = () => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [selectedDay, setSelectedDay] = useState<JourPlanning | null>(null)

  const isSelected = (date: JourPlanning) => {
    return date.date === selectedDay?.date
  }

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedYear(selectedYear + 1)
    }
    setSelectedMonth((selectedMonth + 1) % 12)
  }
  const previousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedYear(selectedYear - 1)
    }
    setSelectedMonth((selectedMonth - 1) % 12)
  }

  const selectDay = (day: JourPlanning) => {
    setSelectedDay(day)
  }

  const formatSelectedDay = (day: JourPlanning) => {
    return format(parseISO(day?.date), "dd MMMM yyyy")
  }

  const actualDate = () => format(new Date(selectedYear, selectedMonth), "MMMM yyyy", { locale: fr })

  const genererListeDesJours = (selectedMonth: number, selectedYear: number): JourPlanning[] => {
    const premierJour = new Date(selectedYear, selectedMonth, 1)

    const premierJourPlanning: JourPlanning = {
      date: format(premierJour, "yyyy-MM-dd"),
      isToday: false,
      isCurrentMonth: true,
      evenements: []
    }
    const listeDesJours: JourPlanning[] = []
    listeDesJours.push(premierJourPlanning)

    let dateCalcule = subDays(premierJour, 1)

    while (dateCalcule.getDay() !== 0) {
      listeDesJours.push({
        date: format(dateCalcule, "yyyy-MM-dd"),
        isToday: false,
        isCurrentMonth: false,
        evenements: []
      })
      dateCalcule = subDays(dateCalcule, 1)
    }

    dateCalcule = addDays(premierJour, 1)

    while (dateCalcule.getDate() > premierJour.getDate()) {
      listeDesJours.push({
        date: format(dateCalcule, "yyyy-MM-dd"),
        isToday: isToday(dateCalcule),
        isCurrentMonth: true,
        evenements: []
      })
      dateCalcule = addDays(dateCalcule, 1)
    }

    while (listeDesJours.length < 42) {
      listeDesJours.push({
        date: format(dateCalcule, "yyyy-MM-dd"),
        isToday: false,
        isCurrentMonth: false,
        evenements: []
      })
      dateCalcule = addDays(dateCalcule, 1)
    }

    return listeDesJours.sort((jourPlanning1, jourPlanning2) => jourPlanning1.date.localeCompare(jourPlanning2.date))
  }

  return {
    isSelected,
    nextMonth,
    previousMonth,
    selectDay,
    formatSelectedDay,
    actualDate,
    selectedDay,
    setSelectedDay,
    days: genererListeDesJours(selectedMonth, selectedYear)
  }
}
