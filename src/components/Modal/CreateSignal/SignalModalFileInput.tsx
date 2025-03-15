import { ChangeEvent, useEffect, useRef, useState } from "react"
import { MdOutlineFileUpload } from "react-icons/md"
import { RiErrorWarningLine } from "react-icons/ri"

type SignalModalFileInputProps = {
  selectedImage?: File
  handleChangeImage: (e: ChangeEvent<HTMLInputElement>) => void
  handleCancelSelectImage: () => void
}

export const SignalModalFileInput = ({
  selectedImage,
  handleChangeImage,
  handleCancelSelectImage
}: SignalModalFileInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleResetInput = () => {
    setImagePreview(null)
    handleCancelSelectImage()
  }

  useEffect(() => {
    if (selectedImage) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(selectedImage)
    } else {
      setImagePreview(null)
    }
  }, [selectedImage])

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
        <button
          onClick={() => inputRef.current?.click()}
          className="px-2 py-2 text-sm action-button text-white rounded-lg
          dark:bg-dark-link-button flex items-center text-nowrap
          bg-primary-link-button font-bold"
        >
          <MdOutlineFileUpload className="h-5 w-5" />
          Upload Image
        </button>
        {imagePreview && (
          <div className="relative">
            <img src={imagePreview} alt="Preview" className="h-12 w-12 rounded-md object-cover" />
            <button
              onClick={handleResetInput}
              className="absolute -top-2 -right-2 bg-red-500 text-white h-5 w-5
            rounded-full text-xs flex items-center justify-center"
            >
              x
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
