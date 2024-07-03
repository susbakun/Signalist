type PostImagePreviewProps = {
  selectedImage: File | undefined
  imagePreview: string | null
  handleResetInput: () => void
}

export const PostModalImagePreview = ({
  selectedImage,
  imagePreview,
  handleResetInput
}: PostImagePreviewProps) => {
  if (selectedImage && imagePreview) {
    return (
      <div className="flex items-center gap-2 my-2">
        <div
          className="text-xs text-black-20 gap-1
                dark:text-white/50 justify-center flex max-w-min flex-col"
        >
          <p className="w-fit">{selectedImage.name}</p>
          <img
            src={imagePreview}
            alt="Image Preview"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <button onClick={handleResetInput} className="action-button translate-y-[40%]">
          &#x2715;
        </button>
      </div>
    )
  }
}
