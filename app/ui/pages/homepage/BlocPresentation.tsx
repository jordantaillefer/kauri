function PresentationKauri() {
  return (
    <>
      <h2 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">Bienvenue sur Kauri</h2>
      <h1 className="pb-2 mt-3 md:my-5 text-4xl font-extrabold leading-10 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary-darker via-primary-lighter to-primary-darker ">
        Ré-inventer votre idée du fitness
      </h1>
    </>
  )
}

export function BlocPresentation() {
  return (
    <div className="flex items-center">
      <div className="px-8 xl:px-5 mx-auto max-w-7xl">
        <div className="flex flex-col items-center pt-8 lg:flex-row">
          <div className="flex flex-col mb-16 items-center lg:pr-12 lg:items-start lg:w-1/2 lg:mb-0">
            <PresentationKauri />
          </div>
        </div>
      </div>
    </div>
  )
}
