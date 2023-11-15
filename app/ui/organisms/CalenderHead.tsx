const CalendarHeaders = ["Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam.", "Dim."];
export const CalenderHead = () => {
  return (
    <div
      className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
      {
        CalendarHeaders.map(header => (<div className="bg-white py-2" key={`header-${header}`}>{header}</div>))
      }
    </div>
  );
};
