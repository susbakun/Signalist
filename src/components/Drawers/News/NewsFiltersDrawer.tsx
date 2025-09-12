import { NewsMarketSelectionBox } from "@/components/News/NewsMarketSelectionBox"
import {
  NewsSourcesSelectionBox,
  NewsSubscriptionBox,
  NewsTopicsBox,
  NewsTopContributorsBox
} from "@/components"
import { Drawer } from "flowbite-react"
import { FaFilter } from "react-icons/fa"

type NewsFiltersDrawerProps = {
  isOpen: boolean
  closeDrawer: () => void
}

export const NewsFiltersDrawer = ({ isOpen, closeDrawer }: NewsFiltersDrawerProps) => {
  return (
    <Drawer
      className="w-full sm:w-[420px] custom-drawer overflow-y-auto"
      open={isOpen}
      onClose={closeDrawer}
      position="right"
    >
      <Drawer.Header titleIcon={FaFilter} title="News Filters" />
      <Drawer.Items>
        <div className="h-full flex-col gap-6 mb-16">
          <NewsTopicsBox />
          <hr className="opacity-50" />
          <NewsMarketSelectionBox />
          <hr className="opacity-50" />
          <NewsSourcesSelectionBox />
          <hr className="opacity-50" />
          <NewsTopContributorsBox />
          <hr className="opacity-50" />
          <NewsSubscriptionBox />
        </div>
      </Drawer.Items>
    </Drawer>
  )
}
