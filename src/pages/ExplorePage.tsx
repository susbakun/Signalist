import { ExploreTopBar, UserPreview } from '@/components'
import { useAppSelector } from '@/features/User/usersSlice'
import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

export const ExplorePage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.pathname == '/explore') {
      navigate('followings')
    }
  }, [location, navigate])
  return (
    <div className="flex">
      <ExplorePosts />
      <RightSideBar />
    </div>
  )
}

export const ExplorePosts = () => {
  return (
    <div
      className="flex-1 border-r-gray-600/20 dark:border-r-white/20
      border-r pt-8"
    >
      <ExploreTopBar />
      <Outlet />
    </div>
  )
}

export const RightSideBar = () => {
  const users = useAppSelector((state) => state.users)
  const me = users.find((user) => user.username === 'Amir Aryan')
  let selectedUsers = [...users.filter((user) => user.username !== me?.username)]
  selectedUsers = selectedUsers.sort((a, b) => b.score - a.score).slice(0, 4)
  return (
    <aside className="w-[400px] h-screen flex flex-col pt-8 px-8 sticky top-0">
      <div
        className="border border-gray-600/20 dark:border-white/20
        rounded-xl gap-4 p-3 flex flex-col"
      >
        <h2 className="text-xl font-bold">Who to follow</h2>
        <div className="flex flex-col gap-4">
          {selectedUsers.map((user) => (
            <UserPreview follower={me!} key={user.username} {...user} />
          ))}
        </div>
      </div>
    </aside>
  )
}
