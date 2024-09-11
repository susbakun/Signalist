import { UserPreview } from "@/components/Shared/UserPreview"
import { createGroup, useAppSelector } from "@/features/Message/messagesSlice"
import { useIsUserBlocked } from "@/hooks/useIsUserBlocked"
import { EmptyPage } from "@/pages"
import { AccountModel, MessageModel } from "@/shared/models"
import { GroupInfoType, SimplifiedAccountType } from "@/shared/types"
import { cn } from "@/utils"
import { Modal } from "flowbite-react"
import { ChangeEvent, useCallback, useMemo, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { v4 } from "uuid"

type CreateGroupModalProps = {
  openModal: boolean
  myMessages: MessageModel[""]
  closeModal: () => void
}

export const CreateGroupModal = ({ openModal, closeModal }: CreateGroupModalProps) => {
  const [searched, setSearched] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<AccountModel["username"][]>([])

  const users = useAppSelector((state) => state.users)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const myAccount = users.find((user) => user.username === "Amir_Aryan")

  const exceptMeUsers = users.filter((user) => user.username !== "Amir_Aryan")

  const { isUserBlocked } = useIsUserBlocked(myAccount)

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

  const handleCheckboxChange = (selectedUsername: SimplifiedAccountType["username"]) => {
    if (isUserSelected(selectedUsername)) {
      setSelectedUsers((prevUsers) => prevUsers.filter((username) => username != selectedUsername))
    } else {
      setSelectedUsers((prevUsers) => [...prevUsers, selectedUsername])
    }
  }

  const isUserSelected = (username: SimplifiedAccountType["username"]) => {
    return selectedUsers?.some((selectedUsername) => selectedUsername === username)
  }

  const handleCloseModal = () => {
    setSelectedUsers([])
    closeModal()
  }

  const handleCreateGroup = () => {
    const roomId = v4()
    const groupInfo: GroupInfoType = {
      groupName: "test",
      groupImageUrl: ""
    }
    dispatch(
      createGroup({ myUsername: myAccount?.username, roomId, userInfos: selectedUsers, groupInfo })
    )
    handleCloseModal()
    navigate(roomId)
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
                selected={isUserSelected(user.username)}
                isForMessageGroup
                handleCheckboxChange={() => handleCheckboxChange(user.username)}
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
      <Modal.Footer className="py-3 px-2">
        <div className="flex items-center justify-end w-full">
          <button
            onClick={handleCreateGroup}
            className="action-button dark:bg-dark-link-button
          bg-primary-link-button rounded-md px-2 py-1"
          >
            Create Group
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}
