import { IoTrashOutline } from "react-icons/io5"

type MoreOptionsButtonForCommentContentProps = {
  handleDeleteComment: () => void
}

export const MoreOptionsButtonForCommentContent = ({
  handleDeleteComment
}: MoreOptionsButtonForCommentContentProps) => {
  return (
    <div className="flex flex-col text-md font-bold justify-center text-center p-1">
      <button
        onClick={handleDeleteComment}
        className="option-button border-none px-2 py-2 text-rose-700"
      >
        <IoTrashOutline />
        Delete
      </button>
    </div>
  )
}
