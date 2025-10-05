import { HiTrendingUp } from "react-icons/hi"
import {
  HiChatBubbleLeftRight,
  HiEye,
  HiNewspaper,
  HiUsers
} from "react-icons/hi2"
import { Link } from "react-router-dom"

export const Features = () => {
  const cornerFeatures = [
    {
      icon: HiChatBubbleLeftRight,
      title: "Social Trading",
      description: "Share your thoughts, strategies, and connect with a community of crypto traders.",
      gradient: "from-accent to-accent-dark"
    },
    {
      icon: HiEye,
      title: "Crypto Watchlist",
      description: "Track your favorite cryptocurrencies with custom alerts and price monitoring.",
      gradient: "from-accent to-accent-dark"
    },
    {
      icon: HiNewspaper,
      title: "Market News",
      description: "Stay informed with the latest crypto news and market analysis from trusted sources.",
      gradient: "from-accent to-accent-dark"
    },
    {
      icon: HiUsers,
      title: "Community Insights",
      description: "Learn from experienced traders and share your own trading experiences.",
      gradient: "from-accent to-accent-dark"
    }
  ]

  const centerFeature = {
    icon: HiTrendingUp,
    title: "Trading Signals",
    description: "Get actionable trading signals from expert traders with real-time entry and exit points.",
    gradient: "from-accent to-accent-dark"
  }

  return (
    <section id="features" className="py-20 lg:py-32 bg-dark-main">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Everything You Need for
            <span className="block text-dark-link-button animate-pulse-glow">Successful Trading</span>
          </h2>
          <p
            className="text-xl text-muted-foreground animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            Our comprehensive platform combines social trading, expert signals, and powerful tools
            to help you make informed trading decisions.
          </p>
        </div>

        {/* Features Layout - Trading Signals centered with 4 corners around (3x3 grid) */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-4 lg:gap-6 relative">
            {/* Corner features */}
            {cornerFeatures.map((feature, index) => {
              const positions = [
                'md:col-start-1 md:row-start-1',
                'md:col-start-3 md:row-start-1',
                'md:col-start-1 md:row-start-3',
                'md:col-start-3 md:row-start-3',
              ]

              return (
                <div key={feature.title} className={positions[index]}>
                  <div
                    className="group bg-card rounded-xl p-6 shadow-soft hover:shadow-glow transition-all duration-500 border border-border hover:border-accent/40 animate-scale-in hover:scale-105"
                    style={{ animationDelay: `${(index + 1) * 0.1}s` }}
                  >
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-125 group-hover:rotate-6 transition-all duration-300`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-white/50 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              )
            })}

            {/* Center - Trading Signals */}
            <div className="md:col-start-2 md:row-start-2 z-10">
              <div className="group bg-card rounded-2xl p-8 shadow-glow hover:shadow-glow transition-all duration-500 border-2 border-accent/40 hover:border-accent animate-fade-in hover:scale-105 max-w-md mx-auto">
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${centerFeature.gradient} flex items-center justify-center mb-4 mx-auto group-hover:scale-125 group-hover:rotate-12 transition-all duration-300`}>
                    <centerFeature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-white/50 transition-colors duration-300">
                    {centerFeature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{centerFeature.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Signal Evaluation Section */}
        <div className="mt-20 animate-fade-in">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">
              How does our <span className="block text-dark-link-button animate-pulse-glow">Signal Evaluation Work?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              At Signalist, we don't just share trading signals – we measure their reliability.<br />
              Here's how our evaluation works:
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Data Collection",
                description: "Every signal is stored with key details: entry, targets, stop-loss, time, and coin."
              },
              {
                step: "02",
                title: "Performance Tracking",
                description: "We follow each signal over time to see how it performs in real market conditions."
              },
              {
                step: "03",
                title: "Accuracy Scoring",
                description: "Using custom models, we calculate hit rates, risk-to-reward ratios, and overall reliability."
              },
              {
                step: "04",
                title: "Transparent Reports",
                description: "You can see exactly how signals performed in the past, so you know what to expect."
              }
            ].map((item, index) => (
              <div
                key={index}
                className="group bg-card rounded-xl p-6 shadow-soft hover:shadow-glow transition-all duration-500 border border-border hover:border-accent/40 animate-scale-in hover:scale-105"
                style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
              >
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-accent to-accent-dark flex items-center justify-center mb-4 mx-auto group-hover:scale-125 transition-all duration-300">
                    <span className="text-white font-bold text-sm">{item.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-white/50 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <p className="text-lg text-white font-semibold">
              This way, you don't just rely on hype — you rely on proven data.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 animate-fade-in">
          <div className="bg-card rounded-2xl p-8 lg:p-12 text-white border border-accent/20 hover:border-accent/40 transition-all duration-500 hover:shadow-glow">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4 animate-slide-up">
              Ready to Start Your Trading Journey?
            </h3>
            <p
              className="text-white/80 mb-6 max-w-2xl mx-auto animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Join thousands of traders who are already using our platform to make smarter trading
              decisions.
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in"
              style={{ animationDelay: "0.4s" }}
            >
              <Link className="bg-accent text-white hover:bg-accent-dark font-semibold py-3 px-8
              rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-medium"
                to="/login"
              >
                Start Free Trial
              </Link>
              <button className="border-2 border-accent/40 text-white hover:bg-accent/10 py-3 px-8
              rounded-lg transition-all duration-300 hover:scale-105">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}