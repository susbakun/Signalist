import { AppContent, AppSideBar, RootLayout } from "@/components"
import { useEffect } from "react"
import { toggleThemeMode } from "./utils"

function App() {
  useEffect(() => {
    const themeMode = localStorage.getItem("themeMode") || "Os Default"
    toggleThemeMode(themeMode)
  }, [])
  return (
    <RootLayout className="flex">
      <AppSideBar />
      <AppContent />
    </RootLayout>
  )
}

export default App
