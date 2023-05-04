import { FunctionComponent, MouseEventHandler, PropsWithChildren } from "react"

type RoundedButtonProps = PropsWithChildren<{
  type?: "button" | "submit"
  form?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
}>

export const RoundedButton: FunctionComponent<RoundedButtonProps> = ({
  children,
  onClick,
  type = "button",
  form = ""
}) => {
  return type === "button" ? (
    <button
      type="button"
      form={form}
      onClick={onClick}
      className="text-md inline-block rounded-full bg-primary p-2 md:px-6 md:pt-2.5 md:pb-2 md:text-xs leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
    >
      {children}
    </button>
  ) : (
    <button
      type="submit"
      className="text-md inline-block rounded-full bg-primary p-2 md:px-6 md:pt-2.5 md:pb-2 md:text-xs leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
    >
      {children}
    </button>
  )
}
