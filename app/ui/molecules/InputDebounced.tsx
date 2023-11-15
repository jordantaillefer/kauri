import { ChangeEvent, FunctionComponent, KeyboardEventHandler, useState } from "react";

import { useDebounce } from "~/hooks/useDebounce"

export const blockInvalidChar: KeyboardEventHandler<HTMLInputElement> = event => {
  event.key.match(/^[a-zA-Z+-]$/) && event.preventDefault()
}
export const InputDebounced: FunctionComponent<{
  initialValue: string | number
  form: string
  id: string
  name: string
}> = ({ initialValue, form, id, name }) => {
  const [value, setValue] = useState(initialValue)

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.target.form?.requestSubmit()
  }

  const debouncedOnChange = useDebounce(onInputChange)

  return (
    <div className="flex flex-row h-10 w-32 rounded-lg relative bg-transparent mt-1">
      <input
        onChange={event => {
          debouncedOnChange(event)
          setValue(event.target.value)
        }}
        type="number"
        form={form}
        id={id}
        name={name}
        defaultValue={value}
        onKeyDown={blockInvalidChar}
        className="focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black md:text-basecursor-default flex items-center text-gray-700 outline-none [appearance:textfield]"
      />
    </div>
  )
}
