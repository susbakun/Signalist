import { CreatePostButton, CreatePostModal, ExploreTopBar, Loader, UserPreview } from "@/components"
import { fetchUsersAsync, useAppSelector } from "@/features/User/usersSlice"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useIsUserBlocked } from "@/hooks/useIsUserBlocked"
import { editPostRouteRegExp } from "@/shared/constants"
import { useEffect, useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { EmptyPage } from "./EmptyPage"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/app/store"
import { sampleSize } from "lodash"

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
  const dispatch = useDispatch<AppDispatch>()
  const { users, loading: usersLoading } = useAppSelector((state) => state.users)
  const { currentUser: myAccount } = useCurrentUser()
  const { isUserBlocked, areYouBlocked } = useIsUserBlocked(myAccount)

  useEffect(() => {
    if (users.length === 0 && !usersLoading) {
      dispatch(fetchUsersAsync())
    }
  }, [users, usersLoading, dispatch])

  let selectedUsers =
    users.length > 0
      ? [
          ...users.filter(
            (user) =>
              user.username !== myAccount?.username &&
              !isUserBlocked(user.username) &&
              !areYouBlocked(user) &&
              user.username !== "MarmadukeWhisperer"
          )
        ]
      : []

  const randomUsers = sampleSize(selectedUsers, 4)

  selectedUsers = randomUsers.sort((a, b) => b.score - a.score)

  return (
    <aside className="w-full h-screen flex flex-col pt-8 px-4 md:px-8 sticky top-0">
      {usersLoading ? (
        <Loader className="h-[80%]" />
      ) : (
        <div
          className="border border-gray-600/20 dark:border-white/20
        rounded-xl gap-4 p-3 flex flex-col"
        >
          <h2 className="text-xl font-bold">Who to follow</h2>
          {selectedUsers.length > 0 ? (
            <div className="flex flex-col gap-4">
              {selectedUsers.map((user) => (
                <UserPreview follower={myAccount || undefined} key={user.username} {...user} />
              ))}
            </div>
          ) : (
            <EmptyPage className="text-center mt-8 pb-8 md:pb-16 w-full">
              <h3 className="font-normal">No users to follow</h3>
            </EmptyPage>
          )}
        </div>
      )}
    </aside>
  )
}
