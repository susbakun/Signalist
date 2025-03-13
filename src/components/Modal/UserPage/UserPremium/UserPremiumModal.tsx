import { useAppSelector } from "@/features/Post/postsSlice"
import { useIsUserSubscribed } from "@/hooks/useIsUserSubscribed"
import { getCurrentUsername } from "@/utils"
import { Modal } from "flowbite-react"
import moment from "jalali-moment"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { SubscriptionBundles } from "./SubscriptionBundles"
import { UserPremiumModalUserInfo } from "./UserPremiumModalUserInfo"

export const UserPremiumModal = () => {
  const [openModal, setIsOpenModal] = useState(true)
  const navigate = useNavigate()
  const { username: myUsername } = useParams()

  const userAccount = useAppSelector((state) => state.users).find(
    (user) => user.username === myUsername
  )

  const { amISubscribed } = useIsUserSubscribed(userAccount!)
  const subscriber = userAccount?.subscribers?.find(
    (subscriber) => subscriber.username === currentUsername
  )

  const handleCloseModal = () => {
    setIsOpenModal(false)
    navigate(`/${myUsername}`)
  }

  if (userAccount)
    return (
      <Modal size="xl" show={openModal} onClose={handleCloseModal}>
        <Modal.Header className="border-none pr-1 py-2" />
        <Modal.Body
          className="flex overflow-y-auto
        flex-col gap-2 py-0 mb-0 px-4 custom-modal"
        >
          <div
            className="flex flex-col justify-center space-y-4 mb-4 border
            px-2 py-4 rounded-md dark:border-white/20 border-gray-600/20"
          >
            <UserPremiumModalUserInfo userAccount={userAccount} />
            <SubscriptionBundles subscriptionPlan={userAccount.susbscriptionPlan} />
            {amISubscribed && subscriber && (
              <div className="detail-text flex justify-center gap-1">
                your subscription will expire{" "}
                <span className="font-bold dark:text-white text-gray-600">
                  {moment(subscriber.expireDate).startOf("D").fromNow()}
                </span>
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
    )
}
