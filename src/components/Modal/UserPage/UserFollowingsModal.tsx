import { useAppSelector } from "@/features/User/usersSlice"
import { EmptyPage } from "@/pages"
import { cn } from "@/utils"
import { Modal } from "flowbite-react"
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { UserPreview } from "../../Shared/UserPreview"
import { AccountModel } from "@/shared/models"
import { Loader } from "@/components/Shared/Loader"
import { useCurrentUser } from "@/hooks/useCurrentUser"
export const UserFollowingsModal = () => {
  const [openModal, setOpenModal] = useState(true)
  const [searched, setSearched] = useState("")
  const [user, setUser] = useState<AccountModel | undefined>(undefined)
  const { currentUser: myAccount } = useCurrentUser()

  const navigate = useNavigate()

  const { username } = useParams()
  const { users, loading } = useAppSelector((store) => store.users)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearched(e.target.value)
  }

  const handleSearchUsers = useCallback(() => {
    return user?.followings.filter(
      (user) =>
        user.username.toLowerCase().includes(searched.toLowerCase()) ||
        user.name.toLocaleLowerCase().includes(searched)
    )
  }, [user, searched])

  const handleCloseModal = () => {
    setOpenModal(false)
    navigate(`/${user?.username}`)
  }

  useEffect(() => {
    if (users) {
      setUser(users.find((user) => user.username === username))
    }
  }, [users, username])

  const searchedUsers = useMemo(() => handleSearchUsers(), [user, searched])

  if (user && searchedUsers && myAccount)
    return (
      <Modal size="md" show={openModal} onClose={handleCloseModal}>
        <Modal.Header className="border-none pr-1 py-2" />
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
                    <UserPreview
                      className={cn(
                        "border-b pt-2 border-b-gray-600/20 pb-4 dark:border-b-white/20",
                        {
                          "border-none pb-0": index === searchedUsers.length - 1
                        }
                      )}
                      {...user}
                      follower={myAccount}
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
      </Modal>
    )
}
