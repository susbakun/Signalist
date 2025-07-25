import { AppDispatch } from "@/app/store"
import { CreateSignalButton, CreateSignalModal, Loader, Signal } from "@/components"
import { fetchSignals, updatePage, useAppSelector } from "@/features/Signal/signalsSlice"
import { useEffect, useState, useRef, useMemo } from "react"
import { useDispatch } from "react-redux"
import { EmptyPage } from "./EmptyPage"
import { useCurrentUser } from "@/hooks/useCurrentUser"

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
      <ExploreSignals />
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
            {loadingMore && <Loader className="h-16 w-16" />}
          </div>
        )}
      </div>
    </div>
  )
}
