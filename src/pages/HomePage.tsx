import { HomeTopBar, NewsList, WatchList } from '@/components'

export const HomePage = () => {
  return (
    <div className="flex flex-col gap-8 pb-12 pt-8 px-8">
      <HomeTopBar />
      <WatchList />
      <NewsList />
    </div>
  )
}
