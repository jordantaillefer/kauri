function PresentationKauri() {
  return <>
    <h2
      className="text-sm font-semibold tracking-wide text-gray-700 uppercase">
      Bienvenue sur Kauri
    </h2>
    <h1
      className="pb-2 mt-3 md:my-5 text-4xl font-extrabold leading-10 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary-darker via-primary-lighter to-primary-darker ">
      Ré-inventer votre idée du fitness
    </h1>
    <p
      className="max-w-2xl mt-0 text-base text-left text-gray-600 md:text-center lg:text-left sm:mt-2 md:mt-0 sm:text-base lg:text-lg xl:text-xl">
      Valebats messis in rugensis civitas! Lamia cresceres, tanquam fortis musa. Cotta de neuter fraticinida,
      visum extum!
    </p>
  </>
}

function ImagePresentationKauri() {
  return (
    <img src="/assets/images/image-presentation-homepage.png"
         className="w-full max-w-3xl sm:w-auto" />
  )
}

export function BlocPresentation() {
  return <div className="flex items-center">
    <div className="px-8 xl:px-5 mx-auto max-w-7xl">
      <div className="flex flex-col items-center pt-8 lg:flex-row">
        <div
          className="flex flex-col mb-16 items-center lg:pr-12 lg:items-start lg:w-1/2 lg:mb-0">
          <PresentationKauri />
        </div>
        <div className="flex w-full mb-16 lg:w-1/2 lg:mb-0">
          <ImagePresentationKauri />
        </div>
      </div>
    </div>
  </div>
}