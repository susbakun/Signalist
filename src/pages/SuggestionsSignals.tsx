import { AppDispatch } from "@/app/store"
import { Loader, Signal } from "@/components"
import { fetchSignals, updatePage, useAppSelector } from "@/features/Signal/signalsSlice"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { EmptyPage } from "./EmptyPage"
import { useEffect, useMemo, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { SignalsFilters } from "@/shared/types"

// Basic suggestions feed: shows all signals sorted by recency for now.
export const SuggestionsSignals = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [loadingMore, setLoadingMore] = useState(false)
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)
  const [visibleCount, setVisibleCount] = useState(5) // Start with fewer signals

  const { currentUser: myAccount, currentUserLoading: userLoading } = useCurrentUser()

  const { signals, loading, hasMore, page, filters, applyingFilters } = useAppSelector(
    (state) => state.signals
  )

  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const fetchFirstPage = () => {
    const params = {
      page: 1,
      limit: 10,
      market: filters.market,
      status: filters.status,
      openFrom: filters.openFrom,
      openTo: filters.openTo,
      closeFrom: filters.closeFrom,
      closeTo: filters.closeTo
    } satisfies { page: number; limit: number } & SignalsFilters
    dispatch(fetchSignals(params)).then(() => {
      setInitialLoadComplete(true)
    })
  }

  useEffect(() => {
    fetchFirstPage()
  }, [dispatch, filters])

  useEffect(() => {
    if (loading || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          loadMoreSignals()
        }
      },
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

  const loadMoreSignals = async () => {
    if (!hasMore || loading || loadingMore) return

    setLoadingMore(true)
    try {
      const nextPage = page + 1
      await dispatch(
        fetchSignals({
          page: nextPage,
          limit: 10,
          market: filters.market,
          status: filters.status,
          openFrom: filters.openFrom,
          openTo: filters.openTo,
          closeFrom: filters.closeFrom,
          closeTo: filters.closeTo
        })
      ).unwrap()
      dispatch(updatePage(nextPage))
    } catch (error) {
      console.error("Failed to load more signals:", error)
    } finally {
      setLoadingMore(false)
    }
  }

  const sortedSignalsList = useMemo(() => {
    return [...signals].sort((a, b) => b.date - a.date)
  }, [signals])

  const visibleSignals = useMemo(() => {
    return sortedSignalsList.slice(0, visibleCount)
  }, [sortedSignalsList, visibleCount])

  // Progressively show more signals after initial render
  useEffect(() => {
    if (initialLoadComplete && sortedSignalsList.length > visibleCount) {
      const timer = setTimeout(() => {
        setVisibleCount(prev => Math.min(prev + 10, sortedSignalsList.length))
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [initialLoadComplete, sortedSignalsList.length, visibleCount])

  // Optimize loading state check
  if ((!initialLoadComplete && loading) || userLoading || applyingFilters) {
    return (
      <EmptyPage className="flex justify-center items-center h-[80vh]">
        <Loader className="h-[350px]" />
      </EmptyPage>
    )
  }

  if (!myAccount) return null

  if (!sortedSignalsList.length)
    return (
      <EmptyPage className="flex justify-center items-center h-[80vh]">
        <h3 className="font-normal">There are no signals yet</h3>
      </EmptyPage>
    )

  return (
    <div className="flex flex-col justify-center">
      {visibleSignals.map((signal) => (
        <Signal myAccount={myAccount} key={signal.id} signal={signal} />
      ))}

      {/* Show remaining signals are loading */}
      {visibleCount < sortedSignalsList.length && (
        <div className="flex justify-center py-4">
          <div className="text-sm opacity-70">Loading more signals...</div>
        </div>
      )}

      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-6 mt-2">
          {loadingMore && <Loader className="h-16 w-16" />}
        </div>
      )}
    </div>
  )
}
