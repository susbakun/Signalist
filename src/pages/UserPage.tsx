import { MoreOptionsButtonContent } from '@/components'
import { Haminjori } from '@/components/Haminjori'
import { useAppSelector } from '@/features/Post/postsSlice'
import { cn, getAvatarPlaceholder, isDarkMode } from '@/utils'
import Tippy from '@tippyjs/react'
import { Avatar, Popover } from 'flowbite-react'
import millify from 'millify'
import { useEffect, useState } from 'react'
import { FaRegBell, FaUserAlt } from 'react-icons/fa'
import { HiIdentification } from 'react-icons/hi2'
import { IoIosAddCircle } from 'react-icons/io'
import { IoBookmarkOutline, IoMail, IoPersonAddOutline, IoSettingsOutline } from 'react-icons/io5'
import { TbPremiumRights } from 'react-icons/tb'
import { TfiMore } from 'react-icons/tfi'
import { Link, NavLink, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import Toggle from 'react-toggle'
import { roundArrow } from 'tippy.js'
import 'tippy.js/dist/svg-arrow.css'

export const UserPage = () => {
  const [open, setIsOpen] = useState(false)
  const [activeLink, setActiveLink] = useState('posts')

  const navigate = useNavigate()
  const location = useLocation()

  const { username: myUsername } = useParams()
  const me = useAppSelector((state) => state.users).find((user) => user.username === myUsername)
  const myAccount = useAppSelector((state) => state.users).find(
    (user) => user.username === 'Amir_Aryan'
  )
  const isItmyAccount = me?.username === 'Amir_Aryan'

  const handleShareEmail = () => {
    const shareUrl = `mailto:${me?.email}`
    window.open(shareUrl)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleChangeActiveLink = (pathName: string) => {
    setActiveLink(pathName)
  }

  useEffect(() => {
    if (location.pathname === `/${me?.username}`) {
      navigate(activeLink, { replace: false })
    }
  }, [location, navigate])

  if (me) {
    const placeholder = getAvatarPlaceholder(me.name)
    return (
      <>
        <div className="flex flex-col px-[200px] pt-12 gap-8">
          <div
            className={cn('flex items-center gap-36 relative', { 'gap-20 pt-2': !isItmyAccount })}
          >
            <Avatar
              bordered
              placeholderInitials={placeholder}
              size="xl"
              img={me.imageUrl}
              rounded
            />
            {isItmyAccount && (
              <Tippy
                content="stream"
                className="dark:bg-gray-700 bg-gray-900 text-white font-sans
                rounded-md px-1 py-[1px] text-sm"
                delay={[1000, 0]}
                placement="bottom"
                animation="fade"
                arrow={roundArrow}
                duration={10}
                hideOnClick={true}
              >
                <button className="absolute top-[115px] left-2">
                  <IoIosAddCircle className="w-8 h-8" />
                </button>
              </Tippy>
            )}
            {isItmyAccount ? (
              <Popover
                trigger="click"
                aria-labelledby="more-options"
                content={
                  <div className="flex flex-col text-md font-bold justify-center text-center">
                    <button className="option-button px-2 py-2">
                      <IoSettingsOutline />
                      settings
                    </button>
                    <button className="option-button px-2 py-2">
                      <IoBookmarkOutline />
                      bookmarks
                    </button>
                  </div>
                }
                open={open}
                onOpenChange={setIsOpen}
              >
                <button
                  onClick={handleOpen}
                  className="action-button
                  absolute top-2 right-0"
                >
                  <TfiMore className="w-6 h-6" />
                </button>
              </Popover>
            ) : (
              <div className="flex gap-10 absolute top-0 right-0">
                {me.subscribed && (
                  <Tippy
                    content="you're subscribed"
                    className="dark:bg-gray-700 bg-gray-900 text-white font-sans
                rounded-md px-1 py-[1px] text-sm"
                    delay={[1000, 0]}
                    placement="bottom"
                    animation="fade"
                    arrow={roundArrow}
                    duration={10}
                    hideOnClick={true}
                  >
                    <div>
                      <TbPremiumRights className="w-6 h-6 text-yellow-400" />
                    </div>
                  </Tippy>
                )}
                <Popover
                  aria-labelledby="notifications"
                  content={
                    <div className="flex flex-col gap-2 px-2 py-3 items-center">
                      <label className={cn('flex items-center gap-2', { dark: isDarkMode() })}>
                        <span className="w-8 mr-5">signals</span>
                        <Toggle defaultChecked={false} icons={false} />
                      </label>
                      <label className={cn('flex items-center gap-2', { dark: isDarkMode() })}>
                        <span className="w-8 mr-5">streams</span>
                        <Toggle defaultChecked={false} icons={false} />
                      </label>
                      <label className={cn('flex items-center gap-2', { dark: isDarkMode() })}>
                        <span className="w-8 mr-5">posts</span>
                        <Toggle defaultChecked={false} icons={false} />
                      </label>
                    </div>
                  }
                >
                  <button className="bg-transparent action-button">
                    <FaRegBell className="w-6 h-6" />
                  </button>
                </Popover>
                <Popover
                  trigger="click"
                  aria-labelledby="more-options"
                  content={
                    <MoreOptionsButtonContent
                      follower={myAccount!}
                      isForUserPage={true}
                      closePopover={handleClose}
                      username={me.username}
                    />
                  }
                  open={open}
                  onOpenChange={setIsOpen}
                >
                  <button onClick={handleOpen} className="action-button">
                    <TfiMore className="w-6 h-6" />
                  </button>
                </Popover>
              </div>
            )}
            <div
              className="text-lg text-gray-500 dark:text-gray-400
          flex gap-14 items-center"
            >
              <div className="flex flex-col items-center">
                <span className="text-slate-700 dark:text-white">{me.score}</span>
                <span className="text-gray-600/70 dark:text-white/70">score</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-slate-700 dark:text-white">
                  {millify(me.followers.length)}
                </span>{' '}
                <Link
                  className="hover:text-primary-link-button transition
                  ease-out hover:dark:text-dark-link-button
                text-gray-600/70 dark:text-white/70"
                  to={`/${me.username}/followers`}
                >
                  followers
                </Link>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-slate-700 dark:text-white">
                  {millify(me.followings.length)}
                </span>{' '}
                <Link
                  className="hover:text-primary-link-button transition
                  ease-out hover:dark:text-dark-link-button
                text-gray-600/70 dark:text-white/70"
                  to={`/${me.username}/followings`}
                >
                  following
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 font-sans">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <HiIdentification />:
              </span>
              {me.name}
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <FaUserAlt />:
              </span>
              @{me.username}
            </div>
            <div className="flex items-center gap-1">
              <IoMail />:
              <button
                className="text-primary-link-button action-button
              dark:text-dark-link-button ml-1"
                onClick={handleShareEmail}
              >
                {me.email}
              </button>
            </div>
            {me.bio && (
              <div>
                <p>{me.bio}</p>
              </div>
            )}
          </div>
          {isItmyAccount ? (
            <div className="flex items-center justify-between">
              <div className="flex gap-5">
                <div>
                  <button
                    className="px-2 py-1 bg-primary-link-button
                dark:bg-dark-link-button rounded-md action-button
                text-black/90 dark:text-white"
                  >
                    Edit Profile
                  </button>
                </div>
                <div>
                  <button
                    className="px-2 py-1 bg-gradient-to-r
                  dark:from-dark-link-button from-primary-link-button to-[#ff00e5]
                  dark:to-[#ff00e5] rounded-md action-button
                text-white"
                  >
                    Manage Premium
                  </button>
                </div>
              </div>
              <div>
                <Tippy
                  content="invite someone"
                  className="dark:bg-gray-700 bg-gray-900 text-white font-sans
                rounded-md px-1 py-[1px] text-sm"
                  delay={[1000, 0]}
                  placement="top"
                  animation="fade"
                  arrow={roundArrow}
                  duration={10}
                  hideOnClick={true}
                >
                  <button
                    className="px-2 py-1 bg-primary-link-button
                dark:bg-dark-link-button rounded-md action-button
                text-black/90 dark:text-white"
                  >
                    <IoPersonAddOutline className="w-5 h-5" />
                  </button>
                </Tippy>
              </div>
            </div>
          ) : (
            <Haminjori
              follower={myAccount}
              subscribed={me.subscribed}
              followingUsername={me.username}
              hasPremium={me.hasPremium}
            />
          )}

          <div
            className="border-y border-x border-y-gray-600/20
          dark:border-y-white/20 flex justify-between
            px-10 items-center pt-[6px] border-x-gray-600/20
            dark:border-x-white/20"
          >
            <NavLink
              onClick={() => handleChangeActiveLink('posts')}
              className="explore-nav-link"
              to="posts"
            >
              Posts
            </NavLink>
            <NavLink
              onClick={() => handleChangeActiveLink('signals')}
              className="explore-nav-link"
              to="signals"
            >
              Signals
            </NavLink>
            <NavLink
              onClick={() => handleChangeActiveLink('replies')}
              className="explore-nav-link"
              to="replies"
            >
              Replies
            </NavLink>
          </div>
        </div>
        <Outlet />
      </>
    )
  }
}
