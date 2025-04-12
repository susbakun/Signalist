import { ImagePreview } from "@/components/Shared/ImagePreview"
import { Modal, Spinner } from "flowbite-react"
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react"
import { MdOutlineFileUpload } from "react-icons/md"
import { FaUser } from "react-icons/fa"

type CreateGroupChooseGroupInfoModalProps = {
  openModal: boolean
  groupName: string
  selectedImage: File | undefined
  isGroupImageSending: boolean
  createGroupButtonDisabled: boolean
  handleCloseModal: () => void
  handleCancelSelectImage: () => void
  handleChooseGroupInfo: () => void
  handleChangeGroupName: (e: ChangeEvent<HTMLInputElement>) => void
  handleChangeImage: (e: ChangeEvent<HTMLInputElement>) => void
  error: string | null
}

export const CreateGroupChooseGroupInfoModal = ({
  openModal,
  groupName,
  selectedImage,
  isGroupImageSending,
  createGroupButtonDisabled,
  handleCloseModal,
  handleCancelSelectImage,
  handleChooseGroupInfo,
  handleChangeGroupName,
  handleChangeImage,
  error
}: CreateGroupChooseGroupInfoModalProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)

  const file = inputRef.current?.files?.[0]

  const handleResetFileInput = () => {
    setImagePreview(null)
    handleCancelSelectImage()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleChooseGroupInfo()
    }
  }

  // Process the selected file to get image preview
  useEffect(() => {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else if (selectedImage) {
      // If there's a selectedImage prop but no file in the input, use selectedImage
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(selectedImage)
    }
  }, [file, selectedImage])

  return (
    <Modal size="lg" show={openModal} onClose={handleCloseModal}>
      <Modal.Header className="border-none pr-1 py-2">
        <h3 className="text-2xl font-semibold text-center w-full">Group Information</h3>
      </Modal.Header>
      <Modal.Body
        className="flex overflow-y-auto
        flex-col gap-4 py-4 px-6 custom-modal"
      >
        {error && (
          <div className="text-red-500 text-sm bg-red-100 dark:bg-red-900/20 p-2 rounded mb-2">
            {error}
          </div>
        )}
        <div className="flex flex-col items-center py-4 gap-6">
          <div className="w-full">
            <div className="relative mb-4">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={groupName}
                onKeyDown={handleKeyDown}
                onChange={handleChangeGroupName}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-primary-link-button dark:focus:border-dark-link-button dark:bg-gray-700 dark:border-gray-600"
                placeholder="Enter group name"
              />
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-4">
            <div className="text-lg font-medium text-gray-700 dark:text-gray-300 w-full">
              Group Profile Image
            </div>

            <ImagePreview
              rounded
              handleResetInput={handleResetFileInput}
              imagePreview={imagePreview}
            />

            <div className="flex items-center justify-center w-full">
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleChangeImage}
              />
              <button
                className="px-4 py-2 text-sm bg-primary-link-button dark:bg-dark-link-button text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                onClick={() => inputRef.current?.click()}
                type="button"
              >
                <MdOutlineFileUpload className="w-5 h-5" />
                <span>Upload Image</span>
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="py-4 px-6 flex justify-center">
        <button
          disabled={createGroupButtonDisabled}
          onClick={handleChooseGroupInfo}
          className="w-full py-2.5 px-4 bg-primary-link-button dark:bg-dark-link-button text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGroupImageSending && <Spinner color="success" size="sm" />}
          Create Group
        </button>
      </Modal.Footer>
    </Modal>
  )
}
