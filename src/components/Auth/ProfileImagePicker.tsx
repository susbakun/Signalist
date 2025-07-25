import { ChangeEvent, useEffect, useRef, useState } from "react"
import { FaCameraRetro } from "react-icons/fa"
import { MdCrop } from "react-icons/md"
import { cn, getAvatarPlaceholder } from "@/utils"
import ReactCrop, { type Crop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { Modal } from "flowbite-react"

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
  const [showCropModal, setShowCropModal] = useState(false)
  const [tempImage, setTempImage] = useState<string | null>(null)
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 100,
    height: 100,
    x: 0,
    y: 0
  })
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const placeholder = getAvatarPlaceholder(name)

  const handleImageClick = () => {
    inputRef.current?.click()
  }

  const handleCloseCropModal = () => {
    setShowCropModal(false)
    setTempImage(null)
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        setTempImage(reader.result as string)
        setShowCropModal(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    onImageChange(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const getCroppedImg = () => {
    if (!imgRef.current || !completedCrop) return

    const canvas = document.createElement("canvas")
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    const pixelRatio = window.devicePixelRatio

    canvas.width = completedCrop.width * scaleX * pixelRatio
    canvas.height = completedCrop.height * scaleY * pixelRatio

    ctx.scale(pixelRatio, pixelRatio)
    ctx.imageSmoothingQuality = "high"

    const cropX = completedCrop.x * scaleX
    const cropY = completedCrop.y * scaleY

    ctx.translate(-cropX, -cropY)
    ctx.drawImage(
      imgRef.current,
      0,
      0,
      imgRef.current.naturalWidth,
      imgRef.current.naturalHeight,
      0,
      0,
      imgRef.current.naturalWidth,
      imgRef.current.naturalHeight
    )

    return new Promise<File>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) return
          const file = new File([blob], "cropped-image.jpg", { type: "image/jpeg" })
          resolve(file)
        },
        "image/jpeg",
        0.95
      )
    })
  }

  const handleCropComplete = async () => {
    if (!completedCrop) return

    try {
      const croppedImageFile = await getCroppedImg()
      if (croppedImageFile) {
        onImageChange(croppedImageFile)
        setShowCropModal(false)
        setTempImage(null)
      }
    } catch (error) {
      console.error("Error cropping image:", error)
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
            <div
              className="w-full h-full flex items-center justify-center
             bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-2xl font-semibold"
            >
              {placeholder}
            </div>
          )}
        </div>

        <div
          className="absolute inset-0 flex items-center justify-center
        bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
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

      {/* Image Crop Modal */}
      <Modal size="lg" show={showCropModal} onClose={handleCloseCropModal}>
        <Modal.Header className="border-none pr-1 py-2">
          <h3 className="text-2xl font-semibold text-center w-full">Crop Profile Image</h3>
        </Modal.Header>
        <Modal.Body className="flex flex-col items-center py-4 px-6">
          <div className="w-full max-w-md mx-auto">
            {tempImage && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                className="w-fit flex items-center justify-center mx-auto"
              >
                <img
                  ref={imgRef}
                  src={tempImage}
                  alt="Crop Preview"
                  draggable={false}
                  className="max-w-full h-auto w-[380px]"
                />
              </ReactCrop>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-4 mb-2 text-center">
            Drag to adjust the crop area
          </p>
        </Modal.Body>
        <Modal.Footer className="py-4 px-6 flex justify-center">
          <button
            onClick={handleCloseCropModal}
            className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700
            dark:text-gray-200 rounded-lg hover:opacity-90 transition-opacity mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleCropComplete}
            className="px-4 py-2 text-sm bg-primary-link-button dark:bg-dark-link-button
            text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <MdCrop className="w-5 h-5" />
            Apply Crop
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
