import { ChangeEvent, useRef } from "react"
import { MdOutlineFileUpload } from "react-icons/md"
import { RiErrorWarningLine } from "react-icons/ri"

type SignalModalFileInputProps = {
  handleSendImage: (e: ChangeEvent<HTMLInputElement>) => Promise<void>
}

export const SignalModalFileInput = ({ handleSendImage }: SignalModalFileInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <div className="flex justify-between items-center mb-3">
      <div className="text-md flex items-center font-normal gap-1 text-black-20 dark:text-white/50">
        <RiErrorWarningLine />
        If you want other users to see your chart please download the chart screenshot and upload it
        here:
      </div>
      <div className="flex items-center">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleSendImage}
        />
        <button
          className="px-2 py-2 action-button text-white rounded-lg bg-primary-link-button
        dark:bg-dark-link-button flex items-center"
          onClick={() => inputRef.current?.click()}
        >
          <MdOutlineFileUpload className="w-5 h-5 mr-2" />
          Upload Image
        </button>
      </div>
    </div>
  )
}
