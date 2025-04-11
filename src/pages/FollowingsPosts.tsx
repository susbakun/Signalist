import { Loader, Post } from "@/components"
import { fetchPosts, useAppSelector } from "@/features/Post/postsSlice"
import { EmptyPage } from "@/pages"
import { PostModel } from "@/shared/models"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/app/store" // Adjust this import to your store file location
import { useCurrentUser } from "@/hooks/useCurrentUser"

export const FollowingsPosts = () => {
  const dispatch = useDispatch<AppDispatch>() // Use typed dispatch
  const allPosts = useAppSelector((state) => state.posts.posts) // Update to access posts array
  const loading = useAppSelector((state) => state.posts.loading)

  const { currentUser: myAccount, loading: userLoading } = useCurrentUser()

  // Fetch posts when component mounts
  useEffect(() => {
    dispatch(fetchPosts())
  }, [dispatch])

  const isMyFollowingPost = (post: PostModel) => {
    return myAccount?.followings.some((following) =>
      following.username.includes(post.publisher.username)
    )
  }

  const followingPosts = [
    ...allPosts.filter((post) => {
      if (isMyFollowingPost(post)) {
        return post
      }
      return false // Explicitly return false when condition isn't met
    })
  ].sort((a, b) => b.date - a.date)

  // Show loading state
  if (loading || userLoading) {
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
    </div>
  )
}
