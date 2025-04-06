import { SignalModel } from "@/shared/models"
import { ChangeEvent, FocusEvent, useEffect, useState } from "react"
import { IoTrash } from "react-icons/io5"

type SignalModalTargetsListProps = {
  index: number
  target: SignalModel["targets"][0]
  entryValue: number
  previousTargetValue?: number
  handleRemoveTarget: (removedTargetId: string) => void
  handleTargetValueChange: (e: ChangeEvent<HTMLInputElement>, targetId: string) => void
}

export const SignalModalTargetsList = ({
  index,
  target,
  entryValue,
  previousTargetValue,
  handleRemoveTarget,
  handleTargetValueChange
}: SignalModalTargetsListProps) => {
  const [error, setError] = useState("")
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    let newError = ""

    if (target.value <= 0) {
      newError = `Target ${index + 1} must be greater than 0`
    } else if (target.value <= entryValue) {
      newError = `Target ${index + 1} must be greater than entry (${entryValue})`
    } else if (previousTargetValue && target.value <= previousTargetValue) {
      newError = `Target ${index + 1} must be greater than previous target (${previousTargetValue})`
    }

    setError(newError)
  }, [target.value, entryValue, previousTargetValue, index])

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    if (e.target.value === "0") {
      e.target.value = ""
    }
  }

  const handleBlur = () => {
    setTouched(true)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Prevent invalid inputs
    const value = parseFloat(e.target.value)
    if (!isNaN(value)) {
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
            value={target.value}
            min={entryValue + 0.00001}
            step="0.00001"
            className={`signal-market-selector w-full ${touched && error ? "border-red-500" : ""}`}
            type="number"
          />
          <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm md:text-base shrink-0">
            USD
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
