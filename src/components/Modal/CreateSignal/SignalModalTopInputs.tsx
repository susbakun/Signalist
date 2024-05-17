import { SignalModel } from '@/shared/models'
import { ChangeEvent } from 'react'

type SignalModalTopInputsProps = {
  entryValue: SignalModel['entry']
  stoplossValue: SignalModel['stoploss']
  handleEntryValueChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleStoplossValueChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export const SignalModalTopInputs = ({
  entryValue,
  stoplossValue,
  handleEntryValueChange,
  handleStoplossValueChange
}: SignalModalTopInputsProps) => {
  return (
    <div className="flex justify-center gap-10">
      <div className="flex items-center">
        <span className="font-semibold mr-2">Entry:</span>
        <input
          value={entryValue}
          onChange={handleEntryValueChange}
          required
          className="signal-market-selector"
          type="text"
          pattern="$[0-9]*"
        />
        <span className="ml-1 text-gray-500 dark:text-gray-400">USD</span>
      </div>
      <div className="flex items-center">
        <span className="font-semibold mr-2">Stoploss:</span>
        <input
          value={stoplossValue}
          onChange={handleStoplossValueChange}
          required
          className="signal-market-selector"
          type="text"
          pattern="$[0-9]*"
        />
        <span className="ml-1 text-gray-500 dark:text-gray-400">USD</span>
      </div>
    </div>
  )
}
