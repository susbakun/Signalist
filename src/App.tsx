import { AppContent, AppSideBar, RootLayout } from "@/components"
import { useEffect } from "react"
import { BiMoon } from "react-icons/bi"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function App() {
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark")
    document.body.classList.toggle("darkmode")
  }

  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      toggleDarkMode()
    }
  }, [])

  return (
    <RootLayout className="flex">
      <AppSideBar />
      <button className="bg-black fixed bottom-0 left-0" onClick={toggleDarkMode}>
        <BiMoon />
      </button>
      <AppContent />
      <ToastContainer />
    </RootLayout>
  )
}

export default App
