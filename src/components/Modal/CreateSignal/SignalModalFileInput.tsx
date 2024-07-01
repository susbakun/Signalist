import { ChangeEvent, useEffect, useRef, useState } from "react"
import { MdOutlineFileUpload } from "react-icons/md"
import { RiErrorWarningLine } from "react-icons/ri"

type SignalModalFileInputProps = {
  handleChangeImage: (e: ChangeEvent<HTMLInputElement>) => void
  handleCancelSelectImage: () => void
}

export const SignalModalFileInput = ({
  handleChangeImage,
  handleCancelSelectImage
}: SignalModalFileInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const file = inputRef.current?.files?.[0]

  const handleResetInput = () => {
    setImagePreview(null)
    handleCancelSelectImage()
  }

  useEffect(() => {
    console.log("first")
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
          <div className="flex items-center gap-2 -translate-y-2">
            <div
              className="text-xs text-black-20 gap-1
            dark:text-white/50 justify-center flex max-w-min flex-col"
            >
              <p className="w-fit">{inputRef.current.files![0].name}</p>
              <img
                src={imagePreview}
                alt="Image Preview"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <button onClick={handleResetInput} className="action-button pt-[20%]">
              &#x2715;
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
