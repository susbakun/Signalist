import { HiTrendingUp, HiMail } from "react-icons/hi"
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa"
import SignalLogo from "@/assets/antenna.png"



export const Footer = () => {
  return (
    <footer id="about" className="bg-dark-link-button text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
                  <img className="w-8 h-8 object-cover" src={SignalLogo} alt="signalist" />
                </div>
                <span className="text-xl font-bold">Signalist</span>
              </div>
              <p className="text-white/80 mb-6 max-w-sm">
                The ultimate platform for crypto trading signals, social trading, and market
                analysis. Join thousands of successful traders today.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
                >
                  <FaTwitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
                >
                  <FaGithub className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
                >
                  <FaLinkedin className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
                >
                  <HiMail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Platform */}
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-3 text-white/80">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Trading Signals
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Social Feed
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Watchlist
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Market News
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Analytics
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-3 text-white/80">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Getting Started
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Trading Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    API Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-3 text-white/80">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Partners
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-8 border-t border-primary-light">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-white/80 text-sm">
              © 2025 Signalist. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-white/80">
              <a href="#" className="hover:text-accent transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
