import { AppDispatch } from "@/app/store"
import { SignalContext, SignalFooter, SignalTopBar } from "@/components"
import { updateSignalStatusAsync } from "@/features/Signal/signalsSlice"
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
    // Don't set up checks for already closed signals
    if (signal.status === "closed") {
      return
    }

    // Update once immediately to catch any immediate state changes
    updateSignalStatus()

    const now = new Date().getTime()
    const OFFSET_BUFFER = 30000 // 30 seconds buffer

    // Array to keep track of all timeout ids so we can clear them on cleanup
    const timeoutIds: NodeJS.Timeout[] = []

    // Schedule checks at strategic times based on signal state
    if (signal.status === "not_opened") {
      // Check 1: Right before opening time
      if (signal.openTime > now) {
        const timeUntilOpen = Math.max(500, signal.openTime - now - OFFSET_BUFFER)
        console.log(
          `Scheduling check for signal ${signal.id} opening in ${Math.round(timeUntilOpen / 1000)} seconds`
        )

        const openingTimeoutId = setTimeout(() => {
          console.log(`Checking signal ${signal.id} near opening time`)
          updateSignalStatus()
        }, timeUntilOpen)

        timeoutIds.push(openingTimeoutId)
      }
    }

    // Schedule check for closing time (regardless of current status)
    if (signal.closeTime > now) {
      // Check 2: Right before closing time
      const timeUntilClose = Math.max(500, signal.closeTime - now - OFFSET_BUFFER)
      console.log(
        `Scheduling check for signal ${signal.id} closing in ${Math.round(timeUntilClose / 1000)} seconds`
      )

      const closingTimeoutId = setTimeout(() => {
        console.log(`Checking signal ${signal.id} near closing time`)
        updateSignalStatus()
      }, timeUntilClose)

      // Check 3: After closing time (final status update + cleanup)
      const timeUntilAfterClose = Math.max(1000, signal.closeTime - now + OFFSET_BUFFER)
      console.log(
        `Scheduling final check for signal ${signal.id} after closing in ${Math.round(timeUntilAfterClose / 1000)} seconds`
      )

      const afterCloseTimeoutId = setTimeout(() => {
        console.log(`Final check for signal ${signal.id} after closing time`)
        updateSignalStatus()
      }, timeUntilAfterClose)

      timeoutIds.push(closingTimeoutId, afterCloseTimeoutId)
    }

    // Cleanup function to clear all timeouts
    return () => {
      timeoutIds.forEach((id) => clearTimeout(id))
    }
  }, [signal.id, signal.status, signal.openTime, signal.closeTime])

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
