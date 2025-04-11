import { Signal } from "@/components/Signal/Signal"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { EmptyPage } from "@/pages"
import { cn, isEmpty } from "@/utils"

export const BookmarkedSignals = () => {
  const { currentUser: myAccount } = useCurrentUser()

  if (!myAccount) return null

  const bookmarkedSignals = myAccount.bookmarks.signals

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
