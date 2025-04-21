import { CustomSelect, Loader } from "@/components"
import { NewsPreview } from "@/components/News/NewsPreview"
import { useGetNewsQuery } from "@/services/newsApi"
import { cryptoNewsCategories, cryptoNewsFilters } from "@/shared/constants"
import { NewsFilterType, OptionType } from "@/shared/types"
import { cn } from "@/utils"
import { useEffect, useState, useCallback } from "react"
import { FaArrowUp } from "react-icons/fa"
import { HiArrowNarrowLeft } from "react-icons/hi"
import { IoChevronDownOutline } from "react-icons/io5"
import { Link } from "react-router-dom"

type NewsArticle = {
  title: string
  url: string
  urlToImage?: string
  description?: string
  publishedAt: string
  source: {
    name: string
  }
}

// News filter types to match the API expectations

export const DetailedNewsPage = () => {
  const [currency, setCurrency] = useState<string>("")
  const [filter, setFilter] = useState<NewsFilterType>("hot")
  const [newsList, setNewsList] = useState<NewsArticle[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMoreItems, setHasMoreItems] = useState(false)

  const {
    data: newsData,
    isLoading,
    isFetching,
    error,
    refetch
  } = useGetNewsQuery({
    filter,
    currency,
    page
  })

  // Reset page state when filter or currency changes
  const resetPagination = useCallback(() => {
    setPage(1)
    setNewsList([])
    setHasMoreItems(false)
  }, [])

  useEffect(() => {
    if (newsData?.articles) {
      if (page === 1) {
        setNewsList(newsData.articles || [])
      } else {
        setNewsList((prev) => [...prev, ...(newsData.articles || [])])
      }

      // Check if there are more items to load
      setHasMoreItems(
        Boolean(
          newsData.totalResults && newsData.totalResults > page * 10 && newsData.articles.length > 0
        )
      )
    }
  }, [newsData, page])

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const changeCryptoCurrency = (selected: OptionType | null) => {
    setCurrency(selected ? selected.value : "")
    resetPagination()
  }

  const changeNewsFilter = (selected: OptionType | null) => {
    setFilter((selected ? selected.value.toLowerCase() : "hot") as NewsFilterType)
    resetPagination()
  }

  // Get error message from response
  const getErrorMessage = () => {
    if (typeof error === "object" && error !== null) {
      // @ts-expect-error - we know error might have these properties
      if (error.data?.message) return error.data.message
      // @ts-expect-error - we know error might have these properties
      if (error.error) return error.error
    }
    return "Error loading news data. Please try again later."
  }

  // Handler for loading more items
  const handleLoadMore = () => {
    if (!isFetching && hasMoreItems) {
      setPage((prev) => prev + 1)
    }
  }

  // Show error state
  if (error || newsData?.error) {
    const errorMsg = newsData?.error?.message || getErrorMessage()

    return (
      <div className="py-4 flex flex-col h-full w-full px-4">
        <div className="flex w-full items-center">
          <Link to="/" className="action-button">
            <HiArrowNarrowLeft className="w-7 h-7" />
          </Link>
          <h1 className="text-xl text-center w-full">Crypto News</h1>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
          <div className="text-center">
            <h2 className="text-xl text-red-500 mb-4">Error loading news</h2>
            <p className="mb-4">{errorMsg}</p>
            <button
              onClick={() => refetch()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="py-4 flex flex-col h-full w-full px-4">
        <div className="flex w-full items-center">
          <Link to="/" className="action-button">
            <HiArrowNarrowLeft className="w-7 h-7" />
          </Link>
          <h1 className="text-xl text-center w-full">Crypto News</h1>
        </div>
        <div className="flex items-center justify-center min-h-[50vh] w-full">
          <Loader className="h-16 w-16" />
        </div>
      </div>
    )
  }

  return (
    <div className="py-4 px-4">
      <div className="flex justify-center">
        <div className="flex w-full items-center pt-2 pb-8">
          <Link to="/" className="action-button">
            <HiArrowNarrowLeft className="w-7 h-7" />
          </Link>
          <h1 className="text-xl text-center w-full">Crypto News</h1>
        </div>
      </div>
      <div className="py-4 flex flex-col md:flex-row gap-4 px-4">
        <div className="w-full md:w-1/2">
          <label className="block mb-2 text-sm font-medium">News Filter</label>
          <CustomSelect options={cryptoNewsFilters} selected={filter} onChange={changeNewsFilter} />
        </div>
        <div className="w-full md:w-1/2">
          <label className="block mb-2 text-sm font-medium">Cryptocurrency</label>
          <CustomSelect
            options={cryptoNewsCategories}
            selected={currency}
            onChange={changeCryptoCurrency}
          />
        </div>
      </div>

      {newsList.length === 0 && !isLoading && !isFetching ? (
        <div className="flex items-center justify-center min-h-[30vh] w-full">
          <div className="text-center">
            <h3 className="text-lg mb-2">No news articles found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try changing your filters or check back later
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 py-4">
          {newsList.map((article, index) => (
            <NewsPreview
              key={`${article.url}-${index}`}
              title={article.title}
              url={article.url}
              imageurl={article.urlToImage}
              body={article.description}
              published_on={new Date(article.publishedAt).getTime() / 1000}
              source={article.source.name}
              isCompatMode
            />
          ))}
        </div>
      )}

      {isFetching && (
        <div className="flex items-center justify-center h-16 w-full my-4">
          <Loader className="h-10 w-10" />
        </div>
      )}

      {!isFetching && hasMoreItems && (
        <div className="flex justify-center mt-6 mb-8">
          <button
            onClick={handleLoadMore}
            className="flex items-center gap-1 main-button text-sm rounded-2xl px-2 py-2"
            disabled={isFetching}
          >
            <IoChevronDownOutline />
            Show More
          </button>
        </div>
      )}

      <button
        onClick={scrollToTop}
        className={cn(
          "main-button transition-all duration-100 ease-out fixed",
          {
            "translate-x-20": !isVisible
          },
          "right-4 bottom-20 md:bottom-4 px-4 py-4 rounded-full"
        )}
      >
        <FaArrowUp />
      </button>
    </div>
  )
}
