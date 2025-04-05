import { CustomSelect, Loader } from "@/components"
import { NewsPreview } from "@/components/News/NewsPreview"
import { useGetNewsQuery } from "@/services/newsApi"
import { cryptoNewsCategories } from "@/shared/constants"
import { NewsArticle } from "@/shared/models"
import { OptionType } from "@/shared/types"
import { cn } from "@/utils"
import { useEffect, useState } from "react"
import { FaArrowUp } from "react-icons/fa"
import { HiArrowNarrowLeft } from "react-icons/hi"
import { Link } from "react-router-dom"

const newsSources = [
  { value: "cointelegraph", label: "CoinTelegraph" },
  { value: "coindesk", label: "CoinDesk" },
  { value: "cryptoslate", label: "CryptoSlate" },
  { value: "decrypt", label: "Decrypt" }
]

export const DetailedNewsPage = () => {
  const [source, setSource] = useState<string>("cointelegraph")
  const [category, setCategory] = useState<string>("cryptocurrency")
  const [newsList, setNewsList] = useState<NewsArticle[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [page, setPage] = useState(1)

  const {
    data: newsData,
    isLoading,
    isFetching
  } = useGetNewsQuery({
    source,
    category,
    page,
    pageSize: 12
  })

  useEffect(() => {
    if (newsData?.articles) {
      if (page === 1) {
        setNewsList(newsData.articles)
      } else {
        setNewsList((prev) => [...prev, ...newsData.articles])
      }
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

  const changeNewsCategory = (selected: OptionType | null) => {
    setCategory(selected ? selected.value.toLowerCase() : "cryptocurrency")
    setPage(1)
  }

  const changeNewsSource = (selected: OptionType | null) => {
    setSource(selected ? selected.value : "cointelegraph")
    setPage(1)
  }

  if (!newsList?.length || isLoading)
    return (
      <div className="py-4 flex flex-col h-full w-full px-4">
        <div className="flex w-full items-center">
          <Link to="/" className="action-button">
            <HiArrowNarrowLeft className="w-7 h-7" />
          </Link>
          <h1 className="text-xl text-center w-full">Detailed News</h1>
        </div>
        <div className="flex items-center justify-center min-h-screen w-full">
          <Loader className="h-16 w-16" />
        </div>
      </div>
    )

  return (
    <div className="py-4 px-4">
      <div className="flex justify-center">
        <div className="flex w-full items-center pt-2 pb-8">
          <Link to="/" className="action-button">
            <HiArrowNarrowLeft className="w-7 h-7" />
          </Link>
          <h1 className="text-xl text-center w-full">Detailed News</h1>
        </div>
      </div>
      <div className="py-4 flex flex-col md:flex-row gap-4 px-4">
        <div className="w-full md:w-1/2">
          <label className="block mb-2 text-sm font-medium">Select Source</label>
          <CustomSelect options={newsSources} selected={source} onChange={changeNewsSource} />
        </div>
        <div className="w-full md:w-1/2">
          <label className="block mb-2 text-sm font-medium">Select Category</label>
          <CustomSelect
            options={cryptoNewsCategories}
            selected={category}
            onChange={changeNewsCategory}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 py-4">
        {newsList.map((article) => (
          <NewsPreview
            key={article.url}
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
      {isFetching ? (
        <div className="flex items-center justify-center h-full w-full">
          <Loader className="h-16 w-16" />
        </div>
      ) : (
        newsData?.totalResults &&
        newsData.totalResults > newsList.length && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="main-button px-4 py-2 rounded-md"
            >
              Load More
            </button>
          </div>
        )
      )}
      <button
        onClick={scrollToTop}
        className={cn(
          "main-button transition-all duration-100 ease-out fixed",
          {
            "translate-x-20": !isVisible
          },
          "right-4 bottom-4 px-4 py-4 rounded-full"
        )}
      >
        <FaArrowUp />
      </button>
    </div>
  )
}
