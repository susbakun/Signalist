import { SignalModel } from "@/shared/models"
import { ChangeEvent, FocusEvent, useCallback, useEffect, useMemo, useState } from "react"

type SignalModalTopInputsProps = {
  entryValue: SignalModel["entry"]
  stoplossValue: SignalModel["stoploss"]
  quoteAsset?: string
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
  handleStoplossValueChange,
  quoteAsset = "USD"
}: SignalModalTopInputsProps) => {
  const isFirstFocus = useMemo(() => ({ entry: true, stoploss: true }), [])
  const [errors, setErrors] = useState({ entry: "", stoploss: "" })
  const [touched, setTouched] = useState<TouchedStateType>({ entry: false, stoploss: false })
  const [entryInputValue, setEntryInputValue] = useState(
    entryValue === 0 ? "" : entryValue.toString()
  )
  const [stoplossInputValue, setStoplossInputValue] = useState(
    stoplossValue === 0 ? "" : stoplossValue.toString()
  )

  const validateValues = useCallback(() => {
    const newErrors = { entry: "", stoploss: "" }

    if (stoplossValue >= entryValue && entryValue > 0 && stoplossValue > 0) {
      newErrors.stoploss = "Stoploss must be less than entry"
    }

    setErrors(newErrors)
  }, [entryValue, stoplossValue])

  useEffect(() => {
    validateValues()
  }, [validateValues, entryValue, stoplossValue])

  // Update local state when parent state changes
  useEffect(() => {
    setEntryInputValue(entryValue === 0 ? "" : entryValue.toString())
  }, [entryValue])

  useEffect(() => {
    setStoplossInputValue(stoplossValue === 0 ? "" : stoplossValue.toString())
  }, [stoplossValue])

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    const inputName = e.target.name as keyof FocusInputStateType
    if (isFirstFocus[inputName]) {
      e.target.value = ""
      if (inputName === "entry") {
        setEntryInputValue("")
      } else if (inputName === "stoploss") {
        setStoplossInputValue("")
      }
      isFirstFocus[inputName] = false
    }
  }

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const inputName = e.target.name as keyof TouchedStateType
    setTouched((prev) => ({ ...prev, [inputName]: true }))

    // If empty, set to 0 for parent state
    if (e.target.value === "") {
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: "0"
        }
      } as ChangeEvent<HTMLInputElement>

      if (inputName === "entry") {
        handleEntryValueChange(syntheticEvent)
      } else if (inputName === "stoploss") {
        handleStoplossValueChange(syntheticEvent)
      }
    }
  }

  const handleEntryInput = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value

    // Allow empty input for clearing
    if (rawValue === "") {
      setEntryInputValue("")
      return
    }

    // Only process valid number inputs
    const numValue = parseFloat(rawValue)
    if (!isNaN(numValue)) {
      setEntryInputValue(rawValue)
      handleEntryValueChange(e)
    }
  }

  const handleStoplossInput = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value

    // Allow empty input for clearing
    if (rawValue === "") {
      setStoplossInputValue("")
      return
    }

    // Only process valid number inputs
    const numValue = parseFloat(rawValue)
    if (!isNaN(numValue)) {
      setStoplossInputValue(rawValue)
      handleStoplossValueChange(e)
    }
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
                value={entryInputValue}
                name="entry"
                onChange={handleEntryInput}
                required
                onFocus={handleFocus}
                onBlur={handleBlur}
                step="any"
                className={`signal-market-selector w-full ${touched.entry && errors.entry ? "border-red-500" : ""}`}
                type="number"
              />
              <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm md:text-base shrink-0">
                {quoteAsset}
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
                value={stoplossInputValue}
                name="stoploss"
                onChange={handleStoplossInput}
                required
                onFocus={handleFocus}
                onBlur={handleBlur}
                step="any"
                className={`signal-market-selector w-full ${touched.stoploss && errors.stoploss ? "border-red-500" : ""}`}
                type="number"
              />
              <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm md:text-base shrink-0">
                {quoteAsset}
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
