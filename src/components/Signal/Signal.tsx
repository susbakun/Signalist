import { AppDispatch } from "@/app/store"
import { EditSignalModal, SignalContext, SignalFooter, SignalTopBar } from "@/components"
import { updateSignalStatusAsync } from "@/features/Signal/signalsSlice"
import { useAppSelector } from "@/features/User/usersSlice"
import { useIsUserBlocked } from "@/hooks/useIsUserBlocked"
import { useIsUserSubscribed } from "@/hooks/useIsUserSubscribed"
import { AccountModel, SignalModel } from "@/shared/models"
import { ComponentProps, useEffect, useState, useMemo, memo } from "react"
import { useDispatch } from "react-redux"
import { twMerge } from "tailwind-merge"

type SignalProps = {
  signal: SignalModel
  myAccount: AccountModel
  isBookmarkPage?: boolean
} & ComponentProps<"div">

export const Signal = memo(({ signal, className, myAccount, isBookmarkPage }: SignalProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_currentTime, setCurrentTime] = useState(new Date().getTime())
  const [isUserBlocked, setIsUserBlocked] = useState<undefined | boolean>(undefined)
  const [openEditSignalModal, setOpenEditSignalModal] = useState(false)

  const dispatch = useDispatch<AppDispatch>()

  const { user: publisher } = signal
  const publisherDetails = useAppSelector((store) => store.users.users).find(
    (user) => user.username === publisher.username
  )

  const { amISubscribed } = useIsUserSubscribed(publisher)
  const { isUserBlocked: determineIsUserBlocked, areYouBlocked } = useIsUserBlocked(myAccount)
  const handleOpenEditSignalModal = () => {
    setOpenEditSignalModal(true)
  }

  const handleCloseEditSignalModal = () => {
    setOpenEditSignalModal(false)
  }

  const updateSignalStatus = () => {
    setCurrentTime(new Date().getTime())
    dispatch(updateSignalStatusAsync({ signalId: signal.id }))
  }

  useEffect(() => {
    // Don't set up checks for already closed signals
    if (signal.status === "closed") {
      return
    }

    // Debounce the initial update to avoid blocking the UI
    const initialUpdateTimeout = setTimeout(() => {
      updateSignalStatus()
    }, 100)

    const now = new Date().getTime()
    const OFFSET_BUFFER = 30000 // 30 seconds buffer

    // Array to keep track of all timeout ids so we can clear them on cleanup
    const timeoutIds: NodeJS.Timeout[] = [initialUpdateTimeout]

    // Schedule checks at strategic times based on signal state
    if (signal.status === "not_opened" && signal.openTime > now) {
      const timeUntilOpen = Math.max(500, signal.openTime - now - OFFSET_BUFFER)
      const openingTimeoutId = setTimeout(updateSignalStatus, timeUntilOpen)
      timeoutIds.push(openingTimeoutId)
    }

    // Schedule check for closing time (regardless of current status)
    if (signal.closeTime > now) {
      const timeUntilClose = Math.max(500, signal.closeTime - now - OFFSET_BUFFER)
      const timeUntilAfterClose = Math.max(1000, signal.closeTime - now + OFFSET_BUFFER)

      const closingTimeoutId = setTimeout(updateSignalStatus, timeUntilClose)
      const afterCloseTimeoutId = setTimeout(updateSignalStatus, timeUntilAfterClose)

      timeoutIds.push(closingTimeoutId, afterCloseTimeoutId)
    }

    // Cleanup function to clear all timeouts
    return () => {
      timeoutIds.forEach((id) => clearTimeout(id))
    }
  }, [signal.id, signal.status, signal.openTime, signal.closeTime])

  const isBlocked = useMemo(() => {
    if (!myAccount) return false
    return determineIsUserBlocked(publisher.username)
  }, [myAccount, determineIsUserBlocked, publisher.username])

  useEffect(() => {
    setIsUserBlocked(isBlocked)
  }, [isBlocked])

  if (!publisherDetails) return null

  if (isUserBlocked || areYouBlocked(publisherDetails)) return null

  return (
    <>
      <div
        className={twMerge(
          "flex flex-col gap-4 md:gap-8 px-3 md:px-4 py-4 md:py-6 border-b overflow-clip",
          "border-b-gray-600/20 dark:border-b-white/20 max-w-full",
          className
        )}
      >
        <SignalTopBar
          subscribed={amISubscribed}
          publisher={publisher}
          date={signal.date}
          signalId={signal.id}
          handleOpenEditSignalModal={handleOpenEditSignalModal}
        />
        <SignalContext signal={signal} isBookmarkPage={isBookmarkPage} />
        <SignalFooter signal={signal} username={publisher.username} />
      </div>
      <EditSignalModal
        openModal={openEditSignalModal}
        handleCloseModal={handleCloseEditSignalModal}
        signal={signal}
      />
    </>
  )
})
