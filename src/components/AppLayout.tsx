import {
  AccountPreview,
  BookmarkedPosts,
  BookmarkedSignals,
  BookmarksModal,
  Header,
  MessageRoom,
  Navbar,
  UserPosts,
  UserReplies,
  UserSettings,
  UserSignals
} from "@/components"
import {
  ExplorePage,
  FollowingsPosts,
  HomePage,
  MessagesPage,
  PremiumPage,
  SignalsPage,
  SuggestionsPosts,
  UserPage
} from "@/pages"
import { messagesRouteRegExp } from "@/shared/constants"
import { cn } from "@/utils"
import { ComponentProps } from "react"
import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import { UserFollowersModal } from "./Modal/UserPage/UserFollowersModal"
import { UserFollowingsModal } from "./Modal/UserPage/UserFollowingsModal"
import { UserPremiumModal } from "./Modal/UserPage/UserPremium/UserPremiumModal"

export const RootLayout = ({ children, ...props }: ComponentProps<"main">) => {
  return <main {...props}>{children}</main>
}

export const AppSideBar = () => {
  const location = useLocation()
  const isInMessages = messagesRouteRegExp.test(location.pathname)

  return (
    <aside
      className={cn("main-sidebar sticky top-0 w-[25%]", {
        "w-fit": isInMessages
      })}
    >
      {!isInMessages && (
        <>
          <Header />
          <AccountPreview />
        </>
      )}
      <Navbar />
    </aside>
  )
}

export const AppContent = () => {
  return (
    <div
      className="flex-1 border-l border-l-gray-600/20
    dark:border-l-white/20"
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />}>
          <Route path="followings" element={<FollowingsPosts />} />
          <Route path="suggests" element={<SuggestionsPosts />} />
        </Route>
        <Route path="/signals" element={<SignalsPage />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/:username" element={<UserPage />}>
          <Route path="posts" element={<UserPosts />} />
          <Route path="signals" element={<UserSignals />} />
          <Route path="replies" element={<UserReplies />} />
          <Route path="followings" element={<UserFollowingsModal />} />
          <Route path="followers" element={<UserFollowersModal />} />
          <Route path="premium" element={<UserPremiumModal />} />
          <Route path="bookmarks" element={<BookmarksModal />}>
            <Route path="posts" element={<BookmarkedPosts />} />
            <Route path="signals" element={<BookmarkedSignals />} />
          </Route>
          <Route path="settings" element={<UserSettings />}></Route>
        </Route>
        <Route path="/messages" element={<MessagesPage />}>
          <Route path=":id" element={<MessageRoom />} />
        </Route>
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </div>
  )
}
