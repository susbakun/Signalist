import { CreatePostModal, Post } from "@/components"
import { useAppSelector } from "@/features/Post/postsSlice"
import { EmptyPage } from "@/pages"
import { getCurrentUsername } from "@/utils"
import Tippy from "@tippyjs/react"
import { useState } from "react"
import { GoPlusCircle } from "react-icons/go"
import { useParams } from "react-router-dom"
import { roundArrow } from "tippy.js"

export const UserPosts = () => {
  const [openCreatePostModal, setOpenCreatePostModal] = useState(false)

  const { username } = useParams()
  const posts = useAppSelector((state) => state.posts)
  const users = useAppSelector((state) => state.users)
  const userAccount = users.find((user) => user.username === username)
  const currentUsername = getCurrentUsername()
  const isItmyAccount = userAccount?.username === currentUsername
  const myPosts = posts
    .filter((post) => post.publisher.username === userAccount?.username)
    .sort((a, b) => b.date - a.date)

  const handleCloseCreatePostModal = () => {
    setOpenCreatePostModal(false)
  }

  const hanldeOpenCreatePostModal = () => {
    setOpenCreatePostModal(true)
  }

  if (myPosts.length == 0)
    return (
      <EmptyPage className="text-center mt-8 pb-16">
        <h3 className="font-normal">No posts found</h3>
      </EmptyPage>
    )
  return (
    <>
      <div className="flex flex-col pb-4 mx-4 md:px-0 md:pb-0 md:mx-16 border-x border-x-gray-600/20 dark:border-white/20">
        {myPosts.map((post) => (
          <Post
            className="border-y border-y-gray-600/20 dark:border-y-white/20 px-3 py-4 md:px-4 md:py-6"
            key={post.id}
            post={post}
          />
        ))}
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
