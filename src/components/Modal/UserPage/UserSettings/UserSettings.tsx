import { ThemeModeType } from "@/shared/types"
import { toggleThemeMode } from "@/utils"
import { Modal } from "flowbite-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { SelectThemeModeDropDown } from "./SelectThemeModeDropDown"

export const UserSettings = () => {
  const [openModal, setOpenModal] = useState(true)
  const [themeMode, setThemeMode] = useState<ThemeModeType>("Os Default")

  const { username: myUsername } = useParams()
  const navigate = useNavigate()

  const handleCloseModal = () => {
    setOpenModal(false)
    navigate(`/${myUsername}`)
  }

  const handleSelectTheme = (selectedThemeMode: ThemeModeType) => {
    setThemeMode(selectedThemeMode)
  }

  useEffect(() => {
    if (myUsername !== "Amir_Aryan") {
      navigate("/", { replace: true })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("themeMode", themeMode)
    toggleThemeMode(themeMode)
  }, [themeMode])

  return (
    <Modal show={openModal} onClose={handleCloseModal} size="lg">
      <Modal.Header className="text-center">
        <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">Settings</span>
      </Modal.Header>
      <Modal.Body>
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-900 dark:text-gray-100">Dark Mode</span>
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
