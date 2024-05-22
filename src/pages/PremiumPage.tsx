export const PremiumPage = () => {
  return (
    <div
      className="flex flex-col items-center justify-center
      min-h-screen bg-primary-main dark:bg-dark-main font-sans
      dark:text-gray-100"
    >
      <div className="bg-gray-200 dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-lg">
        <h1 className="text-2xl font-bold mb-4 text-gray-600 dark:text-white">Access Denied</h1>
        <p className="text-lg text-gray-500/80 dark:text-gray-400 mb-4">
          You need to authorize to have a premium plan.
        </p>
        <button
          className="bg-primary-link-button dark:bg-dark-link-button hover:opacity-70
        text-white  py-2 px-4 rounded transition duration-300"
        >
          Authorize
        </button>
      </div>
    </div>
  )
}
