import { UserPreview } from "@/components/Shared/UserPreview"
import { createRoom, useAppSelector } from "@/features/Message/messagesSlice"
import { useIsUserBlocked } from "@/hooks/useIsUserBlocked"
import { useUserMessageRoom } from "@/hooks/useUserMessageRoom"
import { EmptyPage } from "@/pages"
import { AccountModel, MessageModel } from "@/shared/models"
import { SimplifiedAccountType } from "@/shared/types"
import { cn } from "@/utils"
import { Modal } from "flowbite-react"
import { ChangeEvent, useCallback, useMemo, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { v4 } from "uuid"

type CreateMessageModalProps = {
  openModal: boolean
  myMessages: MessageModel[""]
  handleCloseModal: () => void
}

export const CreateMessageModal = ({
  openModal,
  handleCloseModal,
  myMessages
}: CreateMessageModalProps) => {
  const [searched, setSearched] = useState("")

  const users = useAppSelector((state) => state.users)

  const myAccount = users.find((user) => user.username === "Amir_Aryan")

  const exceptMeUsers = users.filter((user) => user.username !== "Amir_Aryan")

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isUserBlocked } = useIsUserBlocked(myAccount)

  const { checkIfExistsRoom, findExistingRoomId } = useUserMessageRoom()

  const handleSearchUsers = useCallback(() => {
    return exceptMeUsers.filter(
      (user) =>
        (user.username.toLowerCase().includes(searched.toLowerCase()) ||
          user.name.toLocaleLowerCase().includes(searched)) &&
        !isUserBlocked(user.username)
    )
  }, [exceptMeUsers, searched])

  const searchedUsers = useMemo(() => handleSearchUsers(), [handleSearchUsers])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearched(e.target.value)
  }

  const handleCreateMessage = (user: AccountModel) => {
    handleCloseModal()
    if (checkIfExistsRoom(myMessages, user)) {
      const roomId = findExistingRoomId(myMessages, user)
      navigate(roomId!)
    } else {
      const userInfo: SimplifiedAccountType = {
        name: user.name,
        username: user.username,
        imageUrl: user.imageUrl
      }
      const roomId = v4()
      dispatch(createRoom({ myUsername: myAccount?.username, userInfo, roomId }))
      navigate(roomId)
    }
  }

  return (
    <Modal size="md" show={openModal} onClose={handleCloseModal}>
      <Modal.Header className="border-none pr-1 py-2" />
      <Modal.Body
        className="flex overflow-y-auto
        flex-col gap-2 py-2 mb-4 px-4 custom-modal min-h-[400px]"
      >
        <div
          className="flex items-center relative
          justify-center"
        >
          <input
            value={searched}
            onChange={handleInputChange}
            className="custom-input w-full pl-4 inline-block"
            placeholder="Search"
          />
        </div>
        <div className="flex flex-col mt-4">
          {searchedUsers.length > 0 ? (
            searchedUsers.map((user, index) => (
              <UserPreview
                className={cn("border-b pt-2 border-b-gray-600/20 pb-4 dark:border-b-white/20", {
                  "border-none pb-0": index === searchedUsers.length - 1
                })}
                {...user}
                isForMessageRoom
                handleCreateMessage={() => handleCreateMessage(user)}
                key={user.username}
              />
            ))
          ) : (
            <EmptyPage className="h-[80%] w-full flex items-center justify-center">
              <p className="font-normal">No results found</p>
            </EmptyPage>
          )}
        </div>
      </Modal.Body>
    </Modal>
  )
}
