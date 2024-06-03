import { AccountModel, PostModel } from '@/shared/models'
import { Link } from 'react-router-dom'
import { BluredPostComponent } from '../BluredComponent/BluredComponent'

type PostBodyProps = {
  content: PostModel['content']
  amISubscribed?: boolean
  publisherUsername: AccountModel['username']
  isPremium: boolean
}

export const PostBody = ({
  content,
  publisherUsername,
  amISubscribed,
  isPremium
}: PostBodyProps) => {
  return isPremium && !amISubscribed ? (
    <div className="relative rounded-lg overflow-x-hidden">
      <BluredPostComponent />
      <Link
        to={`/${publisherUsername}/premium`}
        className="absolute top-[50%] left-[50%] -translate-x-[50%]
        -translate-y-[50%] action-button text-white bg-gradient-to-r
      dark:from-dark-link-button from-primary-link-button to-[#ff00e5]
      dark:to-[#ff00e5] px-3 py-2 rounded-md"
      >
        Subscribe
      </Link>
    </div>
  ) : (
    <div>{content}</div>
  )
}
