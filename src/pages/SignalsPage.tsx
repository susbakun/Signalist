import { CreateSignalButton, CreateSignalModal, Signal, StreamingUser } from "@/components"
import { useAppSelector } from "@/features/Post/postsSlice"
import { getCurrentUsername } from "@/utils"
import { useState } from "react"

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
  const signals = useAppSelector((state) => state.signals)
  const sortedSignals = [...signals].sort((a, b) => b.date - a.date)

  return (
    <div
      className="flex-1 md:border-r dark:md:border-r-white/20
    md:border-r-gray-600/20 pb-4 md:pb-0"
    >
      <h2 className="text-2xl px-4 pt-4 md:pt-11 pb-2 font-bold">Signals</h2>
      <div className="flex flex-col justify-center">
        {sortedSignals.map((signal) => (
          <Signal key={signal.id} signal={signal} />
        ))}
      </div>
    </div>
  )
}

const RightSidebar = () => {
  const users = useAppSelector((state) => state.users)
  const currentUsername = getCurrentUsername()
  const myAccount = users.find((user) => user.username === currentUsername)
  let selectedUsers = [...users.filter((user) => user.username !== myAccount?.username)]
  selectedUsers = selectedUsers.sort((a, b) => b.score - a.score).slice(0, 4)

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
          {selectedUsers.map((user) => (
            <StreamingUser key={user.username} {...user} />
          ))}
        </div>
      </div>
    </aside>
  )
}

const MobileTopBar = () => {
  const users = useAppSelector((state) => state.users)
  const currentUsername = getCurrentUsername()
  const myAccount = users.find((user) => user.username === currentUsername)
  let selectedUsers = [...users.filter((user) => user.username !== myAccount?.username)]
  selectedUsers = selectedUsers.sort((a, b) => b.score - a.score).slice(0, 4)

  return (
    <div className="md:hidden w-full overflow-x-auto py-4 px-4 border-b border-b-gray-600/20 dark:border-b-white/20">
      <h2 className="text-xl font-bold mb-4">Streams</h2>
      <div className="flex gap-6">
        {selectedUsers.map((user) => (
          <div className="flex flex-col items-center">
            <StreamingUser key={user.username} {...user} />
            <span className="text-xs mt-1 truncate max-w-[64px] text-center">{user.username}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
