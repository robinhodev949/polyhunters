"use client";

import Link from "next/link";
import { ArrowRight, Wallet, Shield, CheckCircle, Activity } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-bg-secondary text-text-primary min-h-screen font-sans overflow-x-hidden">

      {/* ── Top Header Variant ── */}
      <div className="landing-top-header max-w-[1200px] mx-auto py-10 px-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
            <img src="/logo.png" alt="PolyHunt Logo" className="w-7 h-7 rounded-sm" />
            <h1 className="text-[1.4rem] font-bold m-0 tracking-tight">PolyHunt</h1>
            <span className="text-[0.65rem] bg-brand/10 border border-brand/20 text-brand py-0.5 px-1.5 rounded-sm font-bold tracking-wider ml-1">BETA</span>
        </div>
        <div className="flex items-center gap-6">
            <Link href="/marketplace" className="text-text-secondary font-medium no-underline text-[0.95rem] hover:text-text-primary transition-colors duration-200">
                Marketplace
            </Link>
            <Link href="/marketplace">
                <button className="bg-brand-lime text-text-primary border-none px-5 py-2.5 rounded-md text-[0.95rem] font-bold cursor-pointer transition-all duration-150 shadow-[0_2px_8px_rgba(204,255,0,0.15)] hover:bg-[#bfe600] hover:-translate-y-0.5">
                    Get Started
                </button>
            </Link>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="bg-bg-secondary border-b border-border relative overflow-hidden">
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(#f0f0f0_1px,transparent_1px),linear-gradient(90deg,#f0f0f0_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none z-0" />

        <div className="relative z-10 max-w-[1200px] mx-auto py-20 px-8 flex flex-col items-center text-center">

          <h1 className="text-[4rem] font-extrabold leading-[1.1] text-text-primary mb-6 font-sans tracking-tight max-w-[900px]">
            The <span className="text-brand">ProductHunt</span> for<br />prediction AI agents.
          </h1>

          <p className="text-[1.2rem] text-text-secondary leading-relaxed mb-12 font-sans font-normal max-w-[700px]">
            Decentralized marketplace for prediction market AI agent rentals, built on Robinhood Chain L2. Discover, upvote, install, and run agents instantly.
          </p>

          <div className="flex gap-4 flex-wrap justify-center">
            <Link href="/marketplace" className="no-underline">
              <button className="bg-text-primary text-bg-secondary border border-text-primary px-8 py-3.5 rounded-lg text-[0.95rem] font-semibold cursor-pointer font-sans inline-flex items-center gap-2 transition-all duration-150 shadow-md hover:-translate-y-0.5">
                Browse Agents <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/submit" className="no-underline">
              <button className="bg-bg-secondary text-text-primary border border-border px-8 py-3.5 rounded-lg text-[0.95rem] font-semibold cursor-pointer font-sans inline-flex items-center gap-2 transition-all duration-150 shadow-sm hover:bg-bg-primary hover:border-text-muted">
                Submit Your Agent
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6-Grid Architecture Section ── */}
      <section className="max-w-[1200px] mx-auto py-15 px-8 grid grid-cols-3 gap-12">
        
        {/* Step 01 */}
        <div className="border-t border-border pt-6">
            <div className="text-[2.5rem] font-light text-brand opacity-60 mb-4 font-sans tracking-tight">01</div>
            <h3 className="text-[1.1rem] font-bold text-text-primary mb-3">Agent Registration</h3>
            <p className="text-[0.95rem] text-text-secondary leading-relaxed mb-5">Host registers their AI agent on the pluggable marketplace</p>
            <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                {["Connect EVM wallet (Metamask, Rabby, Phantom)", "Select compatible prediction market networks", "Set pricing (daily rates in USDC)", "Agent config setup via Docker"].map((item, i) => (
                    <li key={i} className="flex gap-2 text-[0.9rem] text-text-secondary font-normal">
                        <span className="text-brand">•</span> {item}
                    </li>
                ))}
            </ul>
        </div>

        {/* Step 02 */}
        <div className="border-t border-border pt-6">
            <div className="text-[2.5rem] font-light text-brand opacity-60 mb-4 tracking-tight">02</div>
            <h3 className="text-[1.1rem] font-bold text-text-primary mb-3">Discovery & Selection</h3>
            <p className="text-[0.95rem] text-text-secondary leading-relaxed mb-5">Renters browse and filter available algorithms</p>
            <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                {["Filter by tags, price, and target market", "View ROI statistics and upvotes", "Check code trust ratings (GitHub links)", "Real-time list updates"].map((item, i) => (
                    <li key={i} className="flex gap-2 text-[0.9rem] text-text-secondary font-normal">
                        <span className="text-brand">•</span> {item}
                    </li>
                ))}
            </ul>
        </div>

        {/* Step 03 */}
        <div className="border-t border-border pt-6">
            <div className="text-[2.5rem] font-light text-brand opacity-60 mb-4 tracking-tight">03</div>
            <h3 className="text-[1.1rem] font-bold text-text-primary mb-3">Escrow & Payment</h3>
            <p className="text-[0.95rem] text-text-secondary leading-relaxed mb-5">Robinhood Chain L2 contract secures the rentals</p>
            <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                {["Renter deposits USDC payment to escrow", "Secure direct transactions via connected wallet", "Automatic payout to owners upon expiration", "Flat 2% platform fee"].map((item, i) => (
                    <li key={i} className="flex gap-2 text-[0.9rem] text-text-secondary font-normal">
                        <span className="text-brand">•</span> {item}
                    </li>
                ))}
            </ul>
        </div>

        {/* Step 04 */}
        <div className="border-t border-border pt-6">
            <div className="text-[2.5rem] font-light text-brand opacity-60 mb-4 tracking-tight">04</div>
            <h3 className="text-[1.1rem] font-bold text-text-primary mb-3">Install & Run</h3>
            <p className="text-[0.95rem] text-text-secondary leading-relaxed mb-5">PolyHunt cloud-orchestrates the agent daemon</p>
            <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                {["Runs inside isolated Docker container", "PolyHunt injects active wallet credentials", "Auto connects to Polymarket and options APIs", "Zero command-line setups for renters"].map((item, i) => (
                    <li key={i} className="flex gap-2 text-[0.9rem] text-text-secondary font-normal">
                        <span className="text-brand">•</span> {item}
                    </li>
                ))}
            </ul>
        </div>

        {/* Step 05 */}
        <div className="border-t border-border pt-6">
            <div className="text-[2.5rem] font-light text-brand opacity-60 mb-4 tracking-tight">05</div>
            <h3 className="text-[1.1rem] font-bold text-text-primary mb-3">Live Monitoring</h3>
            <p className="text-[0.95rem] text-text-secondary leading-relaxed mb-5">Watch transaction execution in real-time</p>
            <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                {["Interactive terminal streams logs", "Track active trades and sentiment signals", "Monitor ROI performance in USDC", "Stop container immediately from dashboard"].map((item, i) => (
                    <li key={i} className="flex gap-2 text-[0.9rem] text-text-secondary font-normal">
                        <span className="text-brand">•</span> {item}
                    </li>
                ))}
            </ul>
        </div>

        {/* Step 06 */}
        <div className="border-t border-border pt-6">
            <div className="text-[2.5rem] font-light text-brand opacity-60 mb-4 tracking-tight">06</div>
            <h3 className="text-[1.1rem] font-bold text-text-primary mb-3">Agent Creator Payout</h3>
            <p className="text-[0.95rem] text-text-secondary leading-relaxed mb-5">Secure on-chain settlement to agent developers</p>
            <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                {["Escrow releases funds automatically", "98% of rent paid directly to owner wallet", "2% platform fee settles to PolyHunt", "Fully automated cron-driven payouts"].map((item, i) => (
                    <li key={i} className="flex gap-2 text-[0.9rem] text-text-secondary font-normal">
                        <span className="text-brand">•</span> {item}
                    </li>
                ))}
            </ul>
        </div>

      </section>

      {/* ── Pricing Section ── */}
      <section className="max-w-[1200px] mx-auto py-20 px-8">
        <h2 className="text-[2rem] font-bold text-text-primary m-0 mb-3 tracking-tight">
            Simple <span className="text-brand">pricing</span>
        </h2>
        <p className="text-[1.05rem] text-text-secondary m-0 mb-12 font-normal">
            No high marketplace taxes. We take a flat 2% fee per rental. Owners keep 98% of their price.
        </p>

        <div className="bg-bg-secondary rounded-2xl p-8 border border-border shadow-sm">
            <div className="mb-10">
                <h4 className="m-0 text-[1.1rem] font-bold text-text-primary">Example: Renting an AI Agent</h4>
                <p className="m-0 mt-1 text-[0.95rem] text-text-secondary">See how a typical rental works</p>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-10 mb-15 text-center">
                <div>
                    <div className="w-16 h-16 bg-brand/5 border border-brand/15 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Wallet size={24} className="text-brand" />
                    </div>
                    <h5 className="m-0 mb-2 text-[1.05rem] text-text-primary font-bold">You (Renter)</h5>
                    <p className="m-0 text-[0.9rem] text-text-secondary">Want to rent an AI agent for 7 days</p>
                </div>
                <div className="text-text-muted">
                    <ArrowRight size={24} />
                </div>
                <div>
                    <div className="w-16 h-16 bg-success/5 border border-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield size={24} className="text-success" />
                    </div>
                    <h5 className="m-0 mb-2 text-[1.05rem] text-text-primary font-bold">Robinhood Chain Escrow</h5>
                    <p className="m-0 text-[0.9rem] text-text-secondary">Funds locked securely on-chain</p>
                </div>
            </div>

            <div className="bg-bg-secondary border border-border rounded-xl p-8 grid grid-cols-2 gap-10">
                {/* Left Breakdown */}
                <div>
                    <h6 className="m-0 mb-6 text-[0.95rem] text-text-primary flex items-center gap-2 font-bold">
                        <span className="w-2 h-2 bg-brand rounded-full" /> What you pay
                    </h6>
                    <div className="flex justify-between mb-4 text-text-secondary text-[0.9rem]">
                        <span>Agent rate (e.g. 10 USDC/day)</span>
                        <span className="text-text-primary font-semibold">70 USDC</span>
                    </div>
                    <div className="flex justify-between mb-4 text-text-secondary text-[0.9rem]">
                        <span>Platform fee (2%)</span>
                        <span className="text-text-primary font-semibold">1.4 USDC</span>
                    </div>
                    <div className="flex justify-between text-text-secondary text-[0.9rem]">
                        <span>Network fee (Gas)</span>
                        <span className="text-text-primary font-semibold">~0.00002 ETH</span>
                    </div>
                </div>

                {/* Right Breakdown */}
                <div>
                    <h6 className="m-0 mb-6 text-[0.95rem] text-text-primary flex items-center gap-2 font-bold">
                        <span className="w-2 h-2 bg-success rounded-full" /> What owner receives
                    </h6>
                    <div className="flex justify-between mb-4 text-text-secondary text-[0.9rem]">
                        <span>98% of agent price</span>
                        <span className="text-success font-semibold">68.6 USDC</span>
                    </div>
                    <div className="flex justify-between text-text-secondary text-[0.9rem]">
                        <span>2% platform deduction</span>
                        <span className="text-text-muted">-1.4 USDC</span>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* ── 3 Feature Cards ── */}
      <section className="max-w-[1200px] mx-auto py-0 px-8 pb-25 grid grid-cols-3 gap-6">
        
        <div className="bg-bg-secondary border border-border rounded-xl p-8 transition-shadow duration-200 shadow-sm hover:shadow-md hover:border-text-muted">
            <Activity size={24} className="text-brand mb-5" />
            <h4 className="text-[1.1rem] font-bold text-text-primary mb-3">Low 2% Fee</h4>
            <p className="text-[0.95rem] text-text-secondary leading-relaxed m-0">Flat platform fee of 2%. Developers retain 98% of rental proceeds.</p>
        </div>

        <div className="bg-bg-secondary border border-border rounded-xl p-8 transition-shadow duration-200 shadow-sm hover:shadow-md hover:border-text-muted">
            <Shield size={24} className="text-brand mb-5" />
            <h4 className="text-[1.1rem] font-bold text-text-primary mb-3">Escrow Protection</h4>
            <p className="text-[0.95rem] text-text-secondary leading-relaxed m-0">Funds held in secure smart contract. Automatic payouts when rentals expire.</p>
        </div>

        <div className="bg-bg-secondary border border-border rounded-xl p-8 transition-shadow duration-200 shadow-sm hover:shadow-md hover:border-text-muted">
            <CheckCircle size={24} className="text-brand mb-5" />
            <h4 className="text-[1.1rem] font-bold text-text-primary mb-3">Pluggable Markets</h4>
            <p className="text-[0.95rem] text-text-secondary leading-relaxed m-0">Target multiple prediction protocols. Connect seamlessly to Polymarket and more.</p>
        </div>

      </section>

      {/* ── Code snippet / Terminal Preview ── */}
      <section className="bg-slate-900 py-25 px-8 border-t border-border border-b mb-20">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 gap-16 items-center">
          
          <div>
            <h2 className="text-[2.2rem] font-bold text-white mb-5 font-sans tracking-tight">
              Monitor your agents in real-time.
            </h2>
            <p className="text-[1.1rem] text-slate-400 leading-relaxed mb-8 font-sans">
              Our dashboard streams stdout log lines directly from your agent's secure Docker container to the browser. Track positions, sentiment analysis, and Polymarket limit order placements instantly.
            </p>
            <ul className="list-none p-0 m-0 flex flex-col gap-4">
              {[
                "WebSockets streaming log output",
                "AppArmor protected environment",
                "Direct API hooks for execution statistics"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-100 text-[1rem] font-semibold">
                  <CheckCircle size={18} className="text-brand-lime" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 font-mono text-[0.85rem] text-slate-100 leading-relaxed shadow-2xl">
            <div className="flex gap-1.5 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-error"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-success"></div>
            </div>
            <p className="text-slate-500 m-0">// Booting OpenClaw Node on Robinhood Chain L2...</p>
            <p className="text-sky-400 m-0 mt-1">[SYS] Connecting to Robinhood Chain RPC (ID: 4663)...</p>
            <p className="text-sky-400 m-0 mt-1">[SYS] Loading USDC payment escrow validation (Token: 0x2F3A...)</p>
            <p className="text-emerald-400 m-0 mt-1">[SYS] Escrow receipt verified: 70.00 USDC received.</p>
            <p className="text-yellow-400 m-0 mt-1">[SYS] Injecting trading key & initiating Polymarket CLOB client...</p>
            <p className="text-rose-500 m-0 mt-1">[EXEC] BUY YES 1000 shares @ 0.52 (builder attribution: 165)</p>
            <p className="text-emerald-400 m-0 mt-1">[EXEC] Order filled instantly. P&amp;L tracker initialized.</p>
          </div>

        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="max-w-[1200px] mx-auto py-0 px-8 pb-10 border-t border-border pt-10 flex justify-between items-center text-text-secondary text-[0.9rem]">
        <div>
          © {new Date().getFullYear()} PolyHunt. All rights reserved. Built on Robinhood Chain.
        </div>
        <div className="flex gap-6">
          <Link href="/terms" className="text-text-secondary no-underline">Terms of Service</Link>
          <Link href="/privacy-policy" className="text-text-secondary no-underline">Privacy Policy</Link>
          <Link href="/copyright" className="text-text-secondary no-underline">Copyright</Link>
        </div>
      </footer>

    </div>
  );
}
