import { Footer, LandingHeader as Header, Hero, SignalsShowcase, Features } from "@/components"

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-dark-main">
      <Header />
      <Hero />
      <Features />
      <SignalsShowcase />
      <Footer />
    </div>
  )
}
