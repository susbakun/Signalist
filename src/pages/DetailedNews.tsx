import { CustomSelect, Loader } from "@/components";
import { NewsPreview } from "@/components/News/NewsPreview";
import { useGetCryptoNewsQuery } from "@/services/cryptoNewsApi";
import { cryptoNewsCategories, cryptoNewsSources } from "@/shared/constants"; // Import the lists
import { NewsItem } from "@/shared/models";
import { OptionType } from "@/shared/types";
import { cn } from "@/utils";
import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { Link } from "react-router-dom";

export const DetailedNewsPage = () => {
  const [source, setSource] = useState<string>("coinotag");
  const [newsCategory, setNewsCategory] = useState<string>("Cryptocurrency");
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const { data: cryptoNews, isLoading, isFetching } = useGetCryptoNewsQuery({
    newsCategory: newsCategory,
    feeds: source,
    page: 1,
  });

  useEffect(() => {
    if (cryptoNews) {
       setNewsList(cryptoNews.Data);
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const changeNewsCategory = (selected: OptionType | null) => {
    setNewsCategory(selected ? selected.value : "")
  }

  const changeNewsSource = (selected: OptionType | null) => {
    setSource(selected ? selected.value : "")
  }

  if (!newsList.length || isLoading || isFetching)
    return (
      <div className="py-4 flex flex-col h-full w-full px-4">
        <div className="flex w-full items-center">
          <Link to="/" className="action-button">
            <HiArrowNarrowLeft className="w-7 h-7" />
          </Link>
          <h1 className="text-xl text-center w-full">Detailed News</h1>
        </div>
        <div className="flex items-center justify-center h-full">
          <Loader />
        </div>
      </div>
    );

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
      <div className="py-4 flex gap-4 px-4">
        <div className="w-1/2">
          <label className="block mb-2 text-sm font-medium">Select Source</label>
          <CustomSelect
            options={cryptoNewsSources}
            selected={source}
            onChange={changeNewsSource}
           />
        
        </div>
        <div className="w-1/2">
          <label className="block mb-2 text-sm font-medium">Select Category</label>
          <CustomSelect
            options={cryptoNewsCategories}
            selected={newsCategory}
            onChange={changeNewsCategory}
           />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 py-4">
        {newsList.map((news) => (
          <NewsPreview isCompatMode key={news.title} {...news} />
        ))}
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
    </div>
  );
};
