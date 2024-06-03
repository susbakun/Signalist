import { useAppSelector } from '@/features/Post/postsSlice'
import { Avatar, Modal } from 'flowbite-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export const UserPremiumModal = () => {
  const [openModal, setIsOpenModal] = useState(true)
  const navigate = useNavigate()
  const { username: myUsername } = useParams()

  const me = useAppSelector((state) => state.users).find((user) => user.username === myUsername)

  const handleCloseModal = () => {
    setIsOpenModal(false)
    navigate(`/${myUsername}`)
  }

  if (me)
    return (
      <Modal size="xl" show={openModal} onClose={handleCloseModal}>
        <Modal.Header className="border-none pr-1 py-2" />
        <Modal.Body
          className="flex overflow-y-auto
        flex-col gap-2 py-0 mb-0 px-4 custom-modal"
        >
          <div className="flex flex-col justify-center space-y-4 mb-4 border px-2 py-4 rounded-md dark:border-white/20 border-gray-600/20">
            <Avatar placeholderInitials="AA" size="xl" img={me.imageUrl} rounded />
            <div
              className="space-y-1 font-medium dark:text-white                            
            text-slate-700 flex flex-col justify-center text-center"
            >
              <div>{me.name}</div>
              <div className="detail-text">@{me.username}</div>
              <div>score: {me.score}</div>
              {me.subscribed && <div>remaining: 22days</div>}
            </div>
            <div className="flex items-center flex-col font-bold gap-4 px-12">
              <h3 className="text-xl">SUBSCRIPTION BUNDLES</h3>
              <div
                className="flex justify-between bg-gradient-to-r
              dark:from-dark-link-button from-primary-link-button to-[#ff00e5]
              dark:to-[#ff00e5] w-full rounded-md px-2 py-3 cursor-pointer mb-2
              transition-all ease-linear hover:scale-[1.15]"
              >
                <p>30 days</p>
                <p>{me.subscribed ? '$39.99' : '$59.99'}</p>
              </div>
              <div
                className="flex justify-between bg-gradient-to-r
              dark:from-dark-link-button from-primary-link-button to-[#ff00e5]
              dark:to-[#ff00e5] w-full rounded-md px-2 py-3 cursor-pointer mb-2
              transition-all ease-linear hover:scale-[1.15]"
              >
                <p>3 months</p>
                <p>{me.subscribed ? '$99.99' : '$159.99'}</p>
              </div>
              <div
                className="flex justify-between bg-gradient-to-r
              dark:from-dark-link-button from-primary-link-button to-[#ff00e5]
              dark:to-[#ff00e5] w-full rounded-md px-2 py-3 cursor-pointer mb-2
                transition-all ease-linear hover:scale-[1.15]"
              >
                <p>6 months</p>
                <p>{me.subscribed ? '$229.99' : '$349.99'}</p>
              </div>
              <div
                className="flex justify-between bg-gradient-to-r
              dark:from-dark-link-button from-primary-link-button to-[#ff00e5]
              dark:to-[#ff00e5] w-full rounded-md px-2 py-3 cursor-pointer mb-2
              transition-all ease-linear hover:scale-[1.15]"
              >
                <p>12 months</p>
                <p>{me.subscribed ? '$469.99' : '$669.99'}</p>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    )
}
