import { CreateGroupChooseGroupInfoModal, CreateGroupPickUsersModal } from "@/components"
import { createGroup, useAppSelector } from "@/features/Message/messagesSlice"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useIsUserBlocked } from "@/hooks/useIsUserBlocked"
import * as messagesApi from "@/services/messagesApi"
import { AccountModel, MessageModel } from "@/shared/models"
import { GroupInfoType, SimplifiedAccountType } from "@/shared/types"
import { getCurrentUsername } from "@/utils"
import { ChangeEvent, useCallback, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { v4 } from "uuid"

type CreateGroupModalProps = {
  openModal: boolean
  myMessages: MessageModel[""]
  closeModal: () => void
}

export const CreateGroupModal = ({
  openModal: openPickUsersModal,
  closeModal: closePickUsersModal
}: CreateGroupModalProps) => {
  const [chooseGroupInfoModalOpen, setChooseGroupInfoModalOpen] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [searched, setSearched] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<SimplifiedAccountType[]>([])
  const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined)
  const [isGroupImageSending, setIsGroupImageSending] = useState(false)
  const [createGroupButtonDisabled, setCreateGroupButtonDisabled] = useState(false)
  const [exceptMeUsers, setExceptMeUsers] = useState<AccountModel[]>([])

  const { users, loading: usersLoading } = useAppSelector((state) => state.users)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { currentUser: myAccount } = useCurrentUser()
  const currentUsername = getCurrentUsername()

  const { isUserBlocked } = useIsUserBlocked(myAccount)

  const handleClosePickUsersModal = () => {
    setSelectedUsers([])
    closePickUsersModal()
  }

  const handlePickUsersList = () => {
    closePickUsersModal()
    handleOpenChooseGroupInfo()
  }

  const handleOpenChooseGroupInfo = () => {
    setChooseGroupInfoModalOpen(true)
  }

  const handleCloseChooseGroupInfo = () => {
    setChooseGroupInfoModalOpen(false)
    handleResetForm()
  }

  const handleChooseGroupInfo = () => {
    handleCreateGroup()
  }

  const handleSearchUsers = useCallback(() => {
    return exceptMeUsers.filter(
      (user) =>
        (user.username.toLowerCase().includes(searched.toLowerCase()) ||
          user.name.toLocaleLowerCase().includes(searched)) &&
        !isUserBlocked(user.username)
    )
  }, [exceptMeUsers, searched])

  const handleSearchUsersChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearched(e.target.value)
  }

  const handleGroupNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value)
  }

  const handleCheckboxChange = (selectedUser: SimplifiedAccountType) => {
    if (isUserSelected(selectedUser.username)) {
      setSelectedUsers((prevUsers) =>
        prevUsers.filter((user) => user.username != selectedUser.username)
      )
    } else {
      setSelectedUsers((prevUsers) => [...prevUsers, selectedUser])
    }
  }
  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImage(e.target.files[0])
    }
  }

  const handleCancelSelectImage = () => {
    setSelectedImage(undefined)
  }

  const handleSendImage = async (selectedFile: File | undefined) => {
    if (selectedFile) {
      try {
        // Upload image to backend and get the image id
        const response = await messagesApi.uploadMessageImage(selectedFile)
        console.log("Group image uploaded successfully:", response)
        return response.messageImageHref
      } catch (error) {
        console.error("Failed to upload group image:", error)
      }
    }
  }

  const isUserSelected = (username: SimplifiedAccountType["username"]) => {
    return selectedUsers?.some((user) => user.username === username)
  }

  const handleResetForm = () => {
    setGroupName("")
    setSearched("")
    setSelectedUsers([])
    setIsGroupImageSending(false)
    setCreateGroupButtonDisabled(false)
  }

  const handleCreateGroup = async () => {
    if (groupName.trim() === "") return
    if (!myAccount) return

    setIsGroupImageSending(true)
    setCreateGroupButtonDisabled(true)
    const groupImageHref = await handleSendImage(selectedImage)
    const roomId = v4()
    const groupInfo: GroupInfoType = {
      groupName,
      groupImageHref
    }
    dispatch(
      createGroup({ myUsername: myAccount?.username, roomId, userInfos: selectedUsers, groupInfo })
    )
    closePickUsersModal()
    navigate(roomId)
    handleResetForm()
    handleCloseChooseGroupInfo()
  }

  useEffect(() => {
    if (selectedUsers.length > 0) {
      setExceptMeUsers(users.filter((user) => user.username !== currentUsername))
    }
  }, [users, currentUsername])

  return (
    <>
      <CreateGroupPickUsersModal
        handleCheckboxChange={handleCheckboxChange}
        handleCloseModal={handleClosePickUsersModal}
        handlePickUsersList={handlePickUsersList}
        handleInputChange={handleSearchUsersChange}
        handleSearchUsers={handleSearchUsers}
        isUserSelected={isUserSelected}
        openModal={openPickUsersModal}
        searched={searched}
        usersLoading={usersLoading}
      />
      <CreateGroupChooseGroupInfoModal
        openModal={chooseGroupInfoModalOpen}
        groupName={groupName}
        selectedImage={selectedImage}
        isGroupImageSending={isGroupImageSending}
        createGroupButtonDisabled={createGroupButtonDisabled}
        handleCloseModal={handleCloseChooseGroupInfo}
        handleCancelSelectImage={handleCancelSelectImage}
        handleChooseGroupInfo={handleChooseGroupInfo}
        handleChangeGroupName={handleGroupNameChange}
        handleChangeImage={handleChangeImage}
      />
    </>
  )
}
