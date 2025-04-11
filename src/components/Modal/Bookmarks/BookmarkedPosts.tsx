import { Post } from "@/components/Post/Post"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { EmptyPage } from "@/pages"
import { cn, isEmpty } from "@/utils"
import { useEffect, useState } from "react"
import { useAppSelector } from "@/features/Signal/signalsSlice"
import { PostModel } from "@/shared/models"
import { Loader } from "@/components"

export const BookmarkedPosts = () => {
  const { currentUser: myAccount } = useCurrentUser()
  const [bookmarkedPosts, setBookmarkedPosts] = useState<PostModel[]>([])
  const [loading, setLoading] = useState(true)
  const { posts: allPosts } = useAppSelector((state) => state.posts)

  useEffect(() => {
    if (myAccount && allPosts.length > 0) {
      // Handle both old format (full objects) and new format (just IDs)
      let posts: PostModel[] = []

      // Check if the bookmarks are strings (IDs) or objects
      const bookmarksPosts = myAccount.bookmarks.posts
      const isIdFormat = bookmarksPosts.length > 0 && typeof bookmarksPosts[0] === "string"

      if (isIdFormat) {
        // New format: array of IDs
        const postIds = bookmarksPosts as unknown as string[]
        posts = postIds
          .map((postId) => allPosts.find((post) => post.id === postId))
          .filter((post): post is PostModel => post !== undefined)
      } else {
        // Old format: array of full post objects
        const oldPosts = bookmarksPosts as unknown as PostModel[]
        // First get the IDs from the stored objects
        const postIds = oldPosts.map((post) => post.id)
        // Then find the latest versions in allPosts
        posts = postIds
          .map((postId) => allPosts.find((post) => post.id === postId))
          .filter((post): post is PostModel => post !== undefined)
      }

      setBookmarkedPosts(posts)
      setLoading(false)
    }
  }, [myAccount, allPosts])

  if (!myAccount) return null

  if (loading) {
    return <Loader className="h-[350px]" />
  }

  if (isEmpty(bookmarkedPosts)) {
    return (
      <EmptyPage className="flex justify-center items-center w-full font-medium h-[80vh]">
        <h3>There are no bookmarked posts</h3>
      </EmptyPage>
    )
  }

  return (
    <div className="flex-1">
      <div className="flex flex-col">
        {bookmarkedPosts.map((post, index) => (
          <Post
            className={cn("border-b border-b-gray-600/20", "dark:border-b-white/20 px-4 py-6", {
              "border-none": index === bookmarkedPosts.length - 1
            })}
            key={post.id}
            post={post}
            myAccount={myAccount}
          />
        ))}
      </div>
    </div>
  )
}
