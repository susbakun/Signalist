import { Loader, NewsPreview } from '@/components'
import { useGetCryptoNewsQuery } from '@/services/cryptoNewsApi'
import { CryptoNewsType } from '@/shared/models'
import { cn } from '@/utils'
import { uniqBy } from 'lodash'
import { useEffect, useState } from 'react'
import { FaArrowUp } from 'react-icons/fa'
import { IoChevronDownOutline } from 'react-icons/io5'

export const NewsList = () => {
  const [newsPage, setNewsPage] = useState(1)
  const [newsList, setNewsList] = useState<CryptoNewsType['articles']>([])
  const [isVisible, setIsVisible] = useState(false)

  const {
    data: cryptoNews,
    isLoading,
    isFetching
  } = useGetCryptoNewsQuery({
    newsCategory: 'Cryptocurrency',
    count: 5,
    page: newsPage
  })

  const handleLoadMore = () => {
    setNewsPage((prevPage) => prevPage + 1)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  useEffect(() => {
    if (cryptoNews) {
      //following line won't be needed if we don't have duplicated news
      setNewsList((prev) => uniqBy([...prev, ...cryptoNews.articles], 'title'))
      // setNewsList((prev) => prev.concat(cryptoNews.articles))
    }
  }, [cryptoNews])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      setIsVisible(scrollTop > window.innerHeight * 0.8)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  if (!newsList?.length || isLoading) return

  return (
    <section>
      <h4 className="text-xl mb-4">News</h4>
      <ul className="flex flex-col gap-8">
        {newsList.map((news) => (
          <NewsPreview key={news.title} {...news} />
        ))}
      </ul>
      <div className="flex justify-center mt-8">
        {isFetching ? (
          <Loader />
        ) : (
          <button
            onClick={handleLoadMore}
            className="flex items-center gap-1 main-button text-sm
            rounded-2xl px-2 py-2 "
          >
            <IoChevronDownOutline />
            Show More
          </button>
        )}
      </div>
      <button
        onClick={scrollToTop}
        className={cn(
          'main-button transition-all duration-100 ease-out fixed',
          {
            'translate-x-20': !isVisible
          },
          'right-4 bottom-4 px-4 py-4 rounded-full'
        )}
      >
        <FaArrowUp />
      </button>
    </section>
  )
}
