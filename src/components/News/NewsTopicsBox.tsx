export const NewsTopicsBox = () => {
  return (
    <div
      className="flex flex-col gap-4 rounded-md bg-white p-4
            dark:bg-gray-800"
    >
      <h4 className="text-xl font-bold">Topics</h4>
      <ul className="flex flex-wrap gap-4">
        <li
          className="text-sm text-white/80 bg-gray-600 rounded-md px-2 py-1
               hover:bg-gray-500 transition-all duration-100 ease-out"
        >
          <a href="#">All Tickers</a>
        </li>
        <li
          className="text-sm text-white/80 bg-gray-600 rounded-md px-2 py-1
               hover:bg-gray-500 transition-all duration-100 ease-out"
        >
          <a href="#">Positive</a>
        </li>
        <li
          className="text-sm text-white/80 bg-gray-600 rounded-md px-2 py-1
               hover:bg-gray-500 transition-all duration-100 ease-out"
        >
          <a href="#">Negative</a>
        </li>
        <li
          className="text-sm text-white/80 bg-gray-600 rounded-md px-2 py-1
               hover:bg-gray-500 transition-all duration-100 ease-out"
        >
          <a href="#">Technical Analysis</a>
        </li>
        <li
          className="text-sm text-white/80 bg-gray-600 rounded-md px-2 py-1
               hover:bg-gray-500 transition-all duration-100 ease-out"
        >
          <a href="#">Fundamental Analysis</a>
        </li>
        <li
          className="text-sm text-white/80 bg-gray-600 rounded-md px-2 py-1
               hover:bg-gray-500 transition-all duration-100 ease-out"
        >
          <a href="#">NFT</a>
        </li>
      </ul>
    </div>
  )
}
