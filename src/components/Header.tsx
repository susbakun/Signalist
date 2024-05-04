import { Link } from 'react-router-dom'
import SignalLogo from '../assets/antenna.png'

export const Header = () => {
  return (
    <div className="flex justify-between items-center">
      <Link to="/" className="flex gap-2 mb-2 items-center">
        <img className="w-8 h-8 object-cover" src={SignalLogo} alt="signalist" />
        <h3 className="text-2xl">Signalist</h3>
      </Link>
    </div>
  )
}
