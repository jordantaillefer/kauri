function PresentationKauri() {
  return (
    <>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-700">Bienvenue sur Kauri</h2>
      <h1 className="mt-3 bg-gradient-to-r bg-clip-text pb-2 text-4xl font-extrabold leading-10 tracking-tight text-transparent from-primary-darker via-primary-lighter to-primary-darker md:my-5">
        Ré-inventer votre idée du fitness
      </h1>
    </>
  )
}

export function BlocPresentation() {
  return (
    <div className="flex items-center">
      <div className="mx-auto max-w-7xl px-8 xl:px-5">
        <div className="flex flex-col items-center pt-8 lg:flex-row">
          <div className="mb-16 flex flex-col items-center lg:mb-0 lg:w-1/2 lg:items-start lg:pr-12">
            <PresentationKauri />
          </div>
        </div>
      </div>
    </div>
  )
}
