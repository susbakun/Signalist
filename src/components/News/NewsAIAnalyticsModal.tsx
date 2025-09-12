import { isDarkMode } from "@/utils"
import { Modal } from "flowbite-react"
import { useEffect, useState } from "react"
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"

type NewsAIAnalyticsModalProps = {
  openModal: boolean
  handleCloseModal: () => void
}

export const NewsAIAnalyticsModal = ({
  openModal,
  handleCloseModal
}: NewsAIAnalyticsModalProps) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 5000)
  }, [openModal])

  if (isLoading) {
    return (
      <NewsAIAnalyticsModalSkeleton openModal={openModal} handleCloseModal={handleCloseModal} />
    )
  }

  return (
    <Modal
      size="xl"
      show={openModal}
      onClose={handleCloseModal}
      className="text-right flex flex-col gap-1"
    >
      <Modal.Header className="border-none pr-1 py-2 mobile:py-1 w-full" />
      <Modal.Body
        className="flex overflow-y-auto
        flex-col gap-4 py-0 mb-6 px-3 mobile:px-1"
      >
        <div className="flex gap-2 text-2xl items-baseline justify-end">
          <h1 className="font-bold -translate-y-1">تحلیل هوش مصنوعی</h1>
          <RobotIcon />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-dark-link-button">:خلاصه</h2>
          <p className="text-sm text-white/80">.سوالانا موفقیت خود را در بازار تقویت کرده است</p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-dark-link-button">:تاثیر بر بازار</h2>
          <p className="text-sm text-white/80">
            .این عملکرد مثبت می‌تواند منجر به افزایش سرمایه‌گذاری در پروژه‌های مبتنی بر سولانا شود
          </p>
        </div>
        <div className="flex gap-2 items-center justify-end">
          <span className="bg-green-950 text-green-500 px-2 py-0 rounded-xl">مثبت</span>
          <h2 className="text-lg font-bold text-white">:احساسات بازار</h2>
        </div>
      </Modal.Body>
    </Modal>
  )
}

const RobotIcon = () => {
  return (
    <span>
      <svg
        width="32px"
        height="32px"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke="#ffffff"
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M9 15C8.44771 15 8 15.4477 8 16C8 16.5523 8.44771 17 9 17C9.55229
            17 10 16.5523 10 16C10 15.4477 9.55229 15 9 15Z"
            fill="#ffffff"
          ></path>{" "}
          <path
            d="M14 16C14 15.4477 14.4477 15 15 15C15.5523 15 16 15.4477 16 16C16 16.5523
            15.5523 17 15 17C14.4477 17 14 16.5523 14 16Z"
            fill="#ffffff"
          ></path>{" "}
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12 1C10.8954 1 10 1.89543 10 3C10 3.74028 10.4022 4.38663 11
            4.73244V7H6C4.34315 7 3 8.34315 3 10V20C3 21.6569 4.34315 23 6 23H18C19.6569
            23 21 21.6569 21 20V10C21 8.34315 19.6569 7 18 7H13V4.73244C13.5978 4.38663
            14 3.74028 14 3C14 1.89543 13.1046 1 12 1ZM5 10C5 9.44772 5.44772 9 6 9H7.38197L8.82918
            11.8944C9.16796 12.572 9.86049 13 10.618 13H13.382C14.1395 13 14.832 12.572 15.1708
            11.8944L16.618 9H18C18.5523 9 19 9.44772 19 10V20C19 20.5523 18.5523 21 18 21H6C5.44772
            21 5 20.5523 5 20V10ZM13.382 11L14.382 9H9.61803L10.618 11H13.382Z"
            fill="#ffffff"
          ></path>{" "}
          <path
            d="M1 14C0.447715 14 0 14.4477 0 15V17C0 17.5523 0.447715 18
            1 18C1.55228 18 2 17.5523 2 17V15C2 14.4477 1.55228 14 1 14Z"
            fill="#ffffff"
          ></path>{" "}
          <path
            d="M22 15C22 14.4477 22.4477 14 23 14C23.5523 14 24 14.4477
            24 15V17C24 17.5523 23.5523 18 23 18C22.4477 18 22 17.5523 22 17V15Z"
            fill="#ffffff"
          ></path>{" "}
        </g>
      </svg>
    </span>
  )
}

const NewsAIAnalyticsModalSkeleton = ({
  openModal,
  handleCloseModal
}: NewsAIAnalyticsModalProps) => {
  return (
    <SkeletonTheme
      baseColor={isDarkMode() ? "rgb(31 41 55)" : "rgb(255 255 255)"}
      highlightColor={isDarkMode() ? "#66666c" : "#ececec"}
    >
      <Modal
        size="xl"
        show={openModal}
        onClose={handleCloseModal}
        className="text-right flex flex-col gap-1"
      >
        <Modal.Header className="border-none pr-1 py-2 mobile:py-1 w-full" />
        <Modal.Body
          className="flex overflow-y-auto
      flex-col gap-4 py-0 mb-6 px-3 mobile:px-1"
        >
          <div className="flex gap-2 text-2xl items-baseline justify-end">
            <h1 className="font-bold -translate-y-1">تحلیل هوش مصنوعی</h1>
            <RobotIcon />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-bold text-dark-link-button">:خلاصه</h2>

            <p>
              <Skeleton className="mb-4" height={20} borderRadius={6} count={1} />
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-bold text-dark-link-button">:تاثیر بر بازار</h2>

            <p>
              <Skeleton className="mb-4" height={20} borderRadius={6} count={1} />
            </p>
          </div>
          <div className="flex gap-4 items-center justify-end">
            <p className="flex items-center translate-y-2">
              <Skeleton className="mb-4" height={20} borderRadius={6} count={1} width={40} />
            </p>

            <h2 className="text-lg font-bold text-white">:احساسات بازار</h2>
          </div>
        </Modal.Body>
      </Modal>
    </SkeletonTheme>
  )
}
