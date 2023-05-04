import { ChangeEvent, FunctionComponent, useState } from "react"

import { useDebounce } from "~/hooks/useDebounce"

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
    <input
      onChange={event => {
        debouncedOnChange(event)
        setValue(event.target.value)
      }}
      form={form}
      id={id}
      name={name}
      defaultValue={value}
      className="bg-transparent text-primary text-xl w-full"
    />
  )
}
