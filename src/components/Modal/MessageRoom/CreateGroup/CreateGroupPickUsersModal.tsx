import { Loader } from "@/components/Shared/Loader"
import { UserPreview } from "@/components/Shared/UserPreview"
import { EmptyPage } from "@/pages"
import { AccountModel } from "@/shared/models"
import { SimplifiedAccountType } from "@/shared/types"
import { cn } from "@/utils"
import { Modal } from "flowbite-react"
import { ChangeEvent, useMemo } from "react"

type CreateGroupPickUsersModalProps = {
  openModal: boolean
  searched: string
  handleCloseModal: () => void
  handleSearchUsers: () => AccountModel[]
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleCheckboxChange: (selectedUser: SimplifiedAccountType) => void
  handlePickUsersList: () => void
  isUserSelected: (username: SimplifiedAccountType["username"]) => boolean
  usersLoading: boolean
  error: string | null
  selectedUsersCount: number
}

export const CreateGroupPickUsersModal = ({
  openModal,
  searched,
  handleCloseModal,
  handleSearchUsers,
  handleInputChange,
  handleCheckboxChange,
  handlePickUsersList,
  isUserSelected,
  usersLoading,
  error,
  selectedUsersCount
}: CreateGroupPickUsersModalProps) => {
  const searchedUsers = useMemo(() => handleSearchUsers(), [handleSearchUsers])

  return (
    <Modal size="md" show={openModal} onClose={handleCloseModal}>
      <Modal.Header className="border-none pr-1 py-2">
        <h3 className="text-lg font-semibold">Create Group Chat</h3>
      </Modal.Header>
      <Modal.Body
        className="flex overflow-y-auto
        flex-col gap-2 py-2 mb-4 px-4 custom-modal min-h-[400px]"
      >
        {usersLoading ? (
          <Loader className="h-[80%]" />
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
                placeholder="Search for users to add"
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
                    selected={isUserSelected(user.username)}
                    isForMessageGroup
                    handleCheckboxChange={() => handleCheckboxChange(user)}
                    key={user.username}
                  />
                ))
              ) : (
                <EmptyPage className="h-[80%] w-full flex items-center justify-center">
                  <p className="font-normal">No results found</p>
                </EmptyPage>
              )}
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer className="py-3 px-2">
        <div className="flex items-center justify-between w-full">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {selectedUsersCount > 0 ? `${selectedUsersCount} users selected` : "No users selected"}
          </span>
          <button
            onClick={handlePickUsersList}
            className="action-button dark:bg-dark-link-button
          bg-primary-link-button rounded-md px-2 py-1"
          >
            Next
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}
