import { SignalModel } from "@/shared/models"
import { ChangeEvent, FocusEvent, useEffect, useState } from "react"
import { IoTrash } from "react-icons/io5"

type SignalModalTargetsListProps = {
  index: number
  target: SignalModel["targets"][0]
  entryValue: number
  previousTargetValue?: number
  quoteAsset?: string
  handleRemoveTarget: (removedTargetId: string) => void
  handleTargetValueChange: (e: ChangeEvent<HTMLInputElement>, targetId: string) => void
}

export const SignalModalTargetsList = ({
  index,
  target,
  entryValue,
  previousTargetValue,
  handleRemoveTarget,
  handleTargetValueChange,
  quoteAsset = "USD"
}: SignalModalTargetsListProps) => {
  const [error, setError] = useState("")
  const [touched, setTouched] = useState(false)
  const [inputValue, setInputValue] = useState(target.value === 0 ? "" : target.value.toString())

  useEffect(() => {
    let newError = ""
    const numValue = target.value

    if (numValue <= 0) {
      newError = `Target ${index + 1} must be greater than 0`
    } else if (numValue <= entryValue) {
      newError = `Target ${index + 1} must be greater than entry (${entryValue})`
    } else if (previousTargetValue && numValue <= previousTargetValue) {
      newError = `Target ${index + 1} must be greater than previous target (${previousTargetValue})`
    }

    setError(newError)
  }, [target.value, entryValue, previousTargetValue, index])

  useEffect(() => {
    // Update local input when parent state changes
    setInputValue(target.value === 0 ? "" : target.value.toString())
  }, [target.value])

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    if (e.target.value === "0") {
      e.target.value = ""
      setInputValue("")
    }
  }

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setTouched(true)

    // If empty, set to 0 or minimum allowable value
    if (e.target.value === "") {
      const minValue = Math.max(0, entryValue > 0 ? entryValue + 0.00001 : 0)
      setInputValue(minValue.toString())

      // Create synthetic event to update parent
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: minValue.toString()
        }
      } as ChangeEvent<HTMLInputElement>

      handleTargetValueChange(syntheticEvent, target.id)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value

    // Allow empty string for clearing the input
    if (rawValue === "") {
      setInputValue("")
      return
    }

    // Only accept valid number inputs
    const numValue = parseFloat(rawValue)
    if (!isNaN(numValue)) {
      setInputValue(rawValue)
      handleTargetValueChange(e, target.id)
    }
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-wrap items-center gap-2 px-2">
        <span className="font-semibold text-sm md:text-base min-w-[60px] md:min-w-[70px] shrink-0">
          Target {index + 1}:
        </span>
        <div className="flex flex-1 items-center min-w-[120px]">
          <input
            required
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            value={inputValue}
            min={entryValue + 0.00001}
            step="any"
            className={`signal-market-selector w-full ${touched && error ? "border-red-500" : ""}`}
            type="number"
          />
          <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm md:text-base shrink-0">
            {quoteAsset}
          </span>
        </div>
        <button
          onClick={() => handleRemoveTarget(target.id)}
          className="text-red-500 ml-auto md:ml-0"
        >
          <IoTrash className="w-6 h-6 action-button" />
        </button>
      </div>
      {touched && error && (
        <span className="text-red-500 text-sm mt-1 ml-2 md:ml-[80px]">{error}</span>
      )}
    </div>
  )
}
