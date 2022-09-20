function HomePage() {
  return (
    <>
      <div className="relative flex items-center w-full">
        <div className="relative z-20 px-8 mx-auto xl:px-5 max-w-7xl">
          <div className="flex flex-col items-center h-full pt-8 pb-48 lg:flex-row">
            <div
              className="flex flex-col items-start w-full mb-16 md:items-center lg:pr-12 lg:items-start lg:w-1/2 lg:mb-0">
              <h2
                className="text-sm font-semibold tracking-wide text-gray-700 uppercase duration-700 ease-out transform sm:text-base lg:text-sm xl:text-base transition-all visible translate-y-0 scale-100 opacity-100">
                Bienvenue sur Kauri
              </h2>
              <h1
                className="pb-2 mt-3 text-4xl font-extrabold leading-10 tracking-tight text-transparent duration-700 ease-out delay-150 transform bg-clip-text bg-gradient-to-r from-green-600 via-green-400 to-green-800 scale-10 md:my-5 sm:leading-none lg:text-5xl xl:text-6xl transition-all visible translate-y-0 scale-100 opacity-100">Ré-inventer
                votre idée du fitness</h1>
              <p
                className="max-w-2xl mt-0 text-base text-left text-gray-600 duration-700 ease-out delay-300 transform md:text-center lg:text-left sm:mt-2 md:mt-0 sm:text-base lg:text-lg xl:text-xl transition-all visible translate-y-0 scale-100 opacity-100">
                Valebats messis in rugensis civitas! Lamia cresceres, tanquam fortis musa. Cotta de neuter fraticinida,
                visum extum!
              </p>
              <div
                className="w-full mt-5 duration-700 ease-out transform delay-450 sm:mt-8 sm:flex sm:justify-center lg:justify-start sm:w-auto transition-all visible translate-y-0 opacity-100">
                <div className="rounded-md">
                  <button
                     className="flex items-center justify-center w-full px-8 py-3 text-base font-medium leading-6 text-white transition duration-150 ease-in-out border border-transparent rounded-md bg-primary hover:bg-wave-600 focus:outline-none focus:border-wave-600 focus:shadow-outline-indigo md:py-4 md:text-lg md:px-10">
                    S'enregistrer
                  </button>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <a href="#"
                     className="flex items-center justify-center w-full px-8 py-3 text-base font-medium leading-6 text-green-700 transition duration-150 ease-in-out bg-green-100 border-2 border-transparent rounded-md hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-300 md:py-4 md:text-lg md:px-10">
                    En savoir plus
                  </a>
                </div>
              </div>
            </div>
            <div className="flex w-full mb-16 lg:w-1/2 lg:mb-0">
              <div
                className="relative duration-1000 delay-100 transform transition-all visible translate-y-0 opacity-100">
                <img src="https://wave.devdojo.com/storage/themes/February2018/mFajn4fwpGFXzI1UsNH6.png"
                     className="w-full max-w-3xl sm:w-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-40 -mt-64">
        <svg viewBox="0 0 120 28" className="-mt-64">
          <defs>
            <path id="wave"
                  d="M 0,10 C 30,10 30,15 60,15 90,15 90,10 120,10 150,10 150,15 180,15 210,15 210,10 240,10 v 28 h -240 z"></path>
          </defs>
          <use id="wave3" className="wave" xlinkHref="#wave" x="0" y="-2"></use>
          <use id="wave2" className="wave" xlinkHref="#wave" x="0" y="0"></use>
          <use id="wave1" className="wave" xlinkHref="#wave" x="0" y="1"></use>
        </svg>
      </div>
    </>
  )
}

export default HomePage