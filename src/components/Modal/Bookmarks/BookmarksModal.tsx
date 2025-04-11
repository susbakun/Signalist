import { getCurrentUsername } from "@/utils"
import { Modal } from "flowbite-react"
import { useEffect, useState } from "react"
import { NavLink, Outlet, useLocation, useNavigate, useParams } from "react-router-dom"

export const BookmarksModal = () => {
  const [openModal, setOpenModal] = useState(true)

  const { username: profileUsername } = useParams()
  const currentUsername = getCurrentUsername()
  const navigate = useNavigate()
  const location = useLocation()

  const handleCloseModal = () => {
    setOpenModal(false)
    navigate(`/${profileUsername}`)
  }

  useEffect(() => {
    // Only allow users to access their own bookmarks
    if (profileUsername !== currentUsername) {
      navigate("/", { replace: true })
    } else if (!location.pathname.includes("signals") && !location.pathname.includes("posts")) {
      // Only navigate to posts if we're not already on a specific tab
      navigate("posts")
    }
  }, [profileUsername, currentUsername, navigate])

  return (
    <Modal size="4xl" show={openModal} onClose={handleCloseModal}>
      <Modal.Header className="border-none pr-1 py-2" />
      <Modal.Body
        className="flex overflow-y-auto
        flex-col gap-2 py-4 mb-4 px-4 custom-modal"
      >
        <div
          className="border-b border-b-gray-600/20 dark:border-b-white/20
        flex justify-between px-12 md:px-20"
        >
          <NavLink className="explore-nav-link" to="posts">
            Posts
          </NavLink>
          <NavLink className="explore-nav-link" to="signals">
            Signals
          </NavLink>
        </div>
        <Outlet />
      </Modal.Body>
    </Modal>
  )
}
