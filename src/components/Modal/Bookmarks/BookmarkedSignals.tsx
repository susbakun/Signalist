import { Loader, Signal } from "@/components"
import { useAppSelector } from "@/features/Signal/signalsSlice"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { EmptyPage } from "@/pages"
import { SignalModel } from "@/shared/models"
import { cn, isEmpty } from "@/utils"
import { useEffect, useState } from "react"

export const BookmarkedSignals = () => {
  const { currentUser: myAccount } = useCurrentUser()
  const [bookmarkedSignals, setBookmarkedSignals] = useState<SignalModel[]>([])
  const [loading, setLoading] = useState(true)
  const { signals: allSignals } = useAppSelector((state) => state.signals)

  useEffect(() => {
    if (myAccount && allSignals.length > 0) {
      // Get the latest signal data for each bookmarked signal ID
      const signals = myAccount.bookmarks.signals
        .map((signalId) => allSignals.find((signal) => signal.id === signalId))
        .filter((signal): signal is SignalModel => signal !== undefined)

      setBookmarkedSignals(signals)
      setLoading(false)
    }
  }, [myAccount, allSignals])

  if (!myAccount) return null

  if (loading) {
    return <Loader className="h-[350px]" />
  }

  if (isEmpty(bookmarkedSignals)) {
    return (
      <EmptyPage className="flex justify-center items-center w-full font-medium h-[80vh]">
        <h3>There are no bookmarked signals</h3>
      </EmptyPage>
    )
  }

  return (
    <div className="flex-1">
      <div className="flex flex-col justify-center">
        {bookmarkedSignals.map((signal, index) => (
          <Signal
            className={cn({ "border-none": index === bookmarkedSignals.length - 1 })}
            key={signal.id}
            signal={signal}
            myAccount={myAccount}
            isBookmarkPage={true}
          />
        ))}
      </div>
    </div>
  )
}
