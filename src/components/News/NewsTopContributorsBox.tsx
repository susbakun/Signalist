export const NewsTopContributorsBox = () => {
  return (
    <div
      className="flex flex-col gap-4 rounded-md bg-white p-4
            dark:bg-gray-800"
    >
      <h4 className="text-xl font-bold">Top Contributors</h4>
      <ul className="flex flex-wrap gap-4">
        <li
          className="text-sm text-white/80 bg-gray-600 rounded-md px-2 py-1
               hover:bg-gray-500 transition-all duration-100 ease-out"
        >
          <a href="#">Ali Daraparesh</a>
        </li>
        <li
          className="text-sm text-white/80 bg-gray-600 rounded-md px-2 py-1
               hover:bg-gray-500 transition-all duration-100 ease-out"
        >
          <a href="#">Ilia Staki</a>
        </li>
        <li
          className="text-sm text-white/80 bg-gray-600 rounded-md px-2 py-1
               hover:bg-gray-500 transition-all duration-100 ease-out"
        >
          <a href="#">Abolfazl Farzannejad</a>
        </li>
        <li
          className="text-sm text-white/80 bg-gray-600 rounded-md px-2 py-1
               hover:bg-gray-500 transition-all duration-100 ease-out"
        >
          <a href="#">Susbakun</a>
        </li>
      </ul>
    </div>
  )
}
