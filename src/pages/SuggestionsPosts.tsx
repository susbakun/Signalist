import { Loader, Post } from "@/components"
import { fetchPosts, useAppSelector } from "@/features/Post/postsSlice"
import { EmptyPage } from "./EmptyPage"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/app/store" // Adjust this import to your store file path
import { useCurrentUser } from "@/hooks/useCurrentUser"

export const SuggestionsPosts = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { posts, loading } = useAppSelector((state) => state.posts)

  const { currentUser: myAccount, loading: userLoading } = useCurrentUser()

  // Fetch posts when component mounts
  useEffect(() => {
    dispatch(fetchPosts())
  }, [dispatch])

  const sortedPosts = [...posts].sort((a, b) => b.date - a.date)

  // Show loading state
  if (loading || userLoading) {
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
    </div>
  )
}
