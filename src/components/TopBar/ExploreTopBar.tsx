import { Loader, UserPreview } from "@/components"
import { useAppSelector } from "@/features/User/usersSlice"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useIsUserBlocked } from "@/hooks/useIsUserBlocked"
import { EmptyPage } from "@/pages"
import { cn, isEmpty } from "@/utils"
import { ChangeEvent, useCallback, useMemo, useState } from "react"
import { IoSearchOutline } from "react-icons/io5"
import { NavLink } from "react-router-dom"

export const ExploreTopBar = () => {
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [searched, setSearched] = useState("")

  const { users, loading: usersLoading } = useAppSelector((state) => state.users)
  const { currentUser: myAccount } = useCurrentUser()
  const { isUserBlocked, areYouBlocked } = useIsUserBlocked(myAccount)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearched(e.target.value)
  }
  const handleInputFocus = () => {
    setIsInputFocused((prev) => !prev)
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!e.relatedTarget) {
      setIsInputFocused(false)
    }
  }

  // Prevent dropdown from closing when clicking inside it (needed for touch devices)
  const handleDropdownMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  const handleSearchUsers = useCallback(() => {
    if (!users) return []
    return users.filter(
      (user) =>
        (user.username.toLowerCase().includes(searched.toLowerCase()) ||
          user.name.toLowerCase().includes(searched.toLowerCase())) &&
        !isUserBlocked(user.username) &&
        !areYouBlocked(user)
    )
  }, [users, searched, isUserBlocked])

  const searchedUsers = useMemo(() => handleSearchUsers(), [handleSearchUsers])

  if (usersLoading) {
    return <Loader className="h-[200px]" />
  }

  if (!myAccount) return null

  return (
    <div
      className="flex flex-col gap-8 sticky top-0 pt-8
    dark:bg-dark-main z-50 bg-primary-main"
    >
      <div className="px-4 relative flex flex-col">
        <div
          className="flex items-center relative
          justify-center"
        >
          {isInputFocused && (
            <IoSearchOutline
              className="w-4 h-4
              absolute left-[10%] ml-4"
            />
          )}
          <input
            onBlur={handleInputBlur}
            value={searched}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className={cn("custom-input pl-4 inline-block w-full", {
              "w-[80%]": isInputFocused,
              "pl-8": isInputFocused
            })}
            placeholder="Search"
          />
        </div>
        {isInputFocused &&
          (searched ? (
            <div
              className="flex flex-col w-[78%] transition-all
              rounded-xl border dark:border-white/30
            bg-primary-main gap-4 px-4 py-3
            border-gray-600/50 absolute top-12
              left-[11%] right-[11%]
            dark:bg-dark-main min-h-[75px] max-h-[375px] overflow-y-auto explore-top-bar-dropdown"
              onMouseDown={handleDropdownMouseDown}
            >
              {isEmpty(searchedUsers) ? (
                <EmptyPage className="h-full items-center text-center pt-2">
                  <p className="font-normal">No results found</p>
                </EmptyPage>
              ) : (
                searchedUsers.map((user, index) => (
                  <UserPreview
                    className={cn("border-b border-b-gray-600/20 pb-4 dark:border-b-white/20", {
                      "border-none pb-0": index === searchedUsers.length - 1
                    })}
                    {...user}
                    key={user.username}
                    follower={myAccount}
                  />
                ))
              )}
            </div>
          ) : (
            <EmptyPage
              className="w-[78%] transition-all
              rounded-xl flex border dark:border-white/30
              h-[150px] items-center justify-center bg-primary-main
              border-gray-600/50 absolute top-12 left-[11%] right-[11%] 
              dark:bg-dark-main"
              onMouseDown={handleDropdownMouseDown}
            >
              <p className="font-normal">Search for People</p>
            </EmptyPage>
          ))}
      </div>
      <div
        className="border-b border-b-gray-600/20 dark:border-b-white/20
        flex justify-between px-[50px] sm:px-[60px] md:px-[80px]"
      >
        <NavLink className="explore-nav-link" to="followings">
          Followings
        </NavLink>
        <NavLink className="explore-nav-link" to="suggests">
          Suggests
        </NavLink>
      </div>
    </div>
  )
}
