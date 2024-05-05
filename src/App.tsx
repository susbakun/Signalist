import { AppContent, AppSideBar, RootLayout } from '@/components'
import { BiMoon } from 'react-icons/bi'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark')
    document.body.classList.toggle('darkmode')
  }

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
