export const NewsSubscriptionBox = () => {
  return (
    <div
      className="flex flex-col gap-4 rounded-md bg-white p-4
            dark:bg-gray-800"
    >
      <h4 className="text-xl font-bold">Subscribe to Our Newsletter</h4>
      <p className="text-sm text-white/80">
        Get the latest news and updates delivered to your inbox.
      </p>
      <input
        type="text"
        placeholder="Enter your email"
        className="custom-input w-full pl-4 inline-block rounded-sm"
      />
      <button className="main-button text-sm rounded-xl px-4 py-2">Subscribe</button>
    </div>
  )
}
