import { isDarkMode } from "@/utils"
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"

export const NewsSkeletonLoader = () => {
  return (
    <SkeletonTheme
      baseColor={isDarkMode() ? "rgb(31 41 55)" : "rgb(255 255 255)"}
      highlightColor={isDarkMode() ? "#828282" : "#ececec"}
    >
      <section className="w-full overflow-hidden pb-20">
        {" "}
        {/* Added bottom padding for navbar space */}
        <div className="flex justify-between px-2">
          <h4 className="text-xl mb-3">News</h4>
        </div>
        {/* Featured News Skeleton - Only show on desktop */}
        <div className="block relative overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700 mb-4">
          <div className="h-[400px] md:h-[450px] lg:h-[500px] w-full rounded-lg">
            <Skeleton className="h-full w-full -translate-y-1" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>
        {/* Top Filters and Search Bar Skeleton */}
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-6 w-full mb-3 mt-4 lg:mt-8">
          <div className="w-full lg:w-[70%] flex flex-col gap-3 lg:gap-6">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              <Skeleton className="h-8 lg:h-10 w-18 lg:w-24 rounded-md flex-shrink-0" />
              <Skeleton className="h-8 lg:h-10 w-16 lg:w-20 rounded-md flex-shrink-0" />
              <Skeleton className="h-8 lg:h-10 w-20 lg:w-28 rounded-md flex-shrink-0" />
              <Skeleton className="h-8 lg:h-10 w-24 lg:w-32 rounded-md flex-shrink-0" />
            </div>
          </div>
          <div className="w-full lg:w-[30%] h-full flex flex-col gap-3 lg:gap-6">
            <Skeleton className="h-10 lg:h-12 w-full rounded-lg" />
          </div>
        </div>
        {/* Main Content and Sidebar Skeleton */}
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-6 w-full mb-4 mt-4">
          <div className="w-full lg:w-[70%] flex flex-col gap-4 lg:gap-6">
            {/* News List Skeleton - Reduced from 4 to 2 items on mobile */}
            <ul className="flex flex-col gap-4">
              {[1, 2].map((index) => (
                <div
                  key={index}
                  className="w-full flex flex-col md:flex-row rounded-md bg-white dark:bg-gray-800 gap-2 lg:gap-3 overflow-hidden"
                >
                  {/* Image Container */}
                  <div className="w-full md:w-40 lg:w-48 md:flex-shrink-0 p-2 overflow-hidden">
                    <div className="w-full overflow-hidden rounded-md h-[160px] md:h-[140px] lg:h-[180px]">
                      <Skeleton className="w-full h-full rounded-md" />
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="flex flex-col px-2 py-2 w-full justify-between gap-2 lg:gap-3">
                    <div className="flex flex-col gap-1 lg:gap-2">
                      {/* Title */}
                      <Skeleton className="h-4 lg:h-6 w-full lg:w-3/4 mb-1 lg:mb-2" />

                      {/* Description - Only show on larger screens */}
                      <div className="hidden md:block">
                        <Skeleton className="h-3 lg:h-4 w-full mb-1" />
                        <Skeleton className="h-3 lg:h-4 w-2/3 mb-2" />
                      </div>

                      {/* Source, Date, and Sentiment */}
                      <div className="flex flex-wrap items-center gap-1 lg:gap-2">
                        <Skeleton className="h-3 w-14 lg:w-20" />
                        <Skeleton className="h-3 w-16 lg:w-24" />
                        <Skeleton className="h-3 w-10 lg:w-16" />
                      </div>

                      {/* Currency Tags */}
                      <div className="flex flex-wrap gap-1 lg:gap-2 mt-1">
                        <Skeleton className="h-4 lg:h-5 w-8 lg:w-12 rounded-md" />
                        <Skeleton className="h-4 lg:h-5 w-6 lg:w-10 rounded-md" />
                        <Skeleton className="h-4 lg:h-5 w-10 lg:w-14 rounded-md" />
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2 mt-2 lg:mt-auto">
                      <Skeleton className="h-7 lg:h-10 w-18 lg:w-24 rounded-xl" />
                      <Skeleton className="h-7 lg:h-10 w-20 lg:w-28 rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
            </ul>

            {/* Pagination Skeleton */}
            <div className="flex items-center gap-1 lg:gap-2 font-bold justify-center overflow-x-auto scrollbar-hide px-2">
              {[1, 2, 3, 4, 5].map((page) => (
                <Skeleton key={page} className="h-7 lg:h-8 w-7 lg:w-8 rounded-md flex-shrink-0" />
              ))}
            </div>
          </div>

          {/* Sidebar Skeleton - Hidden on mobile, visible on lg+ */}
          <div className="w-full lg:w-[30%] hidden lg:flex flex-col gap-6">
            {/* Topics Box */}
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <Skeleton className="h-6 w-24 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>

            {/* Subscription Box */}
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <Skeleton className="h-6 w-32 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            {/* Market Selection Box */}
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <Skeleton className="h-6 w-28 mb-3" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-full rounded-md" />
                <Skeleton className="h-8 w-full rounded-md" />
                <Skeleton className="h-8 w-full rounded-md" />
              </div>
            </div>

            {/* Sources Selection Box */}
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <Skeleton className="h-6 w-30 mb-3" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-full rounded-md" />
                <Skeleton className="h-6 w-full rounded-md" />
                <Skeleton className="h-6 w-full rounded-md" />
              </div>
            </div>

            {/* Top Contributors Box */}
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <Skeleton className="h-6 w-36 mb-3" />
              <div className="space-y-3">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </SkeletonTheme>
  )
}
