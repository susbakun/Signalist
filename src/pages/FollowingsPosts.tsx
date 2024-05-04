import { Post } from '@/components'
import { useAppSelector } from '@/features/Post/postsSlice'
import { EmptyPage } from './EmptyPage'

export const FollowingsPosts = () => {
  const posts = useAppSelector((state) => state.posts)
  if (!posts.length)
    return (
      <EmptyPage>
        <h3 className="text-center leading-[80vh]">There are no posts yet</h3>
      </EmptyPage>
    )
  return (
    <div className="flex flex-col">
      {posts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </div>
  )
}
