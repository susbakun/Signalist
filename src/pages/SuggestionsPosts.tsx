import { EmptyPage } from './EmptyPage'

export const SuggestionsPosts = () => {
  const posts = []
  if (!posts.length)
    return (
      <EmptyPage>
        <h3 className="text-center leading-[80vh]">There are no posts yet</h3>
      </EmptyPage>
    )
  return <div>SuggestionsPosts</div>
}
