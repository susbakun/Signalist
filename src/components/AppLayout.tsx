import { AccountPreview, Header, Navbar } from '@/components'
import {
  ExplorePage,
  FollowingsPosts,
  HomePage,
  PremiumPage,
  SignalsPage,
  SuggestionsPosts
} from '@/pages'
import { ComponentProps } from 'react'
import { Route, Routes } from 'react-router-dom'

export const RootLayout = ({ children, ...props }: ComponentProps<'main'>) => {
  return <main {...props}>{children}</main>
}

export const AppSideBar = () => {
  return (
    <aside className="main-sidebar sticky top-0">
      <Header />
      <AccountPreview />
      <Navbar />
    </aside>
  )
}

export const AppContent = () => {
  return (
    <div className="flex-1 border-l border-l-gray-600/20 dark:border-l-white/20">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />}>
          <Route path="followings" element={<FollowingsPosts />} />
          <Route path="suggests" element={<SuggestionsPosts />} />
        </Route>
        <Route path="/signals" element={<SignalsPage />} />
        <Route path="/premium" element={<PremiumPage />} />
      </Routes>
    </div>
  )
}
