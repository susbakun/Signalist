import { SignalContext, SignalFooter, SignalTopBar } from '@/components'
import { updateStates } from '@/features/Signal/signalsSlice'
import { SignalModel } from '@/shared/models'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

type SignalProps = {
  signal: SignalModel
}

export const Signal = ({ signal }: SignalProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_currentTime, setCurrentTime] = useState(new Date().getTime())
  const dispatch = useDispatch()

  const { publisher } = signal

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().getTime())
      dispatch(updateStates())
    }, 60000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div
      className="flex flex-col gap-8 px-4 py-6 border-b
    border-b-gray-600/20 dark:border-b-white/20"
    >
      <SignalTopBar publisher={publisher} date={signal.date} signalId={signal.id} />
      <SignalContext signal={signal} />
      <SignalFooter likes={signal.likes} signalId={signal.id} username={publisher.username} />
    </div>
  )
}
