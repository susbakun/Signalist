import { ChangeEvent, useEffect, useRef, useState } from "react"
import { MdOutlineFileUpload } from "react-icons/md"
import { RiErrorWarningLine } from "react-icons/ri"

type SignalModalFileInputProps = {
  handleChangeImage: (e: ChangeEvent<HTMLInputElement>) => void
}

export const SignalModalFileInput = ({ handleChangeImage }: SignalModalFileInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const file = inputRef.current?.files?.[0]

  useEffect(() => {
    if (inputRef.current && inputRef.current.files) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      if (file) reader.readAsDataURL(file)
    }
  }, [file])

  return (
    <div className="flex flex-col gap-4 mb-3">
      <div
        className="text-md flex items-center font-normal gap-1 text-black-20
      dark:text-white/50"
      >
        <RiErrorWarningLine />
        If you want other users to see your chart please download the chart screenshot and upload it
        here:
      </div>
      <div className="flex gap-3 items-center">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChangeImage}
        />
        <div>
          <button
            className="px-2 py-2 text-sm action-button text-white rounded-lg bg-primary-link-button
          dark:bg-dark-link-button flex items-center text-nowrap"
            onClick={() => inputRef.current?.click()}
          >
            <MdOutlineFileUpload className="w-4 h-4 mr-2" />
            <span>Upload Image</span>
          </button>
        </div>
        {inputRef.current && imagePreview && (
          <div
            className="text-xs text-black-20 gap-1
          dark:text-white/50 justify-center flex flex-col"
          >
            <p>{inputRef.current.files![0].name}</p>
            <img
              src={imagePreview}
              alt="Image Preview"
              className="w-[10%] h-[10%] object-cover rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  )
}
