import { NewsFiltersDrawer, NewsPreview } from "@/components"
import { useGetNewsQuery } from "@/services/newsApi"
import { CryptoCurrency } from "@/shared/models"
import { cn } from "@/utils"
import { uniqBy } from "lodash"
import { useEffect, useState } from "react"
import { FaArrowUp } from "react-icons/fa"
import {
  FeaturedNews,
  NewsSkeletonLoader,
  NewsTopicsBox,
  NewsSubscriptionBox,
  NewsMarketSelectionBox,
  NewsSourcesSelectionBox,
  NewsTopContributorsBox,
  NewsListSearchBar,
  NewsListTopFilters,
  NewsAIAnalyticsModal
} from "@/components"

import { VscFilter } from "react-icons/vsc"

// Define the transformed article structure from the API
type NewsArticle = {
  title: string
  url: string
  urlToImage?: string
  description?: string
  publishedAt: string
  source: {
    name: string
  }
  currencies?: CryptoCurrency[] | null
  // For uniqueness in the list
  id?: string
}

export const NewsList = () => {
  const [newsList, setNewsList] = useState<NewsArticle[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [openAiModal, setOpenAiModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isFiltersDrawerOpen, setIsFiltersDrawerOpen] = useState(false)

  const { data: newsData, isLoading } = useGetNewsQuery({
    page: currentPage
  })

  const handleLoadMore = (page: number) => {
    setCurrentPage(page)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleCloseAiModal = () => {
    setOpenAiModal(false)
  }

  const handleOpenAiModal = () => {
    setOpenAiModal(true)
  }

  const handleCloseFiltersDrawer = () => {
    setIsFiltersDrawerOpen(false)
  }

  const handleOpenFiltersDrawer = () => {
    setIsFiltersDrawerOpen(true)
  }

  useEffect(() => {
    if (newsData?.articles) {
      setNewsList((prev) => {
        // Add unique IDs for list rendering
        const articlesWithId = newsData.articles.map((article, index) => ({
          ...article,
          id: article.url || `article-${index}`
        }))

        const combined = [...prev, ...articlesWithId]
        return uniqBy(combined, "url") // Use URL as unique identifier
      })
    }
  }, [newsData?.articles])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      setIsVisible(scrollTop > window.innerHeight * 0.8)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  if (!newsList?.length || isLoading) return <NewsSkeletonLoader />

  return (
    <>
      <section>
        <div className="flex justify-between px-2">
          <h4 className="text-xl mb-4">News</h4>
        </div>
        <FeaturedNews
          title={newsList[0].title}
          description={newsList[0].description}
          source={newsList[0].source.name}
          publishedAt={newsList[0].publishedAt}
          url={newsList[0].url}
          handleOpenAiModal={handleOpenAiModal}
        />
        <div className="flex gap-8 w-full mb-4 mt-10 items-center">
          <div className="w-full md:w-[70%] flex flex-col gap-8">
            <NewsListTopFilters />
            <div className="flex md:hidden gap-8 items-center">
              <div className="w-[90%]">
                <NewsListSearchBar />
              </div>
              <div className="w-[10%] flex items-center justify-end">
                <button
                  className="rounded-full p-3 dark:bg-gray-600 bg-gray-300
                 hover:bg-gray-700 transition-all duration-100 ease-out action-button"
                  onClick={handleOpenFiltersDrawer}
                >
                  <VscFilter className="w-7 h-7" />
                </button>
              </div>
            </div>
          </div>
          <div className="w-[30%] h-full hidden lg:flex flex-col gap-8">
            <NewsListSearchBar />
          </div>
        </div>
        <div className="flex gap-8 w-full mb-4 mt-6 items-start">
          <div className="w-full lg:w-[70%] flex flex-col gap-8">
            <ul className="flex flex-col gap-8 md:gap-4">
              {newsList.slice(1, 5).map((article) => (
                <NewsPreview
                  key={article.id || article.url}
                  title={article.title}
                  url={article.url}
                  body={article.description}
                  imageurl={article.urlToImage}
                  published_on={article.publishedAt}
                  source={article.source.name}
                  currencies={article.currencies}
                  handleOpenAiModal={handleOpenAiModal}
                />
              ))}
            </ul>
            <div className="flex itmes-center gap-2 font-bold justify-center">
              {[1, 2, 3, 4, 5, 6, 8].map((page) => {
                if (page !== 6)
                  return (
                    <button
                      key={page}
                      className={cn(
                        "text-sm text-white transition-all duration-100 ease-out",
                        "rounded-md px-3 py-1.5 hover:text-white/80 ",
                        {
                          "bg-dark-link-button hover:bg-dark-link-button/80": currentPage === page
                        }
                      )}
                      onClick={() => handleLoadMore(page)}
                    >
                      {page}
                    </button>
                  )
                return <p key={page}>...</p>
              })}
            </div>
          </div>
          <div className="w-[30%] h-full hidden lg:flex flex-col gap-6">
            <NewsTopicsBox />
            <NewsMarketSelectionBox />
            <NewsSourcesSelectionBox />
            <NewsTopContributorsBox />
            <NewsSubscriptionBox />
          </div>
        </div>

        <button
          onClick={scrollToTop}
          className={cn(
            "main-button transition-all duration-100 ease-out fixed",
            {
              "translate-x-20": !isVisible
            },
            "right-4 bottom-20 md:right-4 md:bottom-4 px-4 py-4 rounded-full"
          )}
        >
          <FaArrowUp />
        </button>
      </section>
      <NewsFiltersDrawer isOpen={isFiltersDrawerOpen} closeDrawer={handleCloseFiltersDrawer} />
      <NewsAIAnalyticsModal openModal={openAiModal} handleCloseModal={handleCloseAiModal} />
    </>
  )
}
