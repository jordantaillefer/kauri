const formatter = Intl.DateTimeFormat("fr-Fr", { // <- re-use me
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
})

export function format(date: Date): string {
  return formatter.format(date)
}
