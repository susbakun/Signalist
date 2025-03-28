import { CreateSignalModal, Signal } from "@/components"
import { useAppSelector } from "@/features/Post/postsSlice"
import { EmptyPage } from "@/pages"
import { getCurrentUsername } from "@/utils"
import Tippy from "@tippyjs/react"
import { useState } from "react"
import { HiMiniSignal } from "react-icons/hi2"
import { useParams } from "react-router-dom"
import { roundArrow } from "tippy.js"

export const UserSignals = () => {
  const [openCreateSignalModal, setOpenCreateSignalModal] = useState(false)

  const { username: userUsername } = useParams()
  const userAccount = useAppSelector((store) => store.users).find(
    (user) => user.username === userUsername
  )
  const mySignals = useAppSelector((state) => state.signals)
    .filter((signal) => signal.publisher.username === userAccount?.username)
    .sort((a, b) => b.date - a.date)
  const currentUsername = getCurrentUsername()
  const isItmyAccount = userAccount?.username === currentUsername

  const handleCloseCreateSignalModal = () => {
    setOpenCreateSignalModal(false)
  }

  const hanldeOpenCreateSignalModal = () => {
    setOpenCreateSignalModal(true)
  }

  if (mySignals.length === 0)
    return (
      <EmptyPage className="text-center mt-8">
        <h3 className="font-normal">No signals found</h3>
      </EmptyPage>
    )

  return (
    <>
      <div className="px-[200px] relative">
        <ul
          className="flex flex-col justify-center
          border-x dark:border-x-white/20
        border-x-gray-600/20"
        >
          {mySignals.map((signal) => (
            <Signal key={signal.id} signal={signal} />
          ))}
        </ul>
        {isItmyAccount && (
          <Tippy
            content="create signal"
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
              onClick={hanldeOpenCreateSignalModal}
              className="main-button transition-all duration-100 ease-out fixed
            right-4 bottom-4 px-4 py-4 rounded-full"
            >
              <HiMiniSignal className="w-6 h-6" />
            </button>
          </Tippy>
        )}
      </div>
      <CreateSignalModal
        openModal={openCreateSignalModal}
        handleCloseModal={handleCloseCreateSignalModal}
      />
    </>
  )
}
