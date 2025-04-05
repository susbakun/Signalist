import { ImagePreview } from "@/components/Shared/ImagePreview"
import { Modal, Spinner } from "flowbite-react"
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react"
import { MdOutlineFileUpload } from "react-icons/md"
import { RiErrorWarningLine } from "react-icons/ri"

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
}

export const CreateGroupChooseGroupInfoModal = ({
  openModal,
  groupName,
  isGroupImageSending,
  createGroupButtonDisabled,
  handleCloseModal,
  handleCancelSelectImage,
  handleChooseGroupInfo,
  handleChangeGroupName,
  handleChangeImage
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
    <Modal size="lg" show={openModal} onClose={handleCloseModal}>
      <Modal.Header className="border-none pr-1 py-2" />
      <Modal.Body
        className="flex overflow-y-auto
        flex-col gap-2 py-0 mb-0 px-4 custom-modal"
      >
        <div className="flex flex-col items-center py-8 gap-4">
          <div className="flex flex-col gap-2 w-full">
            <label className="pl-1">Group Name:</label>
            <input
              value={groupName}
              onKeyDown={handleKeyDown}
              onChange={handleChangeGroupName}
              className="custom-input w-full pl-4 inline-block"
            />
          </div>
          <div className="flex w-full items-center justify-between px-2 pt-12">
            <div
              className="text-md flex items-center font-normal gap-1 text-black-20
            dark:text-white/50"
            >
              <div className="flex gap-3 md:gap-2 items-center">
                <RiErrorWarningLine className="w-5 h-5 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                <p className="pt-2 md:pt-0">Choose group image profile</p>
              </div>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleChangeImage}
            />
            <div className="flex items-center">
              <button
                className="px-2 py-2 text-sm action-button text-white rounded-lg
              dark:bg-dark-link-button flex items-center text-nowrap
              bg-primary-link-button font-bold"
                onClick={() => inputRef.current?.click()}
              >
                <MdOutlineFileUpload className="w-4 h-4 mr-2" />
                <span>Upload Image</span>
              </button>
            </div>
          </div>
          <ImagePreview
            rounded
            handleResetInput={handleResetFileInput}
            imagePreview={imagePreview}
          />
        </div>
      </Modal.Body>
      <Modal.Footer className="py-3 px-2">
        <div className="flex items-center justify-end w-full">
          <button
            disabled={createGroupButtonDisabled}
            onClick={handleChooseGroupInfo}
            className="action-button disabled:opacity-30
            dark:bg-dark-link-button flex items-center gap-2
            bg-primary-link-button rounded-md px-2 py-1"
          >
            {isGroupImageSending && <Spinner color="success" size="md" />}
            Create Group
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}
