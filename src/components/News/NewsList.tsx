import { Loader, NewsPreview } from "@/components";
import { useGetCryptoNewsQuery } from "@/services/cryptoNewsApi";
import { NewsItem } from "@/shared/models";
import { cn, isDarkMode } from "@/utils";
import { uniqBy } from "lodash";
import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { HiArrowNarrowRight } from "react-icons/hi";
import { IoChevronDownOutline } from "react-icons/io5";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Link } from "react-router-dom";

export const NewsList = () => {
  const [newsPage, setNewsPage] = useState(1);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const { data: cryptoNews, isLoading, isFetching } = useGetCryptoNewsQuery({
    newsCategory: "Cryptocurrency",
    page: newsPage,
  });

  const handleLoadMore = () => {
    setNewsPage((prevPage) => prevPage + 1);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    console.log('cryptoNews:', cryptoNews); // Debug log
    const newsData = Array.isArray(cryptoNews?.Data) ? cryptoNews.Data : [];
    if (newsData.length > 0) {
      setNewsList((prev) => uniqBy([...prev, ...newsData], "title"));
    }
  }, [cryptoNews]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsVisible(scrollTop > window.innerHeight * 0.8);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
    );

  return (
    <section>
      <div className="flex justify-between px-2">
        <h4 className="text-xl mb-4">News</h4>
        <Link className="action-button" to="/news">
          <HiArrowNarrowRight className="w-7 h-7" />
        </Link>
      </div>
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
            className="flex items-center gap-1 main-button text-sm rounded-2xl px-2 py-2"
          >
            <IoChevronDownOutline />
            Show More
          </button>
        )}
      </div>
      <button
        onClick={scrollToTop}
        className={cn(
          "main-button transition-all duration-100 ease-out fixed",
          {
            "translate-x-20": !isVisible,
          },
          "right-4 bottom-4 px-4 py-4 rounded-full"
        )}
      >
        <FaArrowUp />
      </button>
    </section>
  );
};
