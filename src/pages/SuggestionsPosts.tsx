import { EmptyPage } from './EmptyPage'

export const SuggestionsPosts = () => {
  const posts = []
  if (!posts.length)
    return (
      <EmptyPage className="flex justify-center items-center h-[80vh]">
        <h3>There are no posts yet</h3>
      </EmptyPage>
    )
  return <div>SuggestionsPosts</div>
}
