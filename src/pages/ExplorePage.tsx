import { CreatePostButton, CreatePostModal, ExploreTopBar, UserPreview } from "@/components"
import { useAppSelector } from "@/features/User/usersSlice"
import { useIsUserBlocked } from "@/hooks/useIsUserBlocked"
import { editPostRouteRegExp } from "@/shared/constants"
import { getCurrentUsername } from "@/utils"
import { useEffect, useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"

export const ExplorePage = () => {
  const [openCreatePostModal, setOpenCreatePostModal] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.pathname == "/explore") {
      navigate("followings")
    }
    if (editPostRouteRegExp.test(location.pathname)) {
      setOpenCreatePostModal(true)
    }
  }, [location, navigate])

  const handleCloseCreatePostModal = () => {
    setOpenCreatePostModal(false)
  }

  const hanldeOpenCreatePostModal = () => {
    setOpenCreatePostModal(true)
  }

  return (
    <div className="flex flex-row">
      <ExplorePosts />
      <div className="hidden md:block w-[38%]">
        <RightSideBar />
      </div>
      <CreatePostButton handleOpenModal={hanldeOpenCreatePostModal} />
      <CreatePostModal
        openModal={openCreatePostModal}
        handleCloseModal={handleCloseCreatePostModal}
      />
    </div>
  )
}

const ExplorePosts = () => {
  return (
    <div
      className="flex-1 md:border-r-gray-600/20 md:dark:border-r-white/20
      md:border-r overflow-hidden"
    >
      <ExploreTopBar />
      <Outlet />
    </div>
  )
}

export const RightSideBar = () => {
  const users = useAppSelector((state) => state.users)
  const currentUsername = getCurrentUsername()
  const myAccount = users.find((user) => user.username === currentUsername)
  const { isUserBlocked } = useIsUserBlocked(myAccount)
  let selectedUsers = [
    ...users.filter(
      (user) => user.username !== myAccount?.username && !isUserBlocked(user.username)
    )
  ]
  selectedUsers = selectedUsers.sort((a, b) => b.score - a.score).slice(0, 4)

  return (
    <aside className="w-full h-screen flex flex-col pt-8 px-4 md:px-8 sticky top-0">
      <div
        className="border border-gray-600/20 dark:border-white/20
        rounded-xl gap-4 p-3 flex flex-col"
      >
        <h2 className="text-xl font-bold">Who to follow</h2>
        <div className="flex flex-col gap-4">
          {selectedUsers.map((user) => (
            <UserPreview follower={myAccount || undefined} key={user.username} {...user} />
          ))}
        </div>
      </div>
    </aside>
  )
}
