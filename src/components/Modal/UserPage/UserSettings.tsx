import { isDarkMode, toggleDarkMode } from "@/utils"
import { Modal } from "flowbite-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Toggle from "react-toggle"

export const UserSettings = () => {
  const [openModal, setOpenModal] = useState(true)

  const { username: myUsername } = useParams()
  const navigate = useNavigate()

  const handleCloseModal = () => {
    setOpenModal(false)
    navigate(`/${myUsername}`)
  }

  useEffect(() => {
    if (myUsername !== "Amir_Aryan") {
      navigate("/", { replace: true })
    }
  }, [])

  return (
    <Modal show={openModal} onClose={handleCloseModal} size="lg">
      <Modal.Header className="text-center">
        <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">Settings</span>
      </Modal.Header>
      <Modal.Body>
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-900 dark:text-gray-100">Dark Mode</span>
          <Toggle onChange={toggleDarkMode} defaultChecked={isDarkMode()} icons={false} />
        </div>
      </Modal.Body>
    </Modal>
  )
}
