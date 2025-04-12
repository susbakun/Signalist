import { Loader } from "@/components/Shared/Loader"
import { UserPreview } from "@/components/Shared/UserPreview"
import { AppDispatch } from "@/app/store"
import { createDMConversationAsync, useAppSelector } from "@/features/Message/messagesSlice"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useIsUserBlocked } from "@/hooks/useIsUserBlocked"
import { useUserMessageRoom } from "@/hooks/useUserMessageRoom"
import { EmptyPage } from "@/pages"
import { AccountModel, MessageModel } from "@/shared/models"
import { SimplifiedAccountType } from "@/shared/types"
import { cn, getCurrentUsername } from "@/utils"
import { Modal } from "flowbite-react"
import { ChangeEvent, useCallback, useMemo, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

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
  const [isCreatingConversation, setIsCreatingConversation] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { users, loading: usersLoading } = useAppSelector((state) => state.users)
  const currentUsername = getCurrentUsername()
  const { currentUser: myAccount } = useCurrentUser()
  const exceptMeUsers = users.filter((user) => user.username !== currentUsername)

  const dispatch = useDispatch<AppDispatch>()
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

  const handleCreateMessage = async (user: AccountModel) => {
    if (!myAccount) return

    try {
      setIsCreatingConversation(true)
      setError(null)

      // Check if a conversation already exists with this user
      if (myMessages && typeof myMessages === "object" && checkIfExistsRoom(myMessages, user)) {
        const roomId = findExistingRoomId(myMessages, user)
        handleCloseModal()
        navigate(roomId!)
        return
      }

      // Create simplified user objects for API call
      const user1: SimplifiedAccountType = {
        name: myAccount.name,
        username: myAccount.username,
        imageUrl: myAccount.imageUrl
      }

      const user2: SimplifiedAccountType = {
        name: user.name,
        username: user.username,
        imageUrl: user.imageUrl
      }

      // Call the API to create a new conversation
      const resultAction = await dispatch(createDMConversationAsync({ user1, user2 }))

      if (createDMConversationAsync.fulfilled.match(resultAction)) {
        const roomId = resultAction.payload.roomId
        handleCloseModal()
        navigate(roomId)
      } else if (resultAction.error) {
        throw new Error(resultAction.error.message || "Failed to create conversation")
      }
    } catch (error) {
      console.error("Error creating conversation:", error)
      setError(error instanceof Error ? error.message : "Failed to create conversation")
    } finally {
      setIsCreatingConversation(false)
    }
  }

  return (
    <Modal size="md" show={openModal} onClose={handleCloseModal}>
      <Modal.Header className="border-none pr-1 py-2">
        <h3 className="text-lg font-semibold">New Message</h3>
      </Modal.Header>
      <Modal.Body
        className="flex overflow-y-auto
        flex-col gap-2 py-2 mb-4 px-4 custom-modal min-h-[400px]"
      >
        {usersLoading || isCreatingConversation ? (
          <Loader className="h-screen" />
        ) : (
          <>
            {error && (
              <div className="text-red-500 text-sm bg-red-100 dark:bg-red-900/20 p-2 rounded mb-2">
                {error}
              </div>
            )}
            <div
              className="flex items-center relative
          justify-center"
            >
              <input
                value={searched}
                onChange={handleInputChange}
                className="custom-input w-full pl-4 inline-block"
                placeholder="Search for a user..."
              />
            </div>
            <div className="flex flex-col mt-4">
              {searchedUsers.length > 0 ? (
                searchedUsers.map((user, index) => (
                  <UserPreview
                    className={cn(
                      "border-b pt-2 border-b-gray-600/20 pb-4 dark:border-b-white/20",
                      {
                        "border-none pb-0": index === searchedUsers.length - 1
                      }
                    )}
                    {...user}
                    isForMessageRoom
                    handleCreateMessage={() => handleCreateMessage(user)}
                    key={user.username}
                  />
                ))
              ) : (
                <EmptyPage className="h-[80%] w-full flex items-center justify-center">
                  <p className="font-normal">No users found</p>
                </EmptyPage>
              )}
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  )
}
