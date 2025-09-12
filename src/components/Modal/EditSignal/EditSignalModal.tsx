import { AppDispatch } from "@/app/store"
import { updateSignalAsync } from "@/features/Signal/signalsSlice"
import { SignalModel } from "@/shared/models"
import { cn } from "@/utils"
import { Modal } from "flowbite-react"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { FiCalendar } from "react-icons/fi"
import { MdOutlineKeyboardArrowDown } from "react-icons/md"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import "../CreateSignal/date-picker.css"
import "./index.css"

export type EditSignalModalProps = {
  openModal: boolean
  handleCloseModal: () => void
  signal: SignalModel
}

export const EditSignalModal = ({ openModal, handleCloseModal, signal }: EditSignalModalProps) => {
  const [descriptionText, setDescriptionText] = useState(signal.description || "")
  const [closeTime, setCloseTime] = useState<Date>(new Date(signal.closeTime))
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touched, setTouched] = useState(false)
  const [closeTimeError, setCloseTimeError] = useState("")
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const dispatch = useDispatch<AppDispatch>()

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescriptionText(e.target.value)
  }

  const handleCloseTimeChange = (date: Date) => {
    if (date) {
      setCloseTime(date)
      validateCloseTime(date)
    }
  }

  const validateCloseTime = (date: Date) => {
    const now = new Date()
    let error = ""

    if (date.getTime() < now.getTime()) {
      error = "Close time cannot be in the past"
    }

    setCloseTimeError(error)
    return !error
  }

  const handleCalendarClose = () => {
    setTouched(true)
    setIsCalendarOpen(false)
  }

  const getStatus = (openTime: number, closeTime: number): SignalModel["status"] => {
    const currentTime = new Date().getTime()
    if (currentTime - openTime >= 0 && currentTime - closeTime < 0) {
      return "open"
    } else if (currentTime - openTime >= 0 && currentTime - closeTime >= 0) {
      return "closed"
    } else {
      return "not_opened"
    }
  }

  useEffect(() => {
    const hasDescriptionChanged = descriptionText !== (signal.description || "")
    const hasCloseTimeChanged = closeTime.getTime() !== signal.closeTime
    const isValid = !closeTimeError || !touched

    setButtonDisabled(!(hasDescriptionChanged || hasCloseTimeChanged) || !isValid)
  }, [descriptionText, closeTime, signal, closeTimeError, touched])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    setIsSubmitting(true)
    try {
      // Calculate new status based on the updated closeTime
      const newCloseTime = closeTime.getTime()
      const newStatus = getStatus(signal.openTime, newCloseTime)

      await dispatch(
        updateSignalAsync({
          signalId: signal.id,
          description: descriptionText,
          closeTime: newCloseTime,
          status: newStatus
        })
      ).unwrap()

      handleCloseModal()
    } catch (error) {
      console.error("Error updating signal:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal size="xl" show={openModal} onClose={handleCloseModal}>
      <Modal.Header className="border-none">
        <h2 className="text-2xl font-bold">Edit Signal</h2>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
            <div className="font-medium">Signal Info (non-editable)</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <div>Market: {signal.market?.name}</div>
              <div>Entry: {signal.entry}</div>
              <div>Status: {signal.status}</div>
              <div>Open Time: {new Date(signal.openTime).toLocaleString()}</div>
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center mb-1">
              <label htmlFor="description" className="text-sm text-gray-600 dark:text-gray-300">
                Description
              </label>
            </div>
            <textarea
              id="description"
              value={descriptionText}
              onChange={handleDescriptionChange}
              placeholder="Signal description..."
              rows={5}
              maxLength={500}
              className={cn(
                "w-full px-4 py-2 border rounded-lg focus:outline-none ",
                "focus:border-primary-link-button dark:focus:border-dark-link-button",
                "dark:bg-gray-700 dark:border-gray-600 resize-none"
              )}
            />
            <div className="min-h-[1.5rem] flex justify-end">
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {descriptionText.length}/500 characters
              </p>
            </div>
          </div>

          <div className="relative w-full flex flex-col gap-1">
            <div className="flex flex-col gap-2 md:gap-4 pl-0 md:pl-1">
              <div className="font-semibold text-sm md:text-base">Close Time: </div>
              <DatePicker
                selected={closeTime}
                onChange={handleCloseTimeChange}
                onCalendarClose={handleCalendarClose}
                onInputClick={() => setIsCalendarOpen((prev) => !prev)}
                onClickOutside={() => setIsCalendarOpen(false)}
                open={isCalendarOpen}
                shouldCloseOnSelect
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
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
                calendarClassName="bg-[#101827] text-white"
                timeClassName={() => "text-gray-900 dark:text-white"}
                customInput={
                  <button
                    type="button"
                    className={`signal-market-selector flex items-center 
                    justify-between p-2 bg-[#EAEAEA] text-[#101827]
                    rounded-md w-full text-sm md:text-base ${touched && closeTimeError ? "border-red-500" : ""}`}
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
            {touched && closeTimeError && (
              <span className="text-red-500 text-xs md:text-sm pl-2 mt-1">{closeTimeError}</span>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm
              font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700
              dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={buttonDisabled || isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm
              font-medium text-white bg-primary-link-button hover:bg-blue-700
              dark:bg-dark-link-button dark:hover:bg-blue-800 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )
}
