import { ChangeEvent, useEffect, useRef, useState } from "react"
import { FaCameraRetro } from "react-icons/fa"
import { cn, getAvatarPlaceholder } from "@/utils"

type ProfileImagePickerProps = {
  name: string
  selectedImage: File | null
  onImageChange: (file: File | null) => void
  error?: string
}

export const ProfileImagePicker = ({
  name,
  selectedImage,
  onImageChange,
  error
}: ProfileImagePickerProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const placeholder = getAvatarPlaceholder(name)

  const handleImageClick = () => {
    inputRef.current?.click()
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageChange(e.target.files[0])
    }
  }

  const handleRemoveImage = () => {
    onImageChange(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
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
    <div className="flex flex-col items-center mt-6 mb-8">
      <div className="text-center mb-3">
        <p className="text-sm text-gray-600 dark:text-gray-300">Choose a profile picture</p>
      </div>

      <div className="relative cursor-pointer group" onClick={handleImageClick}>
        <div
          className={cn(
            "w-24 h-24 rounded-full overflow-hidden transition-all duration-200 border-2",
            error ? "border-red-500" : "border-primary-link-button dark:border-dark-link-button",
            "hover:opacity-90"
          )}
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Profile Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-2xl font-semibold">
              {placeholder}
            </div>
          )}
        </div>

        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <FaCameraRetro className="text-white w-8 h-8" />
        </div>
      </div>

      {imagePreview && (
        <button
          type="button"
          onClick={handleRemoveImage}
          className="text-sm text-red-500 hover:text-red-700 mt-3"
        >
          Remove
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />

      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  )
}
