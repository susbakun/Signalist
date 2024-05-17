import { CreateSignalButton, CreateSignalModal, Signal, StreamingUser } from '@/components'
import { useAppSelector } from '@/features/Post/postsSlice'
import { useState } from 'react'

export const SignalsPage = () => {
  const [openCreateSignalModal, setOpenCreateSignalModal] = useState(false)

  const handleCloseCreateSignalModal = () => {
    setOpenCreateSignalModal(false)
  }

  const hanldeOpenCreateSignalModal = () => {
    setOpenCreateSignalModal(true)
  }
  return (
    <div className="flex">
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
      className="flex-1 border-r dark:border-r-white/20
    border-r-gray-600/20"
    >
      <h2 className="text-2xl px-4 pt-11 pb-2 font-bold">Signals</h2>
      <ul className="flex flex-col justify-center">
        {sortedSignals.map((signal) => (
          <Signal key={signal.id} signal={signal} />
        ))}
      </ul>
    </div>
  )
}

const RightSidebar = () => {
  const users = useAppSelector((state) => state.users)
  const me = users.find((user) => user.username === 'Amir Aryan')
  let selectedUsers = [...users.filter((user) => user.username !== me?.username)]
  selectedUsers = selectedUsers.sort((a, b) => b.score - a.score).slice(0, 4)

  return (
    <aside
      className="flex flex-col
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
