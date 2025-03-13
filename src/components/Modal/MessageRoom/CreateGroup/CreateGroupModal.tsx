import { CreateGroupChooseGroupInfoModal, CreateGroupPickUsersModal } from "@/components"
import { createGroup, useAppSelector } from "@/features/Message/messagesSlice"
import { useIsUserBlocked } from "@/hooks/useIsUserBlocked"
import { appwriteEndpoint, appwriteMessagesBucketId, appwriteProjectId } from "@/shared/constants"
import { MessageModel } from "@/shared/models"
import { GroupInfoType, SimplifiedAccountType } from "@/shared/types"
import { getCurrentUsername } from "@/utils"
import { Client, ID, Storage } from "appwrite"
import { ChangeEvent, useCallback, useState } from "react"
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

  const users = useAppSelector((state) => state.users)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const currentUsername = getCurrentUsername()
  const myAccount = users.find((user) => user.username === currentUsername)

  const exceptMeUsers = users.filter((user) => user.username !== currentUsername)

  const client = new Client().setEndpoint(appwriteEndpoint).setProject(appwriteProjectId)

  const storage = new Storage(client)

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
      const file = new File([selectedFile], "screenshot.png", { type: "image/png" })
      try {
        const response = await storage.createFile(appwriteMessagesBucketId, ID.unique(), file)
        console.log("Image uploaded successfully:", response)
        return response.$id
      } catch (error) {
        console.error("Failed to upload image:", error)
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
    const groupImageId = await handleSendImage(selectedImage)
    const roomId = v4()
    const groupInfo: GroupInfoType = {
      groupName,
      groupImageId
    }
    dispatch(
      createGroup({ myUsername: myAccount?.username, roomId, userInfos: selectedUsers, groupInfo })
    )
    closePickUsersModal()
    navigate(roomId)
    handleResetForm()
    handleCloseChooseGroupInfo()
  }

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
