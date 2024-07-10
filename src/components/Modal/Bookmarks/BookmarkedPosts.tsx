import { Post } from "@/components/Post/Post"
import { useAppSelector } from "@/features/Message/messagesSlice"
import { EmptyPage } from "@/pages"
import { cn } from "@/utils"
import { isEmpty } from "lodash"

export const BookmarkedPosts = () => {
  const myUsername = useAppSelector((state) => state.users).find(
    (user) => user.username === "Amir_Aryan"
  )!

  const bookmarkedPosts = myUsername?.bookmarks.posts

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
          />
        ))}
      </div>
    </div>
  )
}
