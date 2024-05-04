import { ExploreTopBar } from '@/components/ExploreTopBar'
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
    <div className="flex-1 border-r-gray-600/20 dark:border-r-white/20 border-r pt-8">
      <ExploreTopBar />
      <Outlet />
    </div>
  )
}

export const RightSideBar = () => {
  return <aside className="w-[400px] h-screen flex flex-col"></aside>
}
