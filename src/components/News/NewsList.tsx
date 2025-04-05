import { Loader, NewsPreview } from "@/components"
import { useGetNewsQuery } from "@/services/newsApi"
import { NewsArticle } from "@/shared/models"
import { cn, isDarkMode } from "@/utils"
import { uniqBy } from "lodash"
import { useEffect, useState } from "react"
import { FaArrowUp } from "react-icons/fa"
import { HiArrowNarrowRight } from "react-icons/hi"
import { IoChevronDownOutline } from "react-icons/io5"
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import { Link } from "react-router-dom"

export const NewsList = () => {
  const [page, setPage] = useState(1)
  const [newsList, setNewsList] = useState<NewsArticle[]>([])
  const [isVisible, setIsVisible] = useState(false)

  const {
    data: newsData,
    isLoading,
    isFetching
  } = useGetNewsQuery({
    category: "cryptocurrency",
    page,
    pageSize: 5
  })

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  useEffect(() => {
    if (newsData?.articles) {
      setNewsList((prev) => {
        const combined = [...prev, ...newsData.articles]
        return uniqBy(combined, "url")
      })
    }
  }, [newsData])

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

  if (!newsList?.length || isLoading)
    return (
      <>
        <h4 className="text-xl mb-4">News</h4>
        <SkeletonTheme
          baseColor={isDarkMode() ? "rgb(31 41 55)" : "rgb(255 255 255)"}
          highlightColor={isDarkMode() ? "#4a4a5a" : "#ececec"}
        >
          <p>
            <Skeleton className="mb-4" height={140} borderRadius={6} count={5} />
          </p>
        </SkeletonTheme>
      </>
    )

  return (
    <section>
      <div className="flex justify-between px-2">
        <h4 className="text-xl mb-4">News</h4>
        <Link className="action-button" to="/news">
          <HiArrowNarrowRight className="w-7 h-7" />
        </Link>
      </div>
      <ul className="flex flex-col gap-8 md:gap-4">
        {newsList.map((article) => (
          <NewsPreview
            key={article.url}
            title={article.title}
            url={article.url}
            imageurl={article.urlToImage}
            body={article.description}
            published_on={new Date(article.publishedAt).getTime() / 1000}
            source={article.source.name}
          />
        ))}
      </ul>
      <div className="flex justify-center mt-8">
        {isFetching ? (
          <Loader />
        ) : (
          newsData?.totalResults &&
          newsData.totalResults > newsList.length && (
            <button
              onClick={handleLoadMore}
              className="flex items-center gap-1 main-button text-sm rounded-2xl px-2 py-2"
            >
              <IoChevronDownOutline />
              Show More
            </button>
          )
        )}
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
  )
}
