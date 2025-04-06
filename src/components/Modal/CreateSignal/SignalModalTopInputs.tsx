import { SignalModel } from "@/shared/models"
import { ChangeEvent, FocusEvent, useCallback, useEffect, useMemo, useState } from "react"

type SignalModalTopInputsProps = {
  entryValue: SignalModel["entry"]
  stoplossValue: SignalModel["stoploss"]
  handleEntryValueChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleStoplossValueChange: (e: ChangeEvent<HTMLInputElement>) => void
}

type FocusInputStateType = {
  entry: boolean
  stoploss: boolean
}

type TouchedStateType = {
  entry: boolean
  stoploss: boolean
}

export const SignalModalTopInputs = ({
  entryValue,
  stoplossValue,
  handleEntryValueChange,
  handleStoplossValueChange
}: SignalModalTopInputsProps) => {
  const isFirstFocus = useMemo(() => ({ entry: true, stoploss: true }), [])
  const [errors, setErrors] = useState({ entry: "", stoploss: "" })
  const [touched, setTouched] = useState<TouchedStateType>({ entry: false, stoploss: false })

  const validateValues = useCallback(() => {
    const newErrors = { entry: "", stoploss: "" }

    if (stoplossValue >= entryValue) {
      newErrors.stoploss = "Stoploss must be less than entry"
    }

    setErrors(newErrors)
  }, [entryValue, stoplossValue])

  useEffect(() => {
    validateValues()
  }, [validateValues, entryValue, stoplossValue])

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    const inputName = e.target.name as keyof FocusInputStateType
    if (isFirstFocus[inputName]) {
      e.target.value = ""
      isFirstFocus[inputName] = false
    }
  }

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const inputName = e.target.name as keyof TouchedStateType
    setTouched((prev) => ({ ...prev, [inputName]: true }))
  }

  return (
    <div className="flex justify-center max-w-full">
      <div className="flex flex-col w-full max-w-md gap-4">
        <div className="flex flex-col w-full">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-sm md:text-base min-w-[60px] md:min-w-[70px] shrink-0">
              Entry:
            </span>
            <div className="flex flex-1 items-center min-w-[120px]">
              <input
                value={entryValue}
                name="entry"
                onChange={handleEntryValueChange}
                required
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={`signal-market-selector w-full ${touched.entry && errors.entry ? "border-red-500" : ""}`}
                type="number"
              />
              <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm md:text-base shrink-0">
                USD
              </span>
            </div>
          </div>
          {touched.entry && errors.entry && (
            <span className="text-red-500 text-sm mt-1 ml-2 md:ml-[80px]">{errors.entry}</span>
          )}
        </div>
        <div className="flex flex-col w-full">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-sm md:text-base min-w-[60px] md:min-w-[70px] shrink-0">
              Stoploss:
            </span>
            <div className="flex flex-1 items-center min-w-[120px]">
              <input
                value={stoplossValue}
                name="stoploss"
                onChange={handleStoplossValueChange}
                required
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={`signal-market-selector w-full ${touched.stoploss && errors.stoploss ? "border-red-500" : ""}`}
                type="number"
              />
              <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm md:text-base shrink-0">
                USD
              </span>
            </div>
          </div>
          {touched.stoploss && errors.stoploss && (
            <span className="text-red-500 text-sm mt-1 ml-2 md:ml-[80px]">{errors.stoploss}</span>
          )}
        </div>
      </div>
    </div>
  )
}
