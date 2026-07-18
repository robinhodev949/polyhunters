"use client";

import { ChevronRight, BookOpen, Terminal, Upload, Wallet, Zap, Code, ExternalLink } from "lucide-react";
import Link from "next/link";

const sections = [
    {
        id: "getting-started",
        icon: <Zap size={22} color="#165DFC" />,
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
        icon: <Upload size={22} color="#165DFC" />,
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
        icon: <Terminal size={22} color="#165DFC" />,
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
        icon: <Code size={22} color="#165DFC" />,
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
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#165DFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
        title: "Ecosystem Roadmap",
        content: [
            "**Interactive Badges** — Earn platform achievements on profiles like *Genesis Hunter*, *Elite Builder*, and *Escrow Pioneer*.",
            "**USDC Escrow Contract** — Active rental escrow locks deposits and automates payouts natively on Robinhood Chain L2.",
            "**Telegram Notification Bot** — Link your EVM wallet, check agent P&L, and send `/stop` commands directly from Telegram.",
            "**Multi-Asset Support** — Pay for agent rentals using both USDC and our native utility token.",
        ]
    },
];

export default function DocsPage() {
    return (
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "100px 24px 80px", color: "#111111", background: "#FAFAFA" }}>

            {/* Header */}
            <div style={{ marginBottom: "60px" }}>
                <h1 style={{ fontSize: "2.8rem", fontWeight: 700, color: "#111111", margin: "0 0 16px 0", fontFamily: "Outfit, sans-serif" }}>
                    <BookOpen size={28} style={{ verticalAlign: "middle", marginRight: "12px", color: "#165DFC" }} />
                    Documentation
                </h1>
                <p style={{ color: "#6B6B6B", fontSize: "1.1rem", margin: 0, fontWeight: 300 }}>
                    Everything you need to rent, list, and manage trading agents on PolyHunt.
                </p>
            </div>

            {/* Quick Action Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", marginBottom: "60px" }}>
                <Link href="/marketplace" style={{ textDecoration: "none" }}>
                    <div style={{ background: "#FFFFFF", border: "1px solid #E8E8E8", borderRadius: "12px", padding: "24px", cursor: "pointer", transition: "border-color 0.2s" }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = "#165DFC")}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = "#E8E8E8")}>
                        <div style={{ color: "#165DFC", marginBottom: "12px" }}><Zap size={20} /></div>
                        <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#111111", margin: "0 0 6px 0" }}>Rent an Agent</h3>
                        <p style={{ color: "#6B6B6B", fontSize: "0.9rem", margin: 0 }}>Browse the marketplace and deploy in seconds</p>
                    </div>
                </Link>
                <Link href="/submit" style={{ textDecoration: "none" }}>
                    <div style={{ background: "#FFFFFF", border: "1px solid #E8E8E8", borderRadius: "12px", padding: "24px", cursor: "pointer", transition: "border-color 0.2s" }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = "#165DFC")}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = "#E8E8E8")}>
                        <div style={{ color: "#165DFC", marginBottom: "12px" }}><Upload size={20} /></div>
                        <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#111111", margin: "0 0 6px 0" }}>List Your Agent</h3>
                        <p style={{ color: "#6B6B6B", fontSize: "0.9rem", margin: 0 }}>Earn USDC by listing your trading agent</p>
                    </div>
                </Link>
                <Link href="/dashboard" style={{ textDecoration: "none" }}>
                    <div style={{ background: "#FFFFFF", border: "1px solid #E8E8E8", borderRadius: "12px", padding: "24px", cursor: "pointer", transition: "border-color 0.2s" }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = "#165DFC")}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = "#E8E8E8")}>
                        <div style={{ color: "#165DFC", marginBottom: "12px" }}><Wallet size={20} /></div>
                        <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#111111", margin: "0 0 6px 0" }}>Your Dashboard</h3>
                        <p style={{ color: "#6B6B6B", fontSize: "0.9rem", margin: 0 }}>Monitor live trades and manage your rentals</p>
                    </div>
                </Link>
            </div>

            {/* Pluggable Market Integration Section for Builders */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E8E8E8", borderRadius: "16px", padding: "32px", marginBottom: "40px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                    <Terminal size={22} color="#165DFC" />
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#111111", margin: 0 }}>Adding a new PredictionMarketSource</h2>
                </div>
                <p style={{ color: "#6B6B6B", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "16px" }}>
                    To add support for a new prediction market type (e.g. Kalshi, Manifold, or custom contracts), implement the pluggable registry interface in your agent index module:
                </p>
                <pre style={{ background: "#FAFAFA", padding: "16px", borderRadius: "8px", overflowX: "auto", fontSize: "0.85rem", color: "#111111", lineHeight: 1.5, fontFamily: "monospace" }}>
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
                
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "24px", borderTop: "1px solid #E8E8E8", paddingTop: "20px" }}>
                    <a href="https://docs.polymarket.com/builders/overview" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#165DFC", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600 }}>
                        Polymarket Builder Docs <ExternalLink size={14} />
                    </a>
                    <span style={{ color: "#E8E8E8" }}>|</span>
                    <a href="https://docs.robinhood.com/chain/" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#165DFC", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600 }}>
                        Robinhood Chain L2 Docs <ExternalLink size={14} />
                    </a>
                </div>
            </div>

            {/* Documentation Sections */}
            <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
                {sections.map((section) => (
                    <div key={section.id} style={{ background: "#FFFFFF", border: "1px solid #E8E8E8", borderRadius: "16px", padding: "32px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                            {section.icon}
                            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#111111", margin: 0 }}>{section.title}</h2>
                        </div>
                        <ol style={{ margin: 0, padding: "0 0 0 20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                            {section.content.map((step, i) => (
                                <li key={i} style={{ color: "#6B6B6B", fontSize: "0.95rem", lineHeight: 1.6 }}
                                    dangerouslySetInnerHTML={{ __html: step.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#111111">$1</strong>').replace(/`(.*?)`/g, '<code style="background:#FAFAFA;padding:2px 6px;border-radius:4px;font-family:monospace;font-size:0.85em;color:#165DFC">$1</code>') }}
                                />
                            ))}
                        </ol>
                    </div>
                ))}
            </div>

        </div>
    );
}
