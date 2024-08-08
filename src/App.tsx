import { AppContent, AppSideBar, RootLayout } from "@/components"
import { toggleThemeMode } from "@/utils"
import { useEffect } from "react"

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
