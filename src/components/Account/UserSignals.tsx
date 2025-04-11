import { AppDispatch } from "@/app/store"
import { CreateSignalModal, Loader, Signal } from "@/components"
import { fetchSignals, useAppSelector } from "@/features/Signal/signalsSlice"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { EmptyPage } from "@/pages"
import { getCurrentUsername } from "@/utils"
import Tippy from "@tippyjs/react"
import { useEffect, useState } from "react"
import { HiMiniSignal } from "react-icons/hi2"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { roundArrow } from "tippy.js"

export const UserSignals = () => {
  const [openCreateSignalModal, setOpenCreateSignalModal] = useState(false)
  const dispatch = useDispatch<AppDispatch>()

  const { signals, loading } = useAppSelector((state) => state.signals)
  const { users, loading: usersLoading } = useAppSelector((state) => state.users)
  const { username } = useParams()
  const { currentUser: myAccount } = useCurrentUser()

  const userAccount = users.find((user) => user.username === username)

  const userSignals = signals
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

  useEffect(() => {
    dispatch(fetchSignals())
  }, [dispatch])

  if (loading || usersLoading) {
    return (
      <EmptyPage className="flex justify-center items-center h-[80vh]">
        <Loader className="h-[350px]" />
      </EmptyPage>
    )
  }

  if (userSignals.length === 0)
    return (
      <EmptyPage className="text-center mt-8 pb-16">
        <h3 className="font-normal">No signals found</h3>
      </EmptyPage>
    )

  if (!myAccount) return

  return (
    <>
      <div className="pb-4 w-full overflow-hidden relative flex flex-col justify-center md:px-16 md:pb-0">
        <div className="w-full overflow-hidden border-x mx-0 dark:border-x-white/20 border-x-gray-600/20 px-0 inset-0">
          {userSignals.map((signal) => (
            <Signal key={signal.id} signal={signal} myAccount={myAccount} />
          ))}
        </div>
        {isItmyAccount && (
          <Tippy
            content="create signal"
            className="dark:bg-gray-700 bg-gray-900 text-white font-sans rounded-md px-1 py-[1px] text-sm"
            delay={[1000, 0]}
            placement="top"
            animation="fade"
            arrow={roundArrow}
            duration={10}
            hideOnClick={true}
          >
            <button
              onClick={hanldeOpenCreateSignalModal}
              className="main-button transition-all duration-100 ease-out fixed bottom-16 right-4 md:bottom-4 px-3 py-3 md:px-4 md:py-4 rounded-full z-10"
            >
              <HiMiniSignal className="w-5 h-5 md:w-6 md:h-6" />
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
