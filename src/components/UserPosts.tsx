import { useAppSelector } from '@/features/Post/postsSlice'
import { EmptyPage } from '@/pages'
import Tippy from '@tippyjs/react'
import { useState } from 'react'
import { GoPlusCircle } from 'react-icons/go'
import { useParams } from 'react-router-dom'
import { roundArrow } from 'tippy.js'
import { CreatePostModal } from './Modal/CreatePost/CreatePostModal'
import { Post } from './Post/Post'

export const UserPosts = () => {
  const [openCreatePostModal, setOpenCreatePostModal] = useState(false)

  const { username: myUsername } = useParams()
  const users = useAppSelector((store) => store.users)
  const me = users.find((user) => user.username === myUsername)
  const myPosts = useAppSelector((state) => state.posts)
    .filter((post) => post.publisher.username === me?.username)
    .sort((a, b) => b.date - a.date)
  const isItmyAccount = me?.username === 'Amir_Aryan'

  const handleCloseCreatePostModal = () => {
    setOpenCreatePostModal(false)
  }

  const hanldeOpenCreatePostModal = () => {
    setOpenCreatePostModal(true)
  }

  if (myPosts.length == 0)
    return (
      <EmptyPage className="text-center mt-8">
        <h3>No posts found</h3>
      </EmptyPage>
    )
  return (
    <>
      <div
        className="flex flex-col mx-[200px]
      border-x border-x-gray-600/20 dark:border-white/20"
      >
        {myPosts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
        {isItmyAccount && (
          <Tippy
            content="create post"
            className="dark:bg-gray-700 bg-gray-900 text-white font-sans
      rounded-md px-1 py-[1px] text-sm"
            delay={[1000, 0]}
            placement="top"
            animation="fade"
            arrow={roundArrow}
            duration={10}
            hideOnClick={true}
          >
            <button
              onClick={hanldeOpenCreatePostModal}
              className="main-button transition-all duration-100 ease-out fixed
        right-4 bottom-4 px-4 py-4 rounded-full"
            >
              <GoPlusCircle className="w-6 h-6" />
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
