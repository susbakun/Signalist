import { Loader, Post } from "@/components"
import { fetchPosts, updatePage, useAppSelector } from "@/features/Post/postsSlice"
import { EmptyPage } from "./EmptyPage"
import { useEffect, useState, useRef } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/app/store" // Adjust this import to your store file path
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useParams } from "react-router-dom"

export const SuggestionsPosts = () => {
  const { tagName } = useParams()

  const dispatch = useDispatch<AppDispatch>()
  const [loadingMore, setLoadingMore] = useState(false)
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)

  const { posts, loading, hasMore, page } = useAppSelector((state) => state.posts)

  const { currentUser: myAccount, loading: userLoading } = useCurrentUser()

  // Ref for intersection observer
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Fetch posts when component mounts
  useEffect(() => {
    dispatch(fetchPosts({})).then(() => {
      setInitialLoadComplete(true)
    })
  }, [dispatch])

  // Setup intersection observer for infinite scrolling
  useEffect(() => {
    if (loading || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Only trigger loading if we have more posts to load, we're not already loading,
        // and the loadMore element is intersecting
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          loadMorePosts()
        }
      },
      // Use a higher rootMargin to detect earlier and prevent jarring UX
      { threshold: 0.1, rootMargin: "300px 0px" }
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

  // Function to load more posts
  const loadMorePosts = async () => {
    if (!hasMore || loading || loadingMore) return

    setLoadingMore(true)

    try {
      // Capture scroll position before loading
      const scrollPosition = window.scrollY

      // Pass the current page + 1 to fetch the next set of posts
      const nextPage = page + 1

      // Dispatch is wrapped in a promise to ensure we wait for completion
      await dispatch(fetchPosts({ page: nextPage, tagName })).unwrap()

      // Update page in the state
      dispatch(updatePage(nextPage))

      // Preserve scroll position after content loads and rerenders
      window.scrollTo({
        top: scrollPosition,
        behavior: "auto"
      })
    } catch (error) {
      console.error("Failed to load more posts:", error)
    } finally {
      setLoadingMore(false)
    }
  }

  const sortedPosts = [...posts].sort((a, b) => b.date - a.date)

  // Show loading state only on initial load
  if ((!initialLoadComplete && loading) || userLoading) {
    return (
      <EmptyPage className="flex justify-center items-center h-[80vh]">
        <Loader className="h-[350px]" />
      </EmptyPage>
    )
  }

  if (!myAccount) return null

  if (!sortedPosts.length)
    return (
      <EmptyPage className="flex justify-center items-center h-[80vh]">
        <h3 className="font-normal">There are no posts yet</h3>
      </EmptyPage>
    )

  return (
    <div className="flex flex-col">
      {sortedPosts.map((post) => (
        <Post
          className="border-b border-b-gray-600/20 
        dark:border-b-white/20 px-4 py-6"
          key={post.id}
          post={post}
          myAccount={myAccount}
        />
      ))}

      {/* Loading indicator and intersection observer target */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          {loadingMore && <Loader className="h-16 w-16" />}
        </div>
      )}
    </div>
  )
}
