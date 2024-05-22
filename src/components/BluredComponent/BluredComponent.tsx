import { cn, isDarkMode } from '@/utils'
import lightPostPic from './assets/BluedPostLight.png'
import darkPostPic from './assets/BluredPostDark.png'
import darkSignalPic from './assets/BluredSignalDark.png'
import lightSignalPic from './assets/BluredSignalLight.png'

export const BluredSignalComponent = () => {
  return (
    <div className={cn({ 'blur-lg': isDarkMode(), 'blur-md': !isDarkMode() })}>
      <img src={isDarkMode() ? darkSignalPic : lightSignalPic} className="h-[500px] w-full" />
    </div>
  )
}

export const BluredPostComponent = () => {
  return (
    <div className="blur-md">
      <img src={isDarkMode() ? darkPostPic : lightPostPic} className="h-[200px] w-full" />
    </div>
  )
}
