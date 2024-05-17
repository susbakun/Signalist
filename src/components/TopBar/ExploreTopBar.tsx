import { useAppSelector } from '@/features/Post/postsSlice'
import { EmptyPage } from '@/pages'
import { cn } from '@/utils'
import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { IoSearchOutline } from 'react-icons/io5'
import { NavLink } from 'react-router-dom'
import { UserPreview } from '../Shared/UserPreview'

export const ExploreTopBar = () => {
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [searched, setSearched] = useState('')

  const users = useAppSelector((state) => state.users)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearched(e.target.value)
  }
  const handleInputFocus = () => {
    setIsInputFocused((prev) => !prev)
  }

  const handleSearchUsers = useCallback(() => {
    return users.filter((user) => user.username.toLowerCase().includes(searched.toLowerCase()))
  }, [users, searched])

  const searchedUsers = useMemo(() => handleSearchUsers(), [handleSearchUsers])
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
            value={searched}
            onBlur={handleInputFocus}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className="custom-input inline-block
            focus:w-[80%] focus:pl-8"
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
            dark:bg-dark-main min-h-[75px]"
            >
              {searchedUsers.map((user, index) => (
                <UserPreview
                  className={cn('border-b border-b-gray-600/20 pb-4 dark:border-b-white/20', {
                    'border-none pb-0': index === searchedUsers.length - 1
                  })}
                  {...user}
                  key={user.username}
                />
              ))}
            </div>
          ) : (
            <EmptyPage
              className="w-[78%] transition-all
              rounded-xl flex border dark:border-white/30
              h-[150px] items-center justify-center bg-primary-main
              border-gray-600/50 absolute top-12 left-[11%] right-[11%] 
              dark:bg-dark-main"
            >
              <p>Search for People</p>
            </EmptyPage>
          ))}
      </div>
      <div
        className="border-b border-b-gray-600/20 dark:border-b-white/20
        flex justify-between px-20"
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
