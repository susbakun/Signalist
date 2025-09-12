import { Loader, UserPreview, ToastContainer } from "@/components"
import { useAppSelector } from "@/features/User/usersSlice"
import { unblockUserAsync } from "@/features/User/usersSlice"
import { EmptyPage } from "@/pages"
import { AccountModel } from "@/shared/models"
import { cn } from "@/utils"
import { Modal } from "flowbite-react"
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useToastContainer } from "@/hooks/useToastContainer"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/app/store"

export const UserBlockedAccountsModal = () => {
  const [openModal, setOpenModal] = useState(true)
  const [searched, setSearched] = useState("")
  const [me, setMe] = useState<AccountModel | undefined>(undefined)
  const { handleShowToast, showToast, toastContent, toastType } = useToastContainer()

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const { username } = useParams()
  const { users, loading } = useAppSelector((store) => store.users)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearched(e.target.value)
  }

  const handleUnblockUser = async (blockedUsername: string) => {
    try {
      if (!me) return

      await dispatch(
        unblockUserAsync({
          blockerUsername: me.username,
          blockedUsername
        })
      ).unwrap()

      handleShowToast(`User @${blockedUsername} has been unblocked`, "success")

      // Update local state to reflect the change immediately
      setMe((prevMe) => {
        if (!prevMe) return undefined
        return {
          ...prevMe,
          blockedAccounts: prevMe.blockedUsers.filter(
            (account) => account.username !== blockedUsername
          )
        }
      })
    } catch (error) {
      handleShowToast("Failed to unblock user", "error")
      console.error("Error unblocking user:", error)
    }
  }

  const handleSearchUsers = useCallback(() => {
    return me?.blockedUsers.filter(
      (user) =>
        user.username.toLowerCase().includes(searched.toLowerCase()) ||
        user.name.toLocaleLowerCase().includes(searched)
    )
  }, [me, searched])

  const handleCloseModal = () => {
    setOpenModal(false)
    navigate(`/${me?.username}`)
  }

  const searchedUsers = useMemo(() => handleSearchUsers(), [handleSearchUsers])

  useEffect(() => {
    if (users) {
      setMe(users.find((user) => user.username === username))
    }
  }, [users, username])

  if (me && searchedUsers)
    return (
      <>
        <Modal size="md" show={openModal} onClose={handleCloseModal}>
          <Modal.Header className="border-none pr-1 py-2">Blocked Users</Modal.Header>
          <Modal.Body
            className="flex overflow-y-auto
            flex-col gap-2 py-2 mb-4 px-4 custom-modal min-h-[400px]"
          >
            {loading ? (
              <Loader className="h-[80vh]" />
            ) : (
              <>
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
                      <div
                        key={user.username}
                        className={cn(
                          "flex items-center justify-between border-b pt-2 border-b-gray-600/20 pb-4 dark:border-b-white/20",
                          {
                            "border-none pb-0": index === searchedUsers.length - 1
                          }
                        )}
                      >
                        <UserPreview {...user} className="border-none pb-0" />
                        <button
                          onClick={() => handleUnblockUser(user.username)}
                          className={cn(
                            "action-button dark:text-dark-link-button text-primary-link-button"
                          )}
                        >
                          Unblock
                        </button>
                      </div>
                    ))
                  ) : (
                    <EmptyPage className="h-[80%] w-full flex items-center justify-center">
                      <p className="font-normal">No blocked users found</p>
                    </EmptyPage>
                  )}
                </div>
              </>
            )}
          </Modal.Body>
        </Modal>
        <ToastContainer toastType={toastType} showToast={showToast} toastContent={toastContent} />
      </>
    )

  return null
}
