import { AppDispatch } from "@/app/store"
import { CreateSignalModal, Loader, Signal } from "@/components"
import { fetchSignals, updatePage, useAppSelector } from "@/features/Signal/signalsSlice"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { EmptyPage } from "@/pages"
import { getCurrentUsername } from "@/utils"
import Tippy from "@tippyjs/react"
import { useEffect, useState, useRef, useMemo } from "react"
import { HiMiniSignal } from "react-icons/hi2"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { roundArrow } from "tippy.js"

export const UserSignals = () => {
  const [openCreateSignalModal, setOpenCreateSignalModal] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)
  const dispatch = useDispatch<AppDispatch>()

  const { signals, loading, hasMore, page } = useAppSelector((state) => state.signals)
  const { users, loading: usersLoading } = useAppSelector((state) => state.users)
  const { username } = useParams()
  const { currentUser: myAccount } = useCurrentUser()

  // Ref for intersection observer
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const userAccount = users.find((user) => user.username === username)

  // Use useMemo for sorting signals
  const userSignals = useMemo(() => {
    return signals
      .filter((signal) => signal.publisher.username === userAccount?.username)
      .sort((a, b) => b.date - a.date)
  }, [signals, userAccount])

  const currentUsername = getCurrentUsername()
  const isItmyAccount = userAccount?.username === currentUsername

  const handleCloseCreateSignalModal = () => {
    setOpenCreateSignalModal(false)
  }

  const hanldeOpenCreateSignalModal = () => {
    setOpenCreateSignalModal(true)
  }

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
      // Get next page
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
  if ((!initialLoadComplete && loading) || usersLoading) {
    return (
      <EmptyPage className="flex justify-center items-center h-[80vh]">
        <Loader className="h-[350px]" />
      </EmptyPage>
    )
  }

  if (userSignals.length === 0)
    return (
      <EmptyPage className="text-center mt-8 pb-16">
        <h3 className="font-normal">No signals found</h3>
      </EmptyPage>
    )

  if (!myAccount) return null

  return (
    <>
      <div className="pb-4 w-full overflow-hidden relative flex flex-col justify-center md:px-16 md:pb-0">
        <div className="w-full overflow-hidden border-x mx-0 dark:border-x-white/20 border-x-gray-600/20 px-0 inset-0">
          {userSignals.map((signal) => (
            <Signal key={signal.id} signal={signal} myAccount={myAccount} />
          ))}

          {/* Loading indicator and intersection observer target */}
          {hasMore && (
            <div ref={loadMoreRef} className="flex justify-center py-4">
              {loadingMore ? (
                <Loader className="h-16 w-16" />
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Scroll for more</p>
              )}
            </div>
          )}
        </div>
        {isItmyAccount && (
          <Tippy
            content="create signal"
            className="dark:bg-gray-700 bg-gray-900 text-white font-sans rounded-md px-1 py-[1px] text-sm"
            delay={[1000, 0]}
            placement="top"
            animation="fade"
            arrow={roundArrow}
            duration={10}
            hideOnClick={true}
          >
            <button
              onClick={hanldeOpenCreateSignalModal}
              className="main-button transition-all duration-100 ease-out fixed bottom-16 right-4 md:bottom-4 px-3 py-3 md:px-4 md:py-4 rounded-full z-10"
            >
              <HiMiniSignal className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </Tippy>
        )}
      </div>
      <CreateSignalModal
        openModal={openCreateSignalModal}
        handleCloseModal={handleCloseCreateSignalModal}
      />
    </>
  )
}
