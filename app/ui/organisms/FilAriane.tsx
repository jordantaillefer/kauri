import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/solid"
import { Link, UIMatch, useMatches } from "@remix-run/react"
import { FunctionComponent } from "react";

const BreadcrumbLink: FunctionComponent<{ to: string, label: string, isDynamic?: boolean }> = ({ to, label, isDynamic = false }) => {
  return (
    <Link to={to} className={`ml-1 md:ml-2 text-xs font-medium text-gray-500 hover:text-gray-700 overflow-ellipsis overflow-hidden whitespace-nowrap ${isDynamic ? "max-w-[5rem] md:max-w-[15rem]": ""}`}>{label}</Link>
  )
}

export const FilAriane = () => {
  const matches = useMatches() as UIMatch<any, { breadcrumb: (match: UIMatch) => { to: string, label: string, isDynamic?: boolean } }>[]

  const parentMatch = matches[2]
  if (!parentMatch) return;
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 md:space-x-2">
        <li className="pl-1 md:pl-4">
          <div>
            <Link to={"/training"}>
              <HomeIcon className="h-5 w-5 flex-shrink-0 text-main-kauri" aria-hidden="true" />
              <span className="sr-only text-xs font-medium text-gray-100 hover:text-gray-100">Home</span>
            </Link>
          </div>
        </li>
        {matches
          .filter(match => match.handle && match.handle.breadcrumb)
          .map((match, index) => (
            <li key={index}>
              <div className="flex items-center">
                <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-main-kauri" aria-hidden="true" />
                <BreadcrumbLink to={match.handle.breadcrumb(parentMatch).to} label={match.handle.breadcrumb(parentMatch).label} isDynamic={match.handle.breadcrumb(parentMatch).isDynamic} />
              </div>
            </li>
          ))}
      </ol>
    </nav>
  )
}
