import { CreateGroupChooseGroupInfoModal, CreateGroupPickUsersModal } from "@/components"
import { AppDispatch } from "@/app/store"
import { createGroupConversationAsync, useAppSelector } from "@/features/Message/messagesSlice"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useIsUserBlocked } from "@/hooks/useIsUserBlocked"
import * as messagesApi from "@/services/messagesApi"
import { AccountModel, MessageModel } from "@/shared/models"
import { SimplifiedAccountType } from "@/shared/types"
import { getCurrentUsername } from "@/utils"
import { ChangeEvent, useCallback, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

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
  const [error, setError] = useState<string | null>(null)

  const { users, loading: usersLoading } = useAppSelector((state) => state.users)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const { currentUser: myAccount } = useCurrentUser()
  const currentUsername = getCurrentUsername()

  const { isUserBlocked } = useIsUserBlocked(myAccount)

  const handleClosePickUsersModal = () => {
    setSelectedUsers([])
    closePickUsersModal()
  }

  const handlePickUsersList = () => {
    if (selectedUsers.length === 0) {
      setError("Please select at least one user for the group")
      return
    }
    setError(null)
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
    if (groupName.trim() === "") {
      setError("Please enter a group name")
      return
    }
    setError(null)
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
        return response.url || response.messageImageHref
      } catch (error) {
        console.error("Failed to upload group image:", error)
        setError("Failed to upload group image")
      }
    }
    return undefined
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
    setError(null)
  }

  const handleCreateGroup = async () => {
    if (groupName.trim() === "") {
      setError("Please enter a group name")
      return
    }
    if (!myAccount) {
      setError("You must be logged in to create a group")
      return
    }
    if (selectedUsers.length === 0) {
      setError("Please select at least one user for the group")
      return
    }

    try {
      setIsGroupImageSending(true)
      setCreateGroupButtonDisabled(true)
      setError(null)

      // Upload group image if selected - currently not used in API but store for future
      await handleSendImage(selectedImage)

      // Create simplified creator object
      const createdBy: SimplifiedAccountType = {
        name: myAccount.name,
        username: myAccount.username,
        imageUrl: myAccount.imageUrl
      }

      // Include the current user in the members list
      const allMembers = [...selectedUsers]
      if (!allMembers.find((member) => member.username === myAccount.username)) {
        allMembers.push(createdBy)
      }

      // Create the group via API with the correct parameters
      const resultAction = await dispatch(
        createGroupConversationAsync({
          groupName,
          members: allMembers,
          createdBy
        })
      )

      if (createGroupConversationAsync.fulfilled.match(resultAction)) {
        const roomId = resultAction.payload.roomId
        closePickUsersModal()
        handleCloseChooseGroupInfo()
        handleResetForm()
        navigate(roomId)
      } else if (resultAction.error) {
        throw new Error(resultAction.error.message || "Failed to create group")
      }
    } catch (error) {
      console.error("Error creating group:", error)
      setError(error instanceof Error ? error.message : "Failed to create group")
    } finally {
      setIsGroupImageSending(false)
      setCreateGroupButtonDisabled(false)
    }
  }

  useEffect(() => {
    if (users.length > 0) {
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
        error={error}
        selectedUsersCount={selectedUsers.length}
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
        error={error}
      />
    </>
  )
}
