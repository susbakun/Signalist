export const NewsListTopFilters = () => {
  return (
    <ul className="flex items-center gap-4 text-sm md:text-base cursor-pointer">
      <li
        className="text-white border-b-2 border-white/80
       border-spacing-2 font-bold hover:text-white/80
       hover:border-white/80 transition-all duration-100 ease-out"
      >
        All
      </li>
      <li
        className="text-white hover:text-white/80
       transition-all duration-100 ease-out"
      >
        Crypto News
      </li>
      <li
        className="text-white hover:text-white/80
       transition-all duration-100 ease-out"
      >
        Forex News
      </li>
      <li
        className="text-white hover:text-white/80
        transition-all duration-100 ease-out"
      >
        Platform Updates
      </li>
    </ul>
  )
}
