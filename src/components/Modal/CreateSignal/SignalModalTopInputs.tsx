import { SignalModel } from '@/shared/models'
import { ChangeEvent, FocusEvent, useCallback, useEffect, useMemo, useState } from 'react'

type SignalModalTopInputsProps = {
  entryValue: SignalModel['entry']
  stoplossValue: SignalModel['stoploss']
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
  const [errors, setErrors] = useState({ entry: '', stoploss: '' })
  const [touched, setTouched] = useState<TouchedStateType>({ entry: false, stoploss: false })

  const validateValues = useCallback(() => {
    const newErrors = { entry: '', stoploss: '' }
    
    if (stoplossValue >= entryValue) {
      newErrors.stoploss = 'Stoploss must be less than entry'
    }
    
    setErrors(newErrors)
  }, [entryValue, stoplossValue])

  useEffect(() => {
    validateValues()
  }, [validateValues, entryValue, stoplossValue])

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    const inputName = e.target.name as keyof FocusInputStateType
    if (isFirstFocus[inputName]) {
      e.target.value = ''
      isFirstFocus[inputName] = false
    }
  }

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const inputName = e.target.name as keyof TouchedStateType
    setTouched(prev => ({ ...prev, [inputName]: true }))
  }

  return (
    <div className="flex justify-center gap-10">
      <div className="flex flex-col">
        <div className="flex items-center">
          <span className="font-semibold mr-2">Entry:</span>
          <input
            value={entryValue}
            name="entry"
            onChange={handleEntryValueChange}
            required
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`signal-market-selector ${touched.entry && errors.entry ? 'border-red-500' : ''}`}
            type="number"
          />
          <span className="ml-1 text-gray-500 dark:text-gray-400">USD</span>
        </div>
        {touched.entry && errors.entry && <span className="text-red-500 text-sm mt-1">{errors.entry}</span>}
      </div>
      <div className="flex flex-col">
        <div className="flex items-center">
          <span className="font-semibold mr-2">Stoploss:</span>
          <input
            value={stoplossValue}
            name="stoploss"
            onChange={handleStoplossValueChange}
            required
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`signal-market-selector ${touched.stoploss && errors.stoploss ? 'border-red-500' : ''}`}
            type="number"
          />
          <span className="ml-1 text-gray-500 dark:text-gray-400">USD</span>
        </div>
        {touched.stoploss && errors.stoploss && <span className="text-red-500 text-sm mt-1">{errors.stoploss}</span>}
      </div>
    </div>
  )
}
