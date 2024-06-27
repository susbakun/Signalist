import { useRef } from "react"
import { HiOutlinePhoto } from "react-icons/hi2"

export const MediaOptionsButtonContent = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <div className="flex flex-col text-md font-bold justify-center text-center">
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/mp4,video/x-m4v,video/*"
        className="hidden"
      />
      <button onClick={() => inputRef.current?.click()} className="option-button px-2 py-2">
        <HiOutlinePhoto />
        Photo or Video
      </button>
    </div>
  )
}
