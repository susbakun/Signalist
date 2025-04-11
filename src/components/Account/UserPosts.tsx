import { AppDispatch } from "@/app/store"
import { CreatePostModal, Loader, Post } from "@/components"
import { fetchPosts, updatePage, useAppSelector } from "@/features/Post/postsSlice"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { EmptyPage } from "@/pages"
import Tippy from "@tippyjs/react"
import { useEffect, useState, useRef, useMemo } from "react"
import { GoPlusCircle } from "react-icons/go"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { roundArrow } from "tippy.js"

export const UserPosts = () => {
  const [openCreatePostModal, setOpenCreatePostModal] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)

  const { username } = useParams()
  const { posts, loading, hasMore, page } = useAppSelector((state) => state.posts)
  const dispatch = useDispatch<AppDispatch>()
  const { currentUser: myAccount } = useCurrentUser()

  // Ref for intersection observer
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const { users, loading: usersLoading } = useAppSelector((state) => state.users)
  const userAccount = users.find((user) => user.username === username)

  const isItmyAccount = userAccount?.username === myAccount?.username

  // Use useMemo for userPosts to ensure proper reactivity
  const userPosts = useMemo(() => {
    return posts
      .filter((post) => post.publisher.username === userAccount?.username)
      .sort((a, b) => b.date - a.date)
  }, [posts, userAccount])

  const handleCloseCreatePostModal = () => {
    setOpenCreatePostModal(false)
  }

  const hanldeOpenCreatePostModal = () => {
    setOpenCreatePostModal(true)
  }

  // Initial fetch
  useEffect(() => {
    // Clear any previous posts and start fresh with page 1
    dispatch(fetchPosts({ page: 1, limit: 10 })).then(() => {
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

  // Function to load more posts
  const loadMorePosts = async () => {
    if (!hasMore || loading || loadingMore) return

    setLoadingMore(true)
    try {
      // Get next page
      const nextPage = page + 1

      // Dispatch and wait for completion
      await dispatch(fetchPosts({ page: nextPage, limit: 10 })).unwrap()

      // Update page in the state
      dispatch(updatePage(nextPage))
    } catch (error) {
      console.error("Failed to load more posts:", error)
    } finally {
      setLoadingMore(false)
    }
  }

  // Show loading state only on initial load
  if ((!initialLoadComplete && loading) || usersLoading) {
    return (
      <EmptyPage className="flex justify-center items-center h-[20vh]">
        <Loader className="h-[350px]" />
      </EmptyPage>
    )
  }

  if (userPosts.length == 0)
    return (
      <EmptyPage className="text-center mt-8 pb-16">
        <h3 className="font-normal">No posts found</h3>
      </EmptyPage>
    )

  if (!myAccount) return null

  return (
    <>
      <div className="flex flex-col mb-4 mx-4 md:px-0 md:pb-0 md:mx-16 border-x border-x-gray-600/20 dark:border-white/20">
        {userPosts.map((post) => (
          <Post
            className="border-y border-y-gray-600/20 dark:border-y-white/20 px-3 py-4 md:px-4 md:py-6"
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

        {isItmyAccount && (
          <Tippy
            content="create post"
            className="dark:bg-gray-700 bg-gray-900 text-white font-sans rounded-md px-1 py-[1px] text-sm"
            delay={[1000, 0]}
            placement="top"
            animation="fade"
            arrow={roundArrow}
            duration={10}
            hideOnClick={true}
          >
            <button
              onClick={hanldeOpenCreatePostModal}
              className="main-button transition-all duration-100 ease-out fixed right-4 bottom-16 md:bottom-4 px-3 py-3 md:px-4 md:py-4 rounded-full z-10"
            >
              <GoPlusCircle className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </Tippy>
        )}
      </div>
      <CreatePostModal
        openModal={openCreatePostModal}
        handleCloseModal={handleCloseCreatePostModal}
      />
    </>
  )
}
