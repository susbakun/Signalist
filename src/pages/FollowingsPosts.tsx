import { Loader, Post } from "@/components"
import { fetchPosts, updatePage, useAppSelector } from "@/features/Post/postsSlice"
import { EmptyPage } from "@/pages"
import { PostModel } from "@/shared/models"
import { useEffect, useState, useRef } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/app/store" // Adjust this import to your store file location
import { useCurrentUser } from "@/hooks/useCurrentUser"

export const FollowingsPosts = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [loadingMore, setLoadingMore] = useState(false)
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)

  const allPosts = useAppSelector((state) => state.posts.posts)
  const loading = useAppSelector((state) => state.posts.loading)
  const hasMore = useAppSelector((state) => state.posts.hasMore)
  const page = useAppSelector((state) => state.posts.page)

  const { currentUser: myAccount, loading: userLoading } = useCurrentUser()

  // Ref for intersection observer
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Initial fetch
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
      await dispatch(fetchPosts({ page: nextPage })).unwrap()

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

  const isMyFollowingPost = (post: PostModel) => {
    return myAccount?.followings.some((following) =>
      following.username.includes(post.publisher.username)
    )
  }

  const isMyPost = (post: PostModel) => {
    return post.publisher.username === myAccount?.username
  }

  const followingPosts = [
    ...allPosts.filter((post) => {
      if (isMyFollowingPost(post) || isMyPost(post)) {
        return post
      }
      return false
    })
  ].sort((a, b) => b.date - a.date)

  // Show loading state only on initial load
  if ((!initialLoadComplete && loading) || userLoading) {
    return (
      <EmptyPage className="flex justify-center items-center h-[80vh]">
        <Loader className="h-[350px]" />
      </EmptyPage>
    )
  }

  if (!followingPosts.length)
    return (
      <EmptyPage className="flex justify-center items-center h-[80vh]">
        <h3 className="font-normal">There are no posts yet</h3>
      </EmptyPage>
    )

  if (!myAccount) return null

  return (
    <div className="flex flex-col">
      {followingPosts.map((post) => (
        <Post
          className="border-b border-b-gray-600/20 dark:border-b-white/20 px-4 py-6"
          key={post.id}
          post={post}
          myAccount={myAccount}
        />
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
  )
}
