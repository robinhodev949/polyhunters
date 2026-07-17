"use client";

import Link from "next/link";
import { ArrowRight, Wallet, Shield, CheckCircle, Activity, Box, Lock, Cpu } from "lucide-react";

export default function Home() {
  return (
    <div style={{ background: "#FAFAFA", color: "#111111", minHeight: "100vh", fontFamily: "var(--font-sans)", overflowX: "hidden" }}>

      {/* ── Top Header Variant ── */}
      <div className="landing-top-header" style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img src="/logo.png" alt="PolyHunt Logo" style={{ width: "28px", height: "28px", borderRadius: "10%" }} />
            <h1 style={{ fontSize: "1.4rem", fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>PolyHunt</h1>
            <span style={{ fontSize: "0.65rem", background: "rgba(22,93,252, 0.1)", border: "1px solid rgba(22,93,252, 0.2)", color: "#165DFC", padding: "2px 6px", borderRadius: "4px", fontWeight: 700, letterSpacing: "0.05em", marginLeft: "4px" }}>BETA</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <Link href="/marketplace" style={{ color: "#6B6B6B", fontWeight: 500, textDecoration: "none", fontSize: "0.95rem", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#111111"} onMouseLeave={e => e.currentTarget.style.color = "#6B6B6B"}>
                Marketplace
            </Link>
            <Link href="/marketplace">
                <button style={{
                    background: "#CCFF00", color: "#000000", border: "none",
                    padding: "10px 20px", borderRadius: "6px", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer",
                    transition: "all 0.15s", boxShadow: "0 2px 8px rgba(204,255,0,0.15)"
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#bfe600"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#CCFF00"; e.currentTarget.style.transform = "translateY(0)"; }}>
                    Get Started
                </button>
            </Link>
        </div>
      </div>

      {/* ── Hero ── */}
      <section style={{ background: "#FFFFFF", borderBottom: "1px solid #E8E8E8", position: "relative", overflow: "hidden" }}>
        
        {/* Grid pattern */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: "linear-gradient(#FAFAFA 1px, transparent 1px), linear-gradient(90deg, #FAFAFA 1px, transparent 1px)",
          backgroundSize: "32px 32px", opacity: 0.4, pointerEvents: "none", zIndex: 0
        }} />

        <div style={{
          position: "relative", zIndex: 1,
          maxWidth: "1200px", margin: "0 auto", padding: "80px 32px 100px",
          display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center"
        }}>

          <h1 style={{
            fontSize: "4rem", fontWeight: 800, lineHeight: 1.1,
            color: "#111111", marginBottom: "24px",
            fontFamily: "Inter, sans-serif", letterSpacing: "-0.04em",
            maxWidth: "900px"
          }}>
            The <span style={{ color: "#165DFC" }}>ProductHunt</span> for<br />prediction AI agents.
          </h1>

          <p style={{
            fontSize: "1.2rem", color: "#6B6B6B", lineHeight: 1.6,
            marginBottom: "48px", fontFamily: "Inter, sans-serif", fontWeight: 400,
            maxWidth: "700px"
          }}>
            Decentralized marketplace for prediction market AI agent rentals, built on Robinhood Chain L2. Discover, upvote, install, and run agents instantly.
          </p>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/marketplace" style={{ textDecoration: "none" }}>
              <button style={{
                background: "#CCFF00", color: "#000000", border: "1px solid #CCFF00",
                padding: "14px 32px", borderRadius: "8px", fontSize: "0.95rem",
                fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif",
                display: "inline-flex", alignItems: "center", gap: "8px", transition: "all 0.15s",
                boxShadow: "0 4px 14px rgba(204,255,0,0.25)"
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#bfe600"; e.currentTarget.style.borderColor = "#bfe600"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#CCFF00"; e.currentTarget.style.borderColor = "#CCFF00"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                Browse Agents <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/submit" style={{ textDecoration: "none" }}>
              <button style={{
                background: "#000000", color: "#FFFFFF",
                border: "1px solid #000000", boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                padding: "14px 32px", borderRadius: "8px", fontSize: "0.95rem",
                fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif",
                display: "inline-flex", alignItems: "center", gap: "8px", transition: "all 0.15s"
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#222222"; e.currentTarget.style.borderColor = "#222222"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#000000"; e.currentTarget.style.borderColor = "#000000"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                Submit Your Agent
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6-Grid Architecture Section ── */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 32px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "48px 40px" }}>
        
        {/* Step 01 */}
        <div style={{ borderTop: "1px solid #E8E8E8", paddingTop: "24px" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: 300, color: "#165DFC", opacity: 0.6, marginBottom: "16px", fontFamily: "var(--font-sans)", letterSpacing: "-0.04em" }}>01</div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111111", marginBottom: "12px" }}>Agent Registration</h3>
            <p style={{ fontSize: "0.95rem", color: "#6B6B6B", lineHeight: 1.6, marginBottom: "20px" }}>Host registers their AI agent on the pluggable marketplace</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                {["Connect EVM wallet (Metamask, Rabby, Phantom)", "Select compatible prediction market networks", "Set pricing (daily rates in USDC)", "Agent config setup via Docker"].map((item, i) => (
                    <li key={i} style={{ display: "flex", gap: "8px", fontSize: "0.9rem", color: "#6B6B6B", fontWeight: 400 }}>
                        <span style={{ color: "#165DFC" }}>•</span> {item}
                    </li>
                ))}
            </ul>
        </div>

        {/* Step 02 */}
        <div style={{ borderTop: "1px solid #E8E8E8", paddingTop: "24px" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: 300, color: "#165DFC", opacity: 0.6, marginBottom: "16px", letterSpacing: "-0.04em" }}>02</div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111111", marginBottom: "12px" }}>Discovery & Selection</h3>
            <p style={{ fontSize: "0.95rem", color: "#6B6B6B", lineHeight: 1.6, marginBottom: "20px" }}>Renters browse and filter available algorithms</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                {["Filter by tags, price, and target market", "View ROI statistics and upvotes", "Check code trust ratings (GitHub links)", "Real-time list updates"].map((item, i) => (
                    <li key={i} style={{ display: "flex", gap: "8px", fontSize: "0.9rem", color: "#6B6B6B", fontWeight: 400 }}>
                        <span style={{ color: "#165DFC" }}>•</span> {item}
                    </li>
                ))}
            </ul>
        </div>

        {/* Step 03 */}
        <div style={{ borderTop: "1px solid #E8E8E8", paddingTop: "24px" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: 300, color: "#165DFC", opacity: 0.6, marginBottom: "16px", letterSpacing: "-0.04em" }}>03</div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111111", marginBottom: "12px" }}>Escrow & Payment</h3>
            <p style={{ fontSize: "0.95rem", color: "#6B6B6B", lineHeight: 1.6, marginBottom: "20px" }}>Robinhood Chain L2 contract secures the rentals</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                {["Renter deposits USDC payment to escrow", "Secure direct transactions via connected wallet", "Automatic payout to owners upon expiration", "Flat 2% platform fee"].map((item, i) => (
                    <li key={i} style={{ display: "flex", gap: "8px", fontSize: "0.9rem", color: "#6B6B6B", fontWeight: 400 }}>
                        <span style={{ color: "#165DFC" }}>•</span> {item}
                    </li>
                ))}
            </ul>
        </div>

        {/* Step 04 */}
        <div style={{ borderTop: "1px solid #E8E8E8", paddingTop: "24px" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: 300, color: "#165DFC", opacity: 0.6, marginBottom: "16px", letterSpacing: "-0.04em" }}>04</div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111111", marginBottom: "12px" }}>Install & Run</h3>
            <p style={{ fontSize: "0.95rem", color: "#6B6B6B", lineHeight: 1.6, marginBottom: "20px" }}>PolyHunt cloud-orchestrates the agent daemon</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                {["Runs inside isolated Docker container", "PolyHunt injects active wallet credentials", "Auto connects to Polymarket and options APIs", "Zero command-line setups for renters"].map((item, i) => (
                    <li key={i} style={{ display: "flex", gap: "8px", fontSize: "0.9rem", color: "#6B6B6B", fontWeight: 400 }}>
                        <span style={{ color: "#165DFC" }}>•</span> {item}
                    </li>
                ))}
            </ul>
        </div>

        {/* Step 05 */}
        <div style={{ borderTop: "1px solid #E8E8E8", paddingTop: "24px" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: 300, color: "#165DFC", opacity: 0.6, marginBottom: "16px", letterSpacing: "-0.04em" }}>05</div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111111", marginBottom: "12px" }}>Live Monitoring</h3>
            <p style={{ fontSize: "0.95rem", color: "#6B6B6B", lineHeight: 1.6, marginBottom: "20px" }}>Watch transaction execution in real-time</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                {["Interactive terminal streams logs", "Track active trades and sentiment signals", "Monitor ROI performance in USDC", "Stop container immediately from dashboard"].map((item, i) => (
                    <li key={i} style={{ display: "flex", gap: "8px", fontSize: "0.9rem", color: "#6B6B6B", fontWeight: 400 }}>
                        <span style={{ color: "#165DFC" }}>•</span> {item}
                    </li>
                ))}
            </ul>
        </div>

        {/* Step 06 */}
        <div style={{ borderTop: "1px solid #E8E8E8", paddingTop: "24px" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: 300, color: "#165DFC", opacity: 0.6, marginBottom: "16px", letterSpacing: "-0.04em" }}>06</div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111111", marginBottom: "12px" }}>Agent Creator Payout</h3>
            <p style={{ fontSize: "0.95rem", color: "#6B6B6B", lineHeight: 1.6, marginBottom: "20px" }}>Secure on-chain settlement to agent developers</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                {["Escrow releases funds automatically", "98% of rent paid directly to owner wallet", "2% platform fee settles to PolyHunt", "Fully automated cron-driven payouts"].map((item, i) => (
                    <li key={i} style={{ display: "flex", gap: "8px", fontSize: "0.9rem", color: "#6B6B6B", fontWeight: 400 }}>
                        <span style={{ color: "#165DFC" }}>•</span> {item}
                    </li>
                ))}
            </ul>
        </div>

      </section>

      {/* ── Pricing Section ── */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 32px" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "#111111", margin: "0 0 12px 0", letterSpacing: "-0.02em" }}>
            Simple <span style={{ color: "#165DFC" }}>pricing</span>
        </h2>
        <p style={{ fontSize: "1.05rem", color: "#6B6B6B", margin: "0 0 48px 0", fontWeight: 400 }}>
            No high marketplace taxes. We take a flat 2% fee per rental. Owners keep 98% of their price.
        </p>

        <div style={{ background: "#FFFFFF", borderRadius: "16px", padding: "32px", border: "1px solid #E8E8E8", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
            <div style={{ marginBottom: "40px" }}>
                <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#111111" }}>Example: Renting an AI Agent</h4>
                <p style={{ margin: "4px 0 0 0", fontSize: "0.95rem", color: "#6B6B6B" }}>See how a typical rental works</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: "40px", marginBottom: "60px", textAlign: "center" }}>
                <div>
                    <div style={{ width: "64px", height: "64px", background: "rgba(22,93,252,0.06)", border: "1px solid rgba(22,93,252,0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                        <Wallet size={24} color="#165DFC" />
                    </div>
                    <h5 style={{ margin: "0 0 8px 0", fontSize: "1.05rem", color: "#111111", fontWeight: 700 }}>You (Renter)</h5>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "#6B6B6B" }}>Want to rent an AI agent for 7 days</p>
                </div>
                <div style={{ color: "#D1D5DB" }}>
                    <ArrowRight size={24} />
                </div>
                <div>
                    <div style={{ width: "64px", height: "64px", background: "rgba(10,124,78, 0.08)", border: "1px solid rgba(10,124,78,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                        <Shield size={24} color="#0A7C4E" />
                    </div>
                    <h5 style={{ margin: "0 0 8px 0", fontSize: "1.05rem", color: "#111111", fontWeight: 700 }}>Robinhood Chain Escrow</h5>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "#6B6B6B" }}>Funds locked securely on-chain</p>
                </div>
            </div>

            <div style={{ background: "#FFFFFF", border: "1px solid #E8E8E8", borderRadius: "12px", padding: "32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
                {/* Left Breakdown */}
                <div>
                    <h6 style={{ margin: "0 0 24px 0", fontSize: "0.95rem", color: "#111111", display: "flex", alignItems: "center", gap: "8px", fontWeight: 700 }}>
                        <span style={{ width: "8px", height: "8px", background: "#165DFC", borderRadius: "50%" }} /> What you pay
                    </h6>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", color: "#6B6B6B", fontSize: "0.9rem" }}>
                        <span>Agent rate (e.g. 10 USDC/day)</span>
                        <span style={{ color: "#111111", fontWeight: 600 }}>70 USDC</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", color: "#6B6B6B", fontSize: "0.9rem" }}>
                        <span>Platform fee (2%)</span>
                        <span style={{ color: "#111111", fontWeight: 600 }}>1.4 USDC</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#6B6B6B", fontSize: "0.9rem" }}>
                        <span>Network fee (Gas)</span>
                        <span style={{ color: "#111111", fontWeight: 600 }}>~0.00002 ETH</span>
                    </div>
                </div>

                {/* Right Breakdown */}
                <div>
                    <h6 style={{ margin: "0 0 24px 0", fontSize: "0.95rem", color: "#111111", display: "flex", alignItems: "center", gap: "8px", fontWeight: 700 }}>
                        <span style={{ width: "8px", height: "8px", background: "#0A7C4E", borderRadius: "50%" }} /> What owner receives
                    </h6>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", color: "#6B6B6B", fontSize: "0.9rem" }}>
                        <span>98% of agent price</span>
                        <span style={{ color: "#0A7C4E", fontWeight: 600 }}>68.6 USDC</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#6B6B6B", fontSize: "0.9rem" }}>
                        <span>2% platform deduction</span>
                        <span style={{ color: "#9CA3AF" }}>-1.4 USDC</span>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* ── 3 Feature Cards ── */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 32px 100px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
        
        <div style={{ background: "#FFFFFF", border: "1px solid #E8E8E8", borderRadius: "12px", padding: "32px", transition: "all 0.2s", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }} onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.04)"; e.currentTarget.style.borderColor = "#D1D5DB"; }} onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.02)"; e.currentTarget.style.borderColor = "#E8E8E8"; }}>
            <Activity size={24} color="#165DFC" style={{ marginBottom: "20px" }} />
            <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111111", marginBottom: "12px" }}>Low 2% Fee</h4>
            <p style={{ fontSize: "0.95rem", color: "#6B6B6B", lineHeight: 1.6, margin: 0 }}>Flat platform fee of 2%. Developers retain 98% of rental proceeds.</p>
        </div>

        <div style={{ background: "#FFFFFF", border: "1px solid #E8E8E8", borderRadius: "12px", padding: "32px", transition: "all 0.2s", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }} onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.04)"; e.currentTarget.style.borderColor = "#D1D5DB"; }} onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.02)"; e.currentTarget.style.borderColor = "#E8E8E8"; }}>
            <Shield size={24} color="#165DFC" style={{ marginBottom: "20px" }} />
            <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111111", marginBottom: "12px" }}>Escrow Protection</h4>
            <p style={{ fontSize: "0.95rem", color: "#6B6B6B", lineHeight: 1.6, margin: 0 }}>Funds held in secure smart contract. Automatic payouts when rentals expire.</p>
        </div>

        <div style={{ background: "#FFFFFF", border: "1px solid #E8E8E8", borderRadius: "12px", padding: "32px", transition: "all 0.2s", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }} onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.04)"; e.currentTarget.style.borderColor = "#D1D5DB"; }} onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.02)"; e.currentTarget.style.borderColor = "#E8E8E8"; }}>
            <CheckCircle size={24} color="#165DFC" style={{ marginBottom: "20px" }} />
            <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111111", marginBottom: "12px" }}>Pluggable Markets</h4>
            <p style={{ fontSize: "0.95rem", color: "#6B6B6B", lineHeight: 1.6, margin: 0 }}>Target multiple prediction protocols. Connect seamlessly to Polymarket and more.</p>
        </div>

      </section>

      {/* ── Code snippet / Terminal Preview ── */}
      <section style={{ background: "#0F172A", padding: "100px 32px", borderTop: "1px solid #E8E8E8", borderBottom: "1px solid #E8E8E8", marginBottom: "80px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>
          
          <div>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "20px", fontFamily: "Inter, sans-serif", letterSpacing: "-0.02em" }}>
              Monitor your agents in real-time.
            </h2>
            <p style={{ fontSize: "1.1rem", color: "#94A3B8", lineHeight: 1.65, marginBottom: "32px", fontFamily: "Inter, sans-serif" }}>
              Our dashboard streams stdout log lines directly from your agent's secure Docker container to the browser. Track positions, sentiment analysis, and Polymarket limit order placements instantly.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                "WebSockets streaming log output",
                "AppArmor protected environment",
                "Direct API hooks for execution statistics"
              ].map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: "12px", color: "#F1F5F9", fontSize: "1rem", fontWeight: 500 }}>
                  <CheckCircle size={18} color="#CCFF00" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ background: "#020617", border: "1px solid #1E293B", borderRadius: "12px", padding: "24px", fontFamily: "monospace", fontSize: "0.85rem", color: "#F8FAFC", lineHeight: 1.6, boxShadow: "0 10px 30px rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#EF4444" }}></div>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#FBBF24" }}></div>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10B981" }}></div>
            </div>
            <p style={{ color: "#64748B", margin: 0 }}>// Booting OpenClaw Node on Robinhood Chain L2...</p>
            <p style={{ color: "#38BDF8", margin: "4px 0 0 0" }}>[SYS] Connecting to Robinhood Chain RPC (ID: 4663)...</p>
            <p style={{ color: "#38BDF8", margin: "4px 0 0 0" }}>[SYS] Loading USDC payment escrow validation (Token: 0x2F3A...)</p>
            <p style={{ color: "#34D399", margin: "4px 0 0 0" }}>[SYS] Escrow receipt verified: 70.00 USDC received.</p>
            <p style={{ color: "#FACC15", margin: "4px 0 0 0" }}>[SYS] Injecting trading key & initiating Polymarket CLOB client...</p>
            <p style={{ color: "#F43F5E", margin: "4px 0 0 0" }}>[EXEC] BUY YES 1000 shares @ 0.52 (builder attribution: 165)</p>
            <p style={{ color: "#34D399", margin: "4px 0 0 0" }}>[EXEC] Order filled instantly. P&amp;L tracker initialized.</p>
          </div>

        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 32px 40px", borderTop: "1px solid #E8E8E8", paddingTop: "40px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#6B6B6B", fontSize: "0.9rem" }}>
        <div>
          © {new Date().getFullYear()} PolyHunt. All rights reserved. Built on Robinhood Chain.
        </div>
        <div style={{ display: "flex", gap: "24px" }}>
          <Link href="/terms" style={{ color: "#6B6B6B", textDecoration: "none" }}>Terms of Service</Link>
          <Link href="/privacy-policy" style={{ color: "#6B6B6B", textDecoration: "none" }}>Privacy Policy</Link>
          <Link href="/copyright" style={{ color: "#6B6B6B", textDecoration: "none" }}>Copyright</Link>
        </div>
      </footer>

    </div>
  );
}
