import { Dialog, Transition } from "@headlessui/react"
import { Link } from "@remix-run/react"
import { Fragment } from "react"

export const AjouterExerciceModal = (props: { show: boolean, onClose: () => void }) => {
  return <Transition appear show={props.show} as={Fragment}>
    <Dialog as="div" className="relative z-10" onClose={props.onClose}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black bg-opacity-25" />
      </Transition.Child>

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel
              className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                Ajouter un exercice
              </Dialog.Title>
              <div className="mt-2">
                <div className="grid gap-[var(--gap)] grid-cols-responsive-sm py-[max(5vw,_2rem)]">
                  <Link to="/programme/creer-programme"
                        className="grid place-items-center h-20 p-2 rounded-md bg-teal-700 bg-gradient-to-tr from-primary-lighter to-primary shadow-lg shadow-primary/50">
                    ICONE1
                  </Link>
                  <Link to="/programme/creer-programme"
                        className="grid place-items-center h-20 p-2 rounded-md bg-teal-700 bg-gradient-to-tr from-primary-lighter to-primary shadow-lg shadow-primary/50">
                    ICONE2
                  </Link>
                  <Link to="/programme/creer-programme"
                        className="grid place-items-center h-20 p-2 rounded-md bg-teal-700 bg-gradient-to-tr from-primary-lighter to-primary shadow-lg shadow-primary/50">
                    ICONE3
                  </Link>
                  <Link to="/programme/creer-programme"
                        className="grid place-items-center h-20 p-2 rounded-md bg-teal-700 bg-gradient-to-tr from-primary-lighter to-primary shadow-lg shadow-primary/50">
                    ICONE4
                  </Link>
                  <Link to="/programme/creer-programme"
                        className="grid place-items-center h-20 p-2 rounded-md bg-teal-700 bg-gradient-to-tr from-primary-lighter to-primary shadow-lg shadow-primary/50">
                    ICONE5
                  </Link>
                  <Link to="/programme/creer-programme"
                        className="grid place-items-center h-20 p-2 rounded-md bg-teal-700 bg-gradient-to-tr from-primary-lighter to-primary shadow-lg shadow-primary/50">
                    ICONE6
                  </Link>
                  <Link to="/programme/creer-programme"
                        className="grid place-items-center h-20 p-2 rounded-md bg-teal-700 bg-gradient-to-tr from-primary-lighter to-primary shadow-lg shadow-primary/50">
                    ICONE7
                  </Link>
                  <Link to="/programme/creer-programme"
                        className="grid place-items-center h-20 p-2 rounded-md bg-teal-700 bg-gradient-to-tr from-primary-lighter to-primary shadow-lg shadow-primary/50">
                    ICONE8
                  </Link>
                  <Link to="/programme/creer-programme"
                        className="grid place-items-center h-20 p-2 rounded-md bg-teal-700 bg-gradient-to-tr from-primary-lighter to-primary shadow-lg shadow-primary/50">
                    ICONE9
                  </Link>

                </div>
              </div>

              {/*<div className="mt-4">*/}
              {/*  <button*/}
              {/*    type="button"*/}
              {/*    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"*/}
              {/*    onClick={props.onClose}*/}
              {/*  >*/}
              {/*    Got it, thanks!*/}
              {/*  </button>*/}
              {/*</div>*/}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
}