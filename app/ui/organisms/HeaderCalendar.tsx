const ItemDate = ({
  date,
  selected
}: {
  date: { daysAndMonth: string; days: string }
  selected: string
}) => {
  return (
    <button
      type="submit"
      className={date.daysAndMonth === selected ? "font-bold" : ""}
      name="day"
      value={date.daysAndMonth}
    >
      <p>{date.daysAndMonth}</p>
      <p>{date.days}</p>
    </button>
  )
}
export const HeaderCalendar = ({ dates, selected, categorie }: {
  dates: { daysAndMonth: string; days: string }[]
  selected: string
                                    categorie: string
}
) => {

  return (
    <div className="border-b border-primary-transparent mt-4 h-16">
      <form method="GET">
        <input type="hidden" name="categorie" value={categorie} />
        <ul className="flex w-full h-full text-primary">
          {dates.map(date => (
            <li className="w-1/5 flex items-center justify-center flex-col" key={date.daysAndMonth}>
              <ItemDate date={date} selected={selected} />
            </li>
          ))}
        </ul>
      </form>
    </div>
  )
}
