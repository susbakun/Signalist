import { AppDispatch } from "@/app/store"
import { CreateSignalButton, CreateSignalModal, Loader, Signal, StreamingUser } from "@/components"
import { fetchSignals, useAppSelector } from "@/features/Signal/signalsSlice"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { EmptyPage } from "./EmptyPage"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useIsUserBlocked } from "@/hooks/useIsUserBlocked"

export const SignalsPage = () => {
  const [openCreateSignalModal, setOpenCreateSignalModal] = useState(false)

  const handleCloseCreateSignalModal = () => {
    setOpenCreateSignalModal(false)
  }

  const hanldeOpenCreateSignalModal = () => {
    setOpenCreateSignalModal(true)
  }
  return (
    <div className="flex flex-col md:flex-row">
      <MobileTopBar />
      <ExploreSignals />
      <RightSidebar />
      <CreateSignalButton handleOpenModal={hanldeOpenCreateSignalModal} />
      <CreateSignalModal
        openModal={openCreateSignalModal}
        handleCloseModal={handleCloseCreateSignalModal}
      />
    </div>
  )
}

const ExploreSignals = () => {
  const dispatch = useDispatch<AppDispatch>()

  const { currentUser: myAccount, loading: userLoading } = useCurrentUser()

  const { signals, loading } = useAppSelector((state) => state.signals)
  const sortedSignals = [...signals].sort((a, b) => b.date - a.date)

  useEffect(() => {
    dispatch(fetchSignals())
  }, [dispatch])

  if (loading || userLoading) {
    return (
      <EmptyPage
        className="flex justify-center items-center h-[80vh] md:flex-1 md:border-r 
        dark:md:border-r-white/20 md:border-r-gray-600/20 md:h-screen"
      >
        <Loader className="h-[350px]" />
      </EmptyPage>
    )
  }

  if (!sortedSignals.length)
    return (
      <EmptyPage
        className="flex justify-center items-center h-[80vh] md:flex-1 md:border-r
        dark:md:border-r-white/20 md:border-r-gray-600/20 md:h-screen"
      >
        <h3 className="font-normal">There are no signals yet</h3>
      </EmptyPage>
    )

  if (!myAccount) return null

  return (
    <div
      className="flex-1 md:border-r dark:md:border-r-white/20
    md:border-r-gray-600/20 pb-4 md:pb-0"
    >
      <h2 className="text-2xl px-4 pt-4 md:pt-11 pb-2 font-bold">Signals</h2>
      <div className="flex flex-col justify-center">
        {sortedSignals.map((signal) => (
          <Signal myAccount={myAccount} key={signal.id} signal={signal} />
        ))}
      </div>
    </div>
  )
}

const RightSidebar = () => {
  const { users, loading: usersLoading } = useAppSelector((state) => state.users)
  const { currentUser: myAccount } = useCurrentUser()
  const { isUserBlocked } = useIsUserBlocked(myAccount)
  let selectedUsers = [
    ...users.filter(
      (user) => user.username !== myAccount?.username && !isUserBlocked(user.username)
    )
  ]
  selectedUsers = selectedUsers.sort((a, b) => b.score - a.score).slice(0, 4)

  if (!myAccount) return null

  return (
    <aside
      className="hidden md:flex flex-col
        w-[30%] h-screen pt-8 px-4 sticky top-0"
    >
      <div
        className="border border-gray-600/20 dark:border-white/20
          rounded-xl gap-4 p-3 flex flex-col"
      >
        <h2 className="text-xl font-bold">Streams</h2>
        <div className="flex flex-col gap-4">
          {usersLoading ? (
            <Loader className="h-[350px]" />
          ) : selectedUsers.length > 0 ? (
            selectedUsers.map((user) => (
              <StreamingUser myAccount={myAccount} key={user.username} {...user} />
            ))
          ) : (
            <EmptyPage className="text-center mt-8 pb-16">
              <h3 className="font-normal">No streams right now</h3>
            </EmptyPage>
          )}
        </div>
      </div>
    </aside>
  )
}

const MobileTopBar = () => {
  const { users, loading: usersLoading } = useAppSelector((state) => state.users)
  const { currentUser: myAccount } = useCurrentUser()
  const { isUserBlocked } = useIsUserBlocked(myAccount)

  let selectedUsers = [
    ...users.filter(
      (user) => user.username !== myAccount?.username && !isUserBlocked(user.username)
    )
  ]
  selectedUsers = selectedUsers.sort((a, b) => b.score - a.score).slice(0, 4)

  if (!myAccount) return null

  return (
    <div className="md:hidden w-full overflow-x-auto py-4 px-4 border-b border-b-gray-600/20 dark:border-b-white/20">
      <h2 className="text-xl font-bold mb-4">Streams</h2>
      <div className="flex gap-6">
        {usersLoading ? (
          <Loader className="w-full" />
        ) : selectedUsers.length > 0 ? (
          selectedUsers.map((user) => (
            <div className="flex flex-col items-center">
              <StreamingUser myAccount={myAccount} key={user.username} {...user} />
              <span className="text-xs mt-1 truncate max-w-[64px] text-center">
                {user.username}
              </span>
            </div>
          ))
        ) : (
          <EmptyPage className="text-center mt-8 pb-8 md:pb-16 w-full">
            <h3 className="font-normal">No streams right now</h3>
          </EmptyPage>
        )}
      </div>
    </div>
  )
}
