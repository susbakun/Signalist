import { Button } from "@/components/ui/button"
import SignalLogo from "@/assets/antenna.png"
import { Link } from "react-router-dom"

export const LandingHeader = () => {
  return (
    <header className="w-full bg-dark-main/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 animate-fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 group">
            <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <img className="w-8 h-8 object-cover" src={SignalLogo} alt="signalist" />
            </div>
            <span className="text-xl font-bold text-foreground">Signalist</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-12">
            <a
              href="#features"
              className="text-white hover:text-muted-foreground transition-all duration-300 relative group"
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#signals"
              className="text-white hover:text-muted-foreground transition-all duration-300 relative group"
            >
              Signals
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#about"
              className="text-white hover:text-muted-foreground transition-all duration-300 relative group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-3">
            <Link
              className="hover:scale-105 hover:text-white/50 transition-transform duration-300"
              to={"/login"}
            >
              Log in
            </Link>
            <Link
              className="hover:scale-105 hover:text-black/50 
              transition-transform duration-300 bg-dark-link-button px-4 py-2 rounded-lg"
              to={"/register"}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
