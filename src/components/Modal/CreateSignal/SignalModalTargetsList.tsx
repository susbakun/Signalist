import { SignalModel } from '@/shared/models'
import { ChangeEvent, FocusEvent } from 'react'
import { IoTrash } from 'react-icons/io5'

type SignalModalTargetsListProps = {
  index: number
  target: SignalModel['targets'][0]
  handleRemoveTarget: (removedTargetId: string) => void
  handleTargetValueChange: (e: ChangeEvent<HTMLInputElement>, targetId: string) => void
}

export const SignalModalTargetsList = ({
  index,
  target,
  handleRemoveTarget,
  handleTargetValueChange
}: SignalModalTargetsListProps) => {
  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '0') {
      e.target.value = ''
    }
  }
  return (
    <div className="flex items-center justify-between px-2">
      <div>
        <span className="font-semibold mr-2">target {index + 1}:</span>
        <input
          required
          onFocus={handleFocus}
          onChange={(e) => handleTargetValueChange(e, target.id)}
          value={target.value}
          className="signal-market-selector"
          type="number"
        />
        <span className="ml-1 text-gray-500 dark:text-gray-400">USD</span>
      </div>
      <button onClick={() => handleRemoveTarget(target.id)} className="text-red-500">
        <IoTrash className="w-6 h-6 action-button" />
      </button>
    </div>
  )
}
