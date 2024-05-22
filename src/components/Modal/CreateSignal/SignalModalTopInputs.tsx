import { SignalModel } from '@/shared/models'
import { ChangeEvent, FocusEvent, useMemo } from 'react'

type SignalModalTopInputsProps = {
  entryValue: SignalModel['entry']
  stoplossValue: SignalModel['stoploss']
  handleEntryValueChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleStoplossValueChange: (e: ChangeEvent<HTMLInputElement>) => void
}

type FocusInputStateType = {
  [k in 'entry' | 'stoploss']: boolean
}

export const SignalModalTopInputs = ({
  entryValue,
  stoplossValue,
  handleEntryValueChange,
  handleStoplossValueChange
}: SignalModalTopInputsProps) => {
  const isFirstFocus = useMemo(() => ({ entry: true, stoploss: true }), [])

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    const inputName = e.target.name as keyof FocusInputStateType
    if (isFirstFocus[inputName]) {
      e.target.value = ''
      isFirstFocus[inputName] = false
    }
  }
  return (
    <div className="flex justify-center gap-10">
      <div className="flex items-center">
        <span className="font-semibold mr-2">Entry:</span>
        <input
          value={entryValue}
          name="entry"
          onChange={handleEntryValueChange}
          required
          onFocus={handleFocus}
          className="signal-market-selector"
          type="number"
        />
        <span className="ml-1 text-gray-500 dark:text-gray-400">USD</span>
      </div>
      <div className="flex items-center">
        <span className="font-semibold mr-2">Stoploss:</span>
        <input
          value={stoplossValue}
          onChange={handleStoplossValueChange}
          name="stoploss"
          required
          onFocus={handleFocus}
          className="signal-market-selector"
          type="number"
        />
        <span className="ml-1 text-gray-500 dark:text-gray-400">USD</span>
      </div>
    </div>
  )
}
