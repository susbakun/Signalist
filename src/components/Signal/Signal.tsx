import { SignalContext, SignalFooter, SignalTopBar } from "@/components"
import { useAppSelector } from "@/features/Message/messagesSlice"
import { updateSignalsState } from "@/features/Signal/signalsSlice"
import { useIsUserSubscribed } from "@/hooks/useIsUserSubscribed"
import { userIsUserBlocked } from "@/hooks/userIsUserBlocked"
import { useGetCryptosQuery } from "@/services/cryptoApi"
import { SignalModel } from "@/shared/models"
import { ComponentProps, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { twMerge } from "tailwind-merge"

type SignalProps = {
  signal: SignalModel
} & ComponentProps<"div">

export const Signal = ({ signal, className }: SignalProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_currentTime, setCurrentTime] = useState(new Date().getTime())
  const [isUserBlocked, setIsUserBlocked] = useState<undefined | boolean>(undefined)

  const myAccount = useAppSelector((state) => state.users).find(
    (user) => user.username === "Amir_Aryan"
  )

  const { data: cryptosList } = useGetCryptosQuery(5)
  const dispatch = useDispatch()

  const { publisher } = signal

  const { amISubscribed } = useIsUserSubscribed(publisher)
  const { isUserBlocked: determineIsUserBlocked } = userIsUserBlocked(myAccount)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().getTime())
      dispatch(updateSignalsState(cryptosList?.data))
      // dispatch(updateUserScore({ username: signal.publisher.username, signal }))
    }, 60000)

    return () => clearInterval(intervalId)
  }, [cryptosList])

  useEffect(() => {
    if (myAccount) {
      const userUsername = signal.publisher.username
      setIsUserBlocked(determineIsUserBlocked(userUsername))
    }
  }, [myAccount])

  if (isUserBlocked) return

  return (
    <div
      className={twMerge(
        "flex flex-col gap-8 px-4 py-6 border-b",
        "border-b-gray-600/20 dark:border-b-white/20",
        className
      )}
    >
      <SignalTopBar
        subscribed={amISubscribed}
        publisher={publisher}
        date={signal.date}
        signalId={signal.id}
      />
      <SignalContext signal={signal} />
      <SignalFooter signal={signal} username={publisher.username} />
    </div>
  )
}
