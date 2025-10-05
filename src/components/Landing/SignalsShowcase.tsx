import { Badge } from "@/components/ui/badge"
import { HiTrendingUp, HiTrendingDown, HiClock } from "react-icons/hi"
import { TbTargetArrow } from "react-icons/tb";


export const SignalsShowcase = () => {
  const recentSignals = [
    {
      pair: "BTC/USDT",
      type: "Long",
      entry: "42,850",
      target: "45,200",
      stopLoss: "41,500",
      status: "active",
      profit: "+5.2%",
      time: "2 hours ago",
      trader: "CryptoMaster",
      accuracy: "94%"
    },
    {
      pair: "ETH/USDT",
      type: "Short",
      entry: "2,845",
      target: "2,720",
      stopLoss: "2,920",
      status: "completed",
      profit: "+4.8%",
      time: "5 hours ago",
      trader: "TradeWizard",
      accuracy: "89%"
    },
    {
      pair: "SOL/USDT",
      type: "Long",
      entry: "98.50",
      target: "105.00",
      stopLoss: "94.00",
      status: "active",
      profit: "+2.1%",
      time: "1 hour ago",
      trader: "SolanaKing",
      accuracy: "91%"
    }
  ]

  return (
    <section id="signals" className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Live Trading
            <span className="block text-dark-link-button animate-pulse-glow">Signals Feed</span>
          </h2>
          <p
            className="text-xl text-muted-foreground animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            Follow expert traders and get real-time signals with detailed entry points, targets, and
            risk management.
          </p>
        </div>

        {/* Signals Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {recentSignals.map((signal, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-6 shadow-soft border border-border
              hover:shadow-glow hover:border-accent/40 transition-all duration-500
              animate-scale-in hover:scale-105 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Signal Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-white/50
                   transition-colors duration-300">
                    {signal.pair}
                  </h3>
                  <Badge
                    variant={signal.type === "Long" ? "default" : "destructive"}
                    className="flex items-center space-x-1"
                  >
                    {signal.type === "Long" ? (
                      <HiTrendingUp className="w-3 h-3" />
                    ) : (
                      <HiTrendingDown className="w-3 h-3" />
                    )}
                    <span>{signal.type}</span>
                  </Badge>
                </div>
                <Badge variant={signal.status === "active" ? "secondary" : "default"}>
                  {signal.status}
                </Badge>
              </div>

              {/* Signal Details */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Entry</span>
                  <span className="font-semibold">${signal.entry}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center">
                    <TbTargetArrow className="w-4 h-4 mr-1" />
                    Target
                  </span>
                  <span className="font-semibold text-success">${signal.target}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Stop Loss</span>
                  <span className="font-semibold text-destructive">${signal.stopLoss}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Current P&L</span>
                  <span className="font-semibold text-success">{signal.profit}</span>
                </div>
              </div>

              {/* Trader Info */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-accent rounded-full flex items-center
                     justify-center">
                      <span className="text-white text-xs font-semibold">
                        {signal.trader.charAt(0)}
                      </span>
                    </div>
                    <span className="font-medium">{signal.trader}</span>
                    <Badge variant="outline" className="text-xs">
                      {signal.accuracy}
                    </Badge>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <HiClock className="w-3 h-3 mr-1" />
                    {signal.time}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Performance Stats */}
        <div className="bg-card rounded-xl p-8 shadow-soft border border-border">
          <h3 className="text-xl font-semibold text-foreground mb-6 text-center">
            Platform Performance This Month
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-success mb-1">892</div>
              <div className="text-sm text-muted-foreground">Signals Shared</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-dark-link-button mb-1">87.2%</div>
              <div className="text-sm text-muted-foreground">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning mb-1">+24.8%</div>
              <div className="text-sm text-muted-foreground">Avg. Return</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">15.2K</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
