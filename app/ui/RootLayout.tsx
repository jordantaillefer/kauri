import * as React from "react"

interface RootLayoutProps {
  children: React.ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-white pb-10">
      <header className="relative z-30 bg-white">
        <div className="px-8 mx-auto xl:px-5 max-w-7xl">
          <div
            className="flex items-center justify-between h-24 border-b-2 border-gray-100 md:justify-start md:space-x-6">
            <div className="inline-flex">
              <a href="#">Accueil</a>
            </div>
            <nav className="flex items-center justify-end flex-1 hidden w-full h-full space-x-10 md:flex">
              <div className="relative h-full select-none">
                <div
                  className="inline-flex items-center h-full space-x-2 text-base font-medium leading-6 transition duration-150 ease-in-out cursor-pointer select-none group hover:text-wave-600 focus:outline-none focus:text-wave-600 text-gray-500">
                  <span>Product</span>
                </div>
              </div>
              <div className="w-1 h-5 mx-10 border-r border-gray-300" />
              <a href="/auth/google/"
                 className="text-base font-medium leading-6 text-gray-500 whitespace-no-wrap hover:text-wave-600 focus:outline-none focus:text-gray-900">
                Se connecter
              </a>
              <div id="g_id_onload"
                   data-client_id="539084172730-ca6lr4q71vdplucjhhphduja4bsjch9g.apps.googleusercontent.com"
                   data-context="signin"
                   data-ux_mode="redirect"
                   data-login_uri="http://localhost:3000"
                   data-auto_prompt="false">
              </div>
              <div className="g_id_signin"
                   data-type="standard"
                   data-shape="rectangular"
                   data-theme="outline"
                   data-text="signin"
                   data-size="large"
                   data-locale="fr"
                   data-logo_alignment="left">
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main id="main" className="flex-grow overflow-x-hidden">
        {children}
      </main>
    </div>)
}