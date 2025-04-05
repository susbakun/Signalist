import Tippy from "@tippyjs/react"
import { Avatar } from "flowbite-react"
import { roundArrow } from "tippy.js"

type ImagePreview = {
  imagePreview: string | null
  rounded?: boolean
  handleResetInput: () => void
}

export const ImagePreview = ({ imagePreview, rounded, handleResetInput }: ImagePreview) => {
  if (imagePreview) {
    return (
      <div className="flex items-center gap-2 my-2">
        <div className="w-full h-full flex items-center relative">
          {rounded ? (
            <Avatar img={imagePreview} alt="image preview" size="lg" color="gray" rounded />
          ) : (
            <img
              src={imagePreview}
              alt="Image Preview"
              className="w-full h-full object-cover rounded-lg mobile:max-h-[150px]"
            />
          )}
          <Tippy
            content="delete post image"
            className="dark:bg-gray-700 bg-gray-900
            rounded-md px-1 py-[1px] text-sm text-white
            font-sans"
            delay={[1000, 0]}
            placement="bottom"
            animation="fade"
            arrow={roundArrow}
            duration={10}
            hideOnClick={true}
          >
            <button
              onClick={handleResetInput}
              className="action-button
              absolute top-2 right-2 text-gray-200"
            >
              &#x2715;
            </button>
          </Tippy>
        </div>
      </div>
    )
  }
}
