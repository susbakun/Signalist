import { Toast } from "flowbite-react"
import { MdInfoOutline, MdOutlineBlock, MdReportGmailerrorred } from "react-icons/md"
import { RiUserFollowLine, RiUserUnfollowLine } from "react-icons/ri"

type ToastContainerProps = {
  showToast: boolean
  toastContent: string
  toastType: string
}

export const ToastContainer = ({ showToast, toastContent, toastType }: ToastContainerProps) => {
  const getToastIcon = (type: string) => {
    switch (type) {
      case "follow":
        return (
          <div
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
          bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200"
          >
            <RiUserFollowLine className="w-6 h-6" />
          </div>
        )
      case "unfollow":
        return (
          <div
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
          bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200"
          >
            <RiUserUnfollowLine className="w-6 h-6" />
          </div>
        )
      case "report":
        return (
          <div
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
          bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200"
          >
            <MdReportGmailerrorred className="w-6 h-6" />
          </div>
        )
      case "block":
        return (
          <div
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
          bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200"
          >
            <MdOutlineBlock className="w-6 h-6" />
          </div>
        )
      default:
        return (
          <div
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
          bg-cyan-100 text-cyan-500 dark:bg-cyan-800 dark:text-cyan-200"
          >
            <MdInfoOutline className="w-6 h-6" />
          </div>
        )
    }
  }
  if (showToast) {
    return (
      <Toast className="fixed bottom-4 left-4">
        {getToastIcon(toastType)}
        <div className="ml-3 text-sm font-normal">{toastContent}</div>
        <Toast.Toggle />
      </Toast>
    )
  }
}
