import { SignalContext, SignalFooter, SignalTopBar } from '@/components'
import { updateSignalsState } from '@/features/Signal/signalsSlice'
import { useIsUserSubscribed } from '@/hooks/useIsUserSubscribed'
import { useGetCryptosQuery } from '@/services/cryptoApi'
import { SignalModel } from '@/shared/models'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

type SignalProps = {
  signal: SignalModel
  simplified?: boolean
}

export const Signal = ({ signal, simplified }: SignalProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_currentTime, setCurrentTime] = useState(new Date().getTime())

  const { data: cryptosList } = useGetCryptosQuery(5)
  const dispatch = useDispatch()

  const { publisher } = signal

  const { amISubscribed } = useIsUserSubscribed(publisher)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().getTime())
      dispatch(updateSignalsState(cryptosList?.data))
    }, 60000)

    return () => clearInterval(intervalId)
  }, [cryptosList])

  return (
    <div
      className="flex flex-col gap-8 px-4 py-6 border-b
    border-b-gray-600/20 dark:border-b-white/20"
    >
      <SignalTopBar
        subscribed={amISubscribed}
        publisher={publisher}
        date={signal.date}
        signalId={signal.id}
      />
      <SignalContext simplified={simplified} signal={signal} />
      <SignalFooter likes={signal.likes} signalId={signal.id} username={publisher.username} />
    </div>
  )
}
