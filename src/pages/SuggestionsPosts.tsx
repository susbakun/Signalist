import { Post } from '@/components'
import { useAppSelector } from '@/features/Post/postsSlice'
import { EmptyPage } from './EmptyPage'

export const SuggestionsPosts = () => {
  const posts = useAppSelector((state) => state.posts)
  const sortedPosts = [...posts].sort((a, b) => b.date - a.date)
  if (!sortedPosts.length)
    return (
      <EmptyPage className="flex justify-center items-center h-[80vh]">
        <h3 className="font-normal">There are no posts yet</h3>
      </EmptyPage>
    )
  return (
    <div className="flex flex-col">
      {sortedPosts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  )
}
