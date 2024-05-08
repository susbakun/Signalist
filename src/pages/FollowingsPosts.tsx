import { Post } from '@/components'
import { useAppSelector } from '@/features/Post/postsSlice'
import { EmptyPage } from '@/pages'

export const FollowingsPosts = () => {
  const allPosts = useAppSelector((state) => state.posts)
  const users = useAppSelector((state) => state.users)
  const me = users.find((user) => user.username === 'Amir Aryan')
  const followingPosts = [
    ...allPosts.filter((post) => {
      if (me?.followings.includes(post.publisher.username)) {
        return post
      }
    })
  ].sort((a, b) => b.date - a.date)
  if (!followingPosts.length)
    return (
      <EmptyPage>
        <h3 className="text-center leading-[80vh]">There are no posts yet</h3>
      </EmptyPage>
    )
  return (
    <div className="flex flex-col">
      {followingPosts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </div>
  )
}
