import { AppDispatch } from "@/app/store"
import { SignalContext, SignalFooter, SignalTopBar } from "@/components"
import { updateSignalStatusAsync } from "@/features/Signal/signalsSlice"
import { updateUserScoreAsync } from "@/features/User/usersSlice"
import { useIsUserBlocked } from "@/hooks/useIsUserBlocked"
import { useIsUserSubscribed } from "@/hooks/useIsUserSubscribed"
import { AccountModel, SignalModel } from "@/shared/models"
import { ComponentProps, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { twMerge } from "tailwind-merge"

type SignalProps = {
  signal: SignalModel
  myAccount: AccountModel
  isBookmarkPage?: boolean
} & ComponentProps<"div">

export const Signal = ({ signal, className, myAccount, isBookmarkPage }: SignalProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_currentTime, setCurrentTime] = useState(new Date().getTime())
  const [isUserBlocked, setIsUserBlocked] = useState<undefined | boolean>(undefined)

  const dispatch = useDispatch<AppDispatch>()

  const { publisher } = signal

  const { amISubscribed } = useIsUserSubscribed(publisher)
  const { isUserBlocked: determineIsUserBlocked } = useIsUserBlocked(myAccount)

  const updateSignalStatus = () => {
    setCurrentTime(new Date().getTime())
    dispatch(updateSignalStatusAsync({ signalId: signal.id }))
  }

  useEffect(() => {
    updateSignalStatus()
    const intervalId = setInterval(() => {
      updateSignalStatus()
    }, 60000)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    dispatch(updateUserScoreAsync({ signal }))
  }, [signal, dispatch])

  useEffect(() => {
    if (myAccount) {
      const userUsername = signal.publisher.username
      setIsUserBlocked(determineIsUserBlocked(userUsername))
    }
  }, [myAccount, determineIsUserBlocked, signal.publisher.username])

  if (isUserBlocked) return null

  return (
    <div
      className={twMerge(
        "flex flex-col gap-4 md:gap-8 px-3 md:px-4 py-4 md:py-6 border-b",
        "border-b-gray-600/20 dark:border-b-white/20 max-w-full",
        className
      )}
    >
      <SignalTopBar
        subscribed={amISubscribed}
        publisher={publisher}
        date={signal.date}
        signalId={signal.id}
      />
      <SignalContext signal={signal} isBookmarkPage={isBookmarkPage} />
      <SignalFooter signal={signal} username={publisher.username} />
    </div>
  )
}
