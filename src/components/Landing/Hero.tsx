import { Button } from "@/components/ui/button"
import { HiArrowRight, HiPlay } from "react-icons/hi2"
import tradingMockup from "@/assets/trading-mockup.jpeg"
import { useNavigate } from "react-router-dom"

export const Hero = () => {
  const navigate = useNavigate()

  return (
    <section className="relative bg-gradient-hero text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent)] opacity-50"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight animate-slide-up">
                  Crypto Trading
                  <span className="block text-dark-link-button animate-pulse-glow">Signals & Social</span>
                  <span className="block">Platform</span>
                </h1>
                <p
                  className="text-xl lg:text-2xl text-white/80 leading-relaxed max-w-xl animate-fade-in"
                  style={{ animationDelay: "0.3s" }}
                >
                  Share trading signals, connect with traders, track your watchlist, and stay
                  updated with the latest crypto news—all in one powerful platform.
                </p>
              </div>

              <div
                className="flex flex-col sm:flex-row gap-4 animate-scale-in"
                style={{ animationDelay: "0.6s" }}
              >
                <Button
                  variant="hero"
                  size="lg"
                  className="group hover:scale-105 transition-all duration-300"
                  onClick={() => navigate("/login")}
                >
                  Start Trading Now
                  <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline-white"
                  size="lg"
                  className="group hover:scale-105 transition-all duration-300"
                >
                  <HiPlay className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative animate-scale-in" style={{ animationDelay: "1.2s" }}>
              <div className="relative z-10 rounded-lg overflow-hidden shadow-strong hover:shadow-glow transition-all duration-500">
                <img
                  src={tradingMockup}
                  alt="Signalist trading signals dashboard showing cryptocurrency charts and market data"
                  className="w-full h-auto hover:scale-105 transition-transform duration-700"
                />
              </div>
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-success/20 rounded-full blur-xl animate-float"></div>
              <div
                className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/20 rounded-full blur-xl animate-float"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div>
        <svg viewBox="0 0 1200 120" fill="none" className="w-full h-auto">
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            fill="white"
            opacity="0.25"
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            fill="white"
            opacity="0.5"
          />
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  )
}
