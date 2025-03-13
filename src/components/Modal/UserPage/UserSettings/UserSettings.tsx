import { STORAGE_KEYS } from "@/shared/constants"
import { ThemeModeType } from "@/shared/types"
import { getCurrentUsername, toggleThemeMode } from "@/utils"
import { Modal } from "flowbite-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { SelectThemeModeDropDown } from "./SelectThemeModeDropDown"

export const UserSettings = () => {
  const [openModal, setOpenModal] = useState(true)
  const [themeMode, setThemeMode] = useState<ThemeModeType>(() => {
    return (localStorage.getItem(STORAGE_KEYS.THEME_MODE) || "Os Default") as ThemeModeType
  })

  const { username: profileUsername } = useParams()
  const currentUsername = getCurrentUsername()
  const navigate = useNavigate()

  const handleCloseModal = () => {
    setOpenModal(false)
    navigate(`/${profileUsername}`)
  }

  const handleSelectTheme = (selectedThemeMode: ThemeModeType) => {
    setThemeMode(selectedThemeMode)
  }

  useEffect(() => {
    // Only allow users to access their own settings
    if (profileUsername !== currentUsername) {
      navigate("/", { replace: true })
    }
  }, [profileUsername, currentUsername, navigate])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME_MODE, themeMode)
    toggleThemeMode(themeMode)
  }, [themeMode])

  return (
    <Modal show={openModal} onClose={handleCloseModal} size="lg">
      <Modal.Header className="text-center">
        <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">Settings</span>
      </Modal.Header>
      <Modal.Body>
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-900 dark:text-gray-100">Theme Mode</span>
          <SelectThemeModeDropDown
            label={themeMode}
            options={["Dark", "Light", "Os Default"]}
            onSelect={handleSelectTheme}
          />
        </div>
      </Modal.Body>
    </Modal>
  )
}
