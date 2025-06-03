import { useEffect, useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { FiCalendar } from "react-icons/fi"
import { IoAddOutline } from "react-icons/io5"
import { MdOutlineKeyboardArrowDown } from "react-icons/md"
import "./date-picker.css"

type SignalModalDatePickersProps = {
  openTime: Date
  closeTime: Date
  handleOpenTimeChange: (date: Date) => void
  handleCloseTimeChange: (date: Date) => void
  handleAddTarget: () => void
}

export const SignalModalDatePickers = ({
  openTime,
  closeTime,
  handleCloseTimeChange,
  handleOpenTimeChange,
  handleAddTarget
}: SignalModalDatePickersProps) => {
  const [touched, setTouched] = useState({ open: false, close: false })
  const [errors, setErrors] = useState({
    open: "",
    close: ""
  })

  const validateDates = (open: Date, close: Date) => {
    const now = new Date()
    const newErrors = { open: "", close: "" }

    if (open.getTime() < now.getTime()) {
      newErrors.open = "Open time cannot be in the past"
    }
    if (close.getTime() <= open.getTime()) {
      newErrors.close = "Close time must be after open time"
    }

    setErrors(newErrors)
    return newErrors
  }

  const handleOpenChange = (date: Date) => {
    const newErrors = validateDates(date, closeTime)
    if (!newErrors.open) {
      handleOpenTimeChange(date)
    }
  }

  const handleCloseChange = (date: Date) => {
    const newErrors = validateDates(openTime, date)
    if (!newErrors.close) {
      handleCloseTimeChange(date)
    }
  }

  const handleCalendarClose = (type: "open" | "close") => {
    setTouched((prev) => ({ ...prev, [type]: true }))
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      validateDates(openTime, closeTime)
    }, 10000)

    return () => clearInterval(intervalId)
  })

  return (
    <>
      <div>
        <button
          onClick={handleAddTarget}
          className="flex gap-2 action-button text-sm md:text-base
        dark:text-dark-link-button text-primary-link-button"
        >
          <IoAddOutline className="w-5 h-5 md:w-6 md:h-6" />
          Add target
        </button>
      </div>
      <div className="relative w-full flex flex-col gap-1">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 pl-0 md:pl-1">
          <div className="font-semibold text-sm md:text-base">openTime: </div>
          <DatePicker
            selected={openTime}
            onChange={handleOpenChange}
            onCalendarClose={() => handleCalendarClose("open")}
            showTimeSelect
            timeIntervals={1}
            minDate={new Date()}
            popperPlacement="bottom-start"
            popperModifiers={[
              {
                name: "preventOverflow",
                options: {
                  boundary: "viewport",
                  padding: 20
                },
                fn: ({ x, y }) => ({ x, y })
              }
            ]}
            popperClassName="custom-datepicker-popper"
            timeFormat="HH:mm"
            dateFormat="MMMM d, yyyy h:mm aa"
            className="w-full p-2 rounded-lg text-sm md:text-base"
            calendarClassName="bg-[#101827] text-white"
            customInput={
              <button
                className={`signal-market-selector flex items-center
                justify-between p-2 bg-[#EAEAEA] text-[#101827]
                rounded-md w-full text-sm md:text-base ${touched.open && errors.open ? "border-red-500" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <FiCalendar className="w-4 h-4 md:w-5 md:h-5" />
                  <span>{openTime.toLocaleString()}</span>
                </div>
                <MdOutlineKeyboardArrowDown className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            }
          />
        </div>
        {touched.open && errors.open && (
          <span className="text-red-500 text-xs md:text-sm pl-0 md:pl-[120px]">{errors.open}</span>
        )}
      </div>
      <div className="relative w-full flex flex-col gap-1">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 pl-0 md:pl-1">
          <div className="font-semibold text-sm md:text-base">closeTime: </div>
          <DatePicker
            selected={closeTime}
            onChange={handleCloseChange}
            onCalendarClose={() => handleCalendarClose("close")}
            showTimeSelect
            timeFormat="HH:mm"
            dateFormat="MMMM d, yyyy h:mm aa"
            className="w-full p-2 rounded-lg text-sm md:text-base"
            timeIntervals={1}
            minDate={openTime}
            popperPlacement="bottom-start"
            popperModifiers={[
              {
                name: "preventOverflow",
                options: {
                  boundary: "viewport",
                  padding: 20
                },
                fn: ({ x, y }) => ({ x, y })
              }
            ]}
            calendarClassName="bg-[#101827] text-white"
            customInput={
              <button
                className={`signal-market-selector flex items-center
                justify-between p-2 bg-[#EAEAEA] text-[#101827]
                rounded-md w-full text-sm md:text-base ${touched.close && errors.close ? "border-red-500" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <FiCalendar className="w-4 h-4 md:w-5 md:h-5" />
                  <span>{closeTime.toLocaleString()}</span>
                </div>
                <MdOutlineKeyboardArrowDown className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            }
          />
        </div>
        {touched.close && errors.close && (
          <span className="text-red-500 text-xs md:text-sm pl-0 md:pl-[120px]">{errors.close}</span>
        )}
      </div>
    </>
  )
}
