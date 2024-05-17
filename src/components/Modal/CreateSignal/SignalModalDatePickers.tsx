import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FiCalendar } from 'react-icons/fi'
import { IoAddOutline } from 'react-icons/io5'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'
import './date-picker.css'

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
  return (
    <>
      <div>
        <button
          onClick={handleAddTarget}
          className="flex gap-2 action-button
        dark:text-dark-link-button text-primary-link-button"
        >
          <IoAddOutline className="w-6 h-6" />
          Add target
        </button>
      </div>
      <div className="relative w-full flex items-center gap-4 pl-1">
        <div className="font-semibold">openTime: </div>
        <DatePicker
          selected={openTime}
          onChange={handleOpenTimeChange}
          showTimeSelect
          timeIntervals={1}
          popperPlacement="bottom"
          popperClassName="custom-datepicker-popper"
          timeFormat="HH:mm"
          dateFormat="MMMM d, yyyy h:mm aa"
          className="w-full p-2 rounded-lg"
          calendarClassName="bg-[#101827] text-white"
          customInput={
            <button
              className="signal-market-selector flex items-center
            justify-between p-2bg-[#EAEAEA] text-[#101827]
            rounded-md w-full"
            >
              <div className="flex items-center gap-2">
                <FiCalendar />
                <span>{openTime.toLocaleString()}</span>
              </div>
              <MdOutlineKeyboardArrowDown />
            </button>
          }
        />
      </div>
      <div className="relative w-full flex items-center gap-4 pl-1">
        <div className="font-semibold">closeTime: </div>
        <DatePicker
          selected={closeTime}
          onChange={handleCloseTimeChange}
          showTimeSelect
          timeFormat="HH:mm"
          dateFormat="MMMM d, yyyy h:mm aa"
          className="w-full p-2 rounded-lg"
          timeIntervals={1}
          calendarClassName="bg-[#101827] text-white"
          customInput={
            <button
              className="signal-market-selector flex items-center
            justify-between p-2 bg-[#EAEAEA] text-[#101827]
            rounded-md w-full"
            >
              <div className="flex items-center gap-2">
                <FiCalendar />
                <span>{closeTime.toLocaleString()}</span>
              </div>
              <MdOutlineKeyboardArrowDown />
            </button>
          }
        />
      </div>
    </>
  )
}
