import { Post } from '@/components'
import { useAppSelector } from '@/features/Post/postsSlice'
import { EmptyPage } from '@/pages'
import { PostModel } from '@/shared/models'

export const FollowingsPosts = () => {
  const allPosts = useAppSelector((state) => state.posts)
  const users = useAppSelector((state) => state.users)
  const me = users.find((user) => user.username === 'Amir_Aryan')

  const isMyFollowingPost = (post: PostModel) => {
    return me?.followings.some((following) => following.username.includes(post.publisher.username))
  }

  const followingPosts = [
    ...allPosts.filter((post) => {
      if (isMyFollowingPost(post)) {
        return post
      }
    })
  ].sort((a, b) => b.date - a.date)
  if (!followingPosts.length)
    return (
      <EmptyPage className="flex justify-center items-center w-full h-[80vh]">
        <h3>There are no posts yet</h3>
      </EmptyPage>
    )
  return (
    <div className="flex flex-col">
      {followingPosts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  )
}
