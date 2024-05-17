import { SignalModel } from '@/shared/models'
import { ChangeEvent } from 'react'
import { IoTrash } from 'react-icons/io5'

type SignalModalTargetsListProps = {
  index: number
  target: SignalModel['targets'][0]
  handleRemoveTarget: (targetIndex: number) => void
  handleTargetValueChange: (e: ChangeEvent<HTMLInputElement>, targetIndex: number) => void
}

export const SignalModalTargetsList = ({
  index,
  target,
  handleRemoveTarget,
  handleTargetValueChange
}: SignalModalTargetsListProps) => {
  return (
    <div className="flex items-center justify-between px-2">
      <div>
        <span className="font-semibold mr-2">target {index + 1}:</span>
        <input
          required
          onChange={(e) => handleTargetValueChange(e, index)}
          value={target.value}
          className="signal-market-selector"
          type="text"
          pattern="$[0-9]*"
        />
        <span className="ml-1 text-gray-500 dark:text-gray-400">USD</span>
      </div>
      <button onClick={() => handleRemoveTarget(index)} className="text-red-500">
        <IoTrash className="w-6 h-6 action-button" />
      </button>
    </div>
  )
}
