import { AppDispatch } from "@/app/store"
import { CreateSignalButton, CreateSignalModal, Loader, Signal, StreamingUser } from "@/components"
import { fetchSignals, updatePage, useAppSelector } from "@/features/Signal/signalsSlice"
import { useEffect, useState, useRef, useMemo } from "react"
import { useDispatch } from "react-redux"
import { EmptyPage } from "./EmptyPage"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useIsUserBlocked } from "@/hooks/useIsUserBlocked"
import { fetchUsersAsync } from "@/features/User/usersSlice"

export const SignalsPage = () => {
  const [openCreateSignalModal, setOpenCreateSignalModal] = useState(false)

  const handleCloseCreateSignalModal = () => {
    setOpenCreateSignalModal(false)
  }

  const hanldeOpenCreateSignalModal = () => {
    setOpenCreateSignalModal(true)
  }
  return (
    <div className="flex flex-col md:flex-row">
      <MobileTopBar />
      <ExploreSignals />
      <RightSidebar />
      <CreateSignalButton handleOpenModal={hanldeOpenCreateSignalModal} />
      <CreateSignalModal
        openModal={openCreateSignalModal}
        handleCloseModal={handleCloseCreateSignalModal}
      />
    </div>
  )
}

const ExploreSignals = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [loadingMore, setLoadingMore] = useState(false)
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)

  const { currentUser: myAccount, loading: userLoading } = useCurrentUser()

  const { signals, loading, hasMore, page } = useAppSelector((state) => state.signals)

  // Use useMemo to sort the signals - this ensures we always display all signals in the correct order
  const sortedSignalsList = useMemo(() => {
    return [...signals].sort((a, b) => b.date - a.date)
  }, [signals])

  // Ref for intersection observer
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Initial fetch
  useEffect(() => {
    // Clear any previous signals and start fresh with page 1
    dispatch(fetchSignals({ page: 1, limit: 10 })).then(() => {
      setInitialLoadComplete(true)
    })
  }, [dispatch])

  // Setup intersection observer for infinite scrolling
  useEffect(() => {
    if (loading || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Only trigger loading if we have more signals to load, we're not already loading,
        // and the loadMore element is intersecting
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          loadMoreSignals()
        }
      },
      // Use a moderate threshold to detect earlier but not too early
      { threshold: 0.05, rootMargin: "200px 0px" }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    observerRef.current = observer

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [loading, hasMore, loadingMore])

  // Function to load more signals
  const loadMoreSignals = async () => {
    if (!hasMore || loading || loadingMore) return

    setLoadingMore(true)

    try {
      // Pass the current page + 1 to fetch the next set of signals
      const nextPage = page + 1

      // Dispatch and wait for completion
      await dispatch(fetchSignals({ page: nextPage, limit: 10 })).unwrap()

      // Update page in the state
      dispatch(updatePage(nextPage))
    } catch (error) {
      console.error("Failed to load more signals:", error)
    } finally {
      setLoadingMore(false)
    }
  }

  // Show loading state only on initial load
  if ((!initialLoadComplete && loading) || userLoading) {
    return (
      <EmptyPage
        className="flex justify-center items-center h-[80vh] md:flex-1 md:border-r 
        dark:md:border-r-white/20 md:border-r-gray-600/20 md:h-screen"
      >
        <Loader className="h-[350px]" />
      </EmptyPage>
    )
  }

  if (!sortedSignalsList.length)
    return (
      <EmptyPage
        className="flex justify-center items-center h-[80vh] md:flex-1 md:border-r
        dark:md:border-r-white/20 md:border-r-gray-600/20 md:h-screen"
      >
        <h3 className="font-normal">There are no signals yet</h3>
      </EmptyPage>
    )

  if (!myAccount) return null

  return (
    <div
      className="flex-1 md:border-r dark:md:border-r-white/20
    md:border-r-gray-600/20 pb-4 md:pb-0"
    >
      <h2 className="text-2xl px-4 pt-4 md:pt-11 pb-2 font-bold">Signals</h2>
      <div className="flex flex-col justify-center">
        {sortedSignalsList.map((signal) => (
          <Signal myAccount={myAccount} key={signal.id} signal={signal} />
        ))}

        {/* Loading indicator and intersection observer target */}
        {hasMore && (
          <div ref={loadMoreRef} className="flex justify-center py-6 mt-2">
            {loadingMore ? (
              <Loader className="h-16 w-16" />
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Scroll for more</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const RightSidebar = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { users, loading: usersLoading } = useAppSelector((state) => state.users)
  const { currentUser: myAccount } = useCurrentUser()
  const { isUserBlocked } = useIsUserBlocked(myAccount)

  // Fetch users if they're not loaded yet
  useEffect(() => {
    if (users.length === 0 && !usersLoading) {
      dispatch(fetchUsersAsync())
    }
  }, [users, usersLoading, dispatch])

  let selectedUsers =
    users.length > 0
      ? [
          ...users.filter(
            (user) => user.username !== myAccount?.username && !isUserBlocked(user.username)
          )
        ]
      : []

  selectedUsers = selectedUsers.sort((a, b) => b.score - a.score).slice(0, 4)

  if (!myAccount) return null

  return (
    <aside
      className="hidden md:flex flex-col
        w-[30%] h-screen pt-8 px-4 sticky top-0"
    >
      <div
        className="border border-gray-600/20 dark:border-white/20
          rounded-xl gap-4 p-3 flex flex-col"
      >
        <h2 className="text-xl font-bold">Streams</h2>
        <div className="flex flex-col gap-4">
          {usersLoading ? (
            <Loader className="h-[350px]" />
          ) : selectedUsers.length > 0 ? (
            selectedUsers.map((user) => (
              <StreamingUser myAccount={myAccount} key={user.username} {...user} />
            ))
          ) : (
            <EmptyPage className="text-center mt-8 pb-16">
              <h3 className="font-normal">No streams right now</h3>
            </EmptyPage>
          )}
        </div>
      </div>
    </aside>
  )
}

const MobileTopBar = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { users, loading: usersLoading } = useAppSelector((state) => state.users)
  const { currentUser: myAccount } = useCurrentUser()
  const { isUserBlocked } = useIsUserBlocked(myAccount)

  // Fetch users if they're not loaded yet
  useEffect(() => {
    if (users.length === 0 && !usersLoading) {
      dispatch(fetchUsersAsync())
    }
  }, [users, usersLoading, dispatch])

  let selectedUsers =
    users.length > 0
      ? [
          ...users.filter(
            (user) => user.username !== myAccount?.username && !isUserBlocked(user.username)
          )
        ]
      : []

  selectedUsers = selectedUsers.sort((a, b) => b.score - a.score).slice(0, 4)

  if (!myAccount) return null

  return (
    <div className="md:hidden w-full overflow-x-auto py-4 px-4 border-b border-b-gray-600/20 dark:border-b-white/20">
      <h2 className="text-xl font-bold mb-4">Streams</h2>
      <div className="flex gap-6">
        {usersLoading ? (
          <Loader className="w-full" />
        ) : selectedUsers.length > 0 ? (
          selectedUsers.map((user) => (
            <div className="flex flex-col items-center" key={user.username}>
              <StreamingUser myAccount={myAccount} {...user} />
              <span className="text-xs mt-1 truncate max-w-[64px] text-center">
                {user.username}
              </span>
            </div>
          ))
        ) : (
          <EmptyPage className="text-center mt-8 pb-8 md:pb-16 w-full">
            <h3 className="font-normal">No streams right now</h3>
          </EmptyPage>
        )}
      </div>
    </div>
  )
}
