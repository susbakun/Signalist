import { useState } from "react"

export const useToastContainer = () => {
  const [showToast, setShowToast] = useState(false)
  const [toastContent, setToastBody] = useState("")
  const [toastType, setToastType] = useState("")

  const handleShowToast = (content: string, type: string) => {
    setToastBody(content)
    setShowToast(true)
    setToastType(type)
    handleRemoveToast()
  }

  const handleRemoveToast = () => {
    setTimeout(() => {
      setShowToast(false)
    }, 4000)
  }
  return {
    showToast,
    toastContent,
    toastType,
    handleShowToast
  }
}
