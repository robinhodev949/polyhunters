"use client";

import { BookOpen, Terminal, Upload, Wallet, Zap, Code, ExternalLink } from "lucide-react";
import Link from "next/link";

const sections = [
    {
        id: "getting-started",
        icon: <Zap size={22} className="text-brand" />,
        title: "Getting Started",
        content: [
            "Connect your EVM wallet (MetaMask, Rabby, Phantom) using the button in the top-right corner.",
            "Browse the Agent Marketplace to find a prediction agent built for prediction markets.",
            "Click **Install & Run**, deposit USDC via the secure direct payment button to the PolyHunt escrow, and your agent activates immediately. No server setup.",
            "Monitor your agent's live trading logs directly from your Dashboard.",
        ]
    },
    {
        id: "list-your-agent",
        icon: <Upload size={22} className="text-brand" />,
        title: "How to List Your Agent",
        content: [
            "Package your agent as a Docker image and push to a public registry (e.g. Docker Hub). It must connect to prediction markets using their official APIs.",
            "Connect your EVM wallet — this will be your agent owner identity on PolyHunt.",
            "Go to **Submit Agent** from the navigation. Fill in: Agent Name, Tagline, Description, USDC/day price, GitHub URL, and Docker image URL.",
            "Select which prediction markets (e.g. Polymarket, Kalshi) your agent supports trading on.",
            "Rent payouts in USDC are sent automatically to your connected owner wallet (98%) upon lease expiration, with 2% to PolyHunt.",
        ]
    },
    {
        id: "openclaw-setup",
        icon: <Terminal size={22} className="text-brand" />,
        title: "OpenClaw Agent Setup",
        content: [
            "Install the OpenClaw SDK: `npm install @openclaw/sdk`",
            "Initialize your agent config: `npx openclaw init`",
            "Define your strategy in `agent.config.ts` — set markets, risk parameters, and data sources.",
            "Build and push your Docker image: `docker build -t yourusername/agent-name:latest . && docker push yourusername/agent-name:latest`",
            "Paste your Docker image URL in the PolyHunt submission form.",
        ]
    },
    {
        id: "api",
        icon: <Code size={22} className="text-brand" />,
        title: "API Reference",
        content: [
            "`GET /api/agents` — Returns all active agents in the marketplace.",
            "`POST /api/agent/create` — Create a new agent listing. Requires: `name`, `tagline`, `pricePerDay`, `ownerWallet`, `marketSourceIds`.",
            "`POST /api/rent/initiate` — Initiate a rental lease. Requires: `agentId`, `renterWallet`, `days`.",
            "`POST /api/rent/verify` — Verify USDC deposit transaction. Requires: `rentalId`, `txSignature` (EVM tx hash), `renterWallet`.",
            "All write API endpoints return JSON. Authentication is verified via EVM wallet signature verification.",
        ]
    },
    {
        id: "roadmap",
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
        title: "Roadmap — Coming Soon",
        content: [
            "**Telegram Bot** — @polyhunt_bot: Link your EVM wallet, check agent P&L, and send `/stop` commands from Telegram.",
            "**Arbitrum / Orbit native token** — Pay for agent rentals with our upcoming platform token in addition to USDC and ETH.",
            "**On-chain Upvotes** — Record upvotes on-chain so the most successful agents naturally rise to the top of the feed.",
            "**Agent Analytics Dashboard** — Full P&L history, market win-rate, and ROI breakdown per agent.",
        ]
    },
];

export default function DocsPage() {
    return (
        <div className="max-w-[900px] mx-auto py-25 px-6 pb-20 text-text-primary bg-bg-secondary">

            {/* Header */}
            <div className="mb-15">
                <h1 className="text-[2.8rem] font-bold m-0 mb-4 font-sans tracking-tight flex items-center gap-3">
                    <BookOpen size={28} className="text-brand" />
                    Documentation
                </h1>
                <p className="text-text-secondary text-[1.1rem] m-0 font-light">
                    Everything you need to rent, list, and manage trading agents on PolyHunt.
                </p>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4 mb-15">
                <Link href="/marketplace" className="no-underline">
                    <div className="bg-bg-secondary border border-border rounded-xl p-6 cursor-pointer transition-colors duration-200 hover:border-brand">
                        <div className="text-brand mb-3"><Zap size={20} /></div>
                        <h3 className="text-[1rem] font-semibold text-text-primary m-0 mb-1.5">Rent an Agent</h3>
                        <p className="text-text-secondary text-[0.9rem] m-0">Browse the marketplace and deploy in seconds</p>
                    </div>
                </Link>
                <Link href="/submit" className="no-underline">
                    <div className="bg-bg-secondary border border-border rounded-xl p-6 cursor-pointer transition-colors duration-200 hover:border-brand">
                        <div className="text-brand mb-3"><Upload size={20} /></div>
                        <h3 className="text-[1rem] font-semibold text-text-primary m-0 mb-1.5">List Your Agent</h3>
                        <p className="text-text-secondary text-[0.9rem] m-0">Earn USDC by listing your trading agent</p>
                    </div>
                </Link>
                <Link href="/dashboard" className="no-underline">
                    <div className="bg-bg-secondary border border-border rounded-xl p-6 cursor-pointer transition-colors duration-200 hover:border-brand">
                        <div className="text-brand mb-3"><Wallet size={20} /></div>
                        <h3 className="text-[1rem] font-semibold text-text-primary m-0 mb-1.5">Your Dashboard</h3>
                        <p className="text-text-secondary text-[0.9rem] m-0">Monitor live trades and manage your rentals</p>
                    </div>
                </Link>
            </div>

            {/* Pluggable Market Integration Section for Builders */}
            <div className="bg-bg-secondary border border-border rounded-2xl p-8 mb-10">
                <div className="flex items-center gap-3 mb-5">
                    <Terminal size={22} className="text-brand" />
                    <h2 className="text-[1.25rem] font-bold text-text-primary m-0">Adding a new PredictionMarketSource</h2>
                </div>
                <p className="text-text-secondary text-[0.95rem] leading-relaxed mb-4">
                    To add support for a new prediction market type (e.g. Kalshi, Manifold, or custom contracts), implement the pluggable registry interface in your agent index module:
                </p>
                <pre className="bg-bg-primary p-4 rounded-lg overflow-x-auto text-[0.85rem] text-text-primary leading-relaxed font-mono">
{`import { PredictionMarketSource, PredictionMarket } from "@/lib/markets/types";
import { registerMarketSource } from "@/lib/markets/registry";
 
export const CustomMarketSource: PredictionMarketSource = {
  id: "custom-market",
  name: "Custom Market Protocol",
  logoUrl: "/logos/custom.svg",
  
  async fetchMarkets(): Promise<PredictionMarket[]> {
    const data = await fetch("https://api.custom-market.com/v1/markets");
    const json = await data.json();
    return json.map((m: any) => ({
      id: m.id,
      sourceId: "custom-market",
      question: m.title,
      outcomes: m.outcomes.map((o: any) => ({ name: o.label, price: o.price })),
      volume: m.tradeVolume,
      liquidity: m.poolBalance,
      endDate: m.resolutionTime,
      url: \`https://custom-market.com/markets/\${m.slug}\`
    }));
  },
 
  async getMarket(marketId: string) {
    // ... fetch individual market data ...
    return null;
  }
};
 
// Register source with the pluggable engine registry
registerMarketSource(CustomMarketSource);`}
                </pre>
                
                <div className="flex flex-wrap gap-4 mt-6 border-t border-border pt-5">
                    <a href="https://docs.polymarket.com/builders/overview" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-brand hover:text-brand-dark no-underline text-[0.85rem] font-semibold">
                        Polymarket Builder Docs <ExternalLink size={14} />
                    </a>
                    <span className="text-text-muted">|</span>
                    <a href="https://docs.robinhood.com/chain/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-brand hover:text-brand-dark no-underline text-[0.85rem] font-semibold">
                        Robinhood Chain L2 Docs <ExternalLink size={14} />
                    </a>
                </div>
            </div>

            {/* Documentation Sections */}
            <div className="flex flex-col gap-10">
                {sections.map((section) => (
                    <div key={section.id} className="bg-bg-secondary border border-border rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-5">
                            {section.icon}
                            <h2 className="text-[1.25rem] font-bold text-text-primary m-0">{section.title}</h2>
                        </div>
                        <ol className="m-0 pl-5 flex flex-col gap-3">
                            {section.content.map((step, i) => (
                                <li key={i} className="text-text-secondary text-[0.95rem] leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: step.replace(/\*\*(.*?)\*\*/g, '<strong class="text-text-primary">$1</strong>').replace(/`(.*?)`/g, '<code class="bg-bg-primary px-1.5 py-0.5 rounded font-mono text-[0.85em] text-brand">$1</code>') }}
                                />
                            ))}
                        </ol>
                    </div>
                ))}
            </div>

        </div>
    );
}
