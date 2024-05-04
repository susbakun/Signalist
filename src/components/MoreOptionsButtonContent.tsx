import { blockUser, deletePost } from '@/features/Post/postsSlice'
import { AccountModel, PostModel } from '@/shared/models'
import { IoHeartDislikeOutline, IoPersonAddOutline } from 'react-icons/io5'
import { MdBlock, MdOutlineReport } from 'react-icons/md'
import { useDispatch } from 'react-redux'

type MoreOptionsButtonContentProps = {
  username: AccountModel['username']
  postId: PostModel['id']
  closePopover: () => void
}

export const MoreOptionsButtonContent = ({
  username,
  closePopover,
  postId
}: MoreOptionsButtonContentProps) => {
  const dispatch = useDispatch()

  const handleNotInterested = () => {
    dispatch(deletePost({ id: postId }))
    closePopover()
  }

  const handleBlockUser = () => {
    dispatch(blockUser({ username }))
  }

  return (
    <div className="flex flex-col text-md font-bold justify-center text-center">
      <button onClick={closePopover} className="option-button">
        <IoPersonAddOutline />
        Follow
      </button>
      <button onBlur={closePopover} onClick={handleNotInterested} className="option-button">
        <IoHeartDislikeOutline /> Not Interested
      </button>
      <button onClick={handleBlockUser} className="option-button">
        <MdBlock />
        Block @{username}
      </button>
      <button onClick={closePopover} className="option-button border-none">
        <MdOutlineReport />
        Report Post
      </button>
    </div>
  )
}
