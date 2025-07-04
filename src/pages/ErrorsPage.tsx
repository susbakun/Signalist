function ErrorsPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Oops!</h1>
        <h2 className="text-2xl text-gray-700 dark:text-gray-300 mb-6">Something went wrong</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Don't worry, we're working on fixing the issue. Please try refreshing the page.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-primary-link-button
        dark:bg-dark-link-button text-white rounded-lg hover:opacity-90 transition-all"
        >
          Refresh Page
        </button>
      </div>
    </div>
  )
}

export default ErrorsPage
