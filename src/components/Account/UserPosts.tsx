import { AppDispatch } from "@/app/store"
import { CreatePostModal, Loader, Post } from "@/components"
import { fetchPosts, useAppSelector } from "@/features/Post/postsSlice"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { EmptyPage } from "@/pages"
import Tippy from "@tippyjs/react"
import { useEffect, useState } from "react"
import { GoPlusCircle } from "react-icons/go"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { roundArrow } from "tippy.js"

export const UserPosts = () => {
  const [openCreatePostModal, setOpenCreatePostModal] = useState(false)

  const { username } = useParams()
  const { posts, loading } = useAppSelector((state) => state.posts)
  const dispatch = useDispatch<AppDispatch>()
  const { currentUser: myAccount } = useCurrentUser()

  const { users, loading: usersLoading } = useAppSelector((state) => state.users)
  const userAccount = users.find((user) => user.username === username)

  const isItmyAccount = userAccount?.username === myAccount?.username
  const userPosts = posts
    .filter((post) => post.publisher.username === userAccount?.username)
    .sort((a, b) => b.date - a.date)

  const handleCloseCreatePostModal = () => {
    setOpenCreatePostModal(false)
  }

  const hanldeOpenCreatePostModal = () => {
    setOpenCreatePostModal(true)
  }

  useEffect(() => {
    dispatch(fetchPosts())
  }, [dispatch])

  if (loading || usersLoading) {
    return (
      <EmptyPage className="flex justify-center items-center h-[20vh]">
        <Loader className="h-[350px]" />
      </EmptyPage>
    )
  }

  if (userPosts.length == 0)
    return (
      <EmptyPage className="text-center mt-8 pb-16">
        <h3 className="font-normal">No posts found</h3>
      </EmptyPage>
    )

  if (!myAccount) return null

  return (
    <>
      <div className="flex flex-col mb-4 mx-4 md:px-0 md:pb-0 md:mx-16 border-x border-x-gray-600/20 dark:border-white/20">
        {userPosts.map((post) => (
          <Post
            className="border-y border-y-gray-600/20 dark:border-y-white/20 px-3 py-4 md:px-4 md:py-6"
            key={post.id}
            post={post}
            myAccount={myAccount}
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
