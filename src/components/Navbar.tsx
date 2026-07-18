"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Menu, X, LogOut, Wallet } from "lucide-react";
import { useState } from "react";

export function Navbar() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    const { address, isConnected } = useAccount();
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();

    const navLinks = [
        { href: "/marketplace", label: "Marketplace" },
        { href: "/season-1", label: "Season 1" },
        { href: "/leaderboard", label: "Leaderboards" },
        { href: "/submit", label: "Submit Agent" },
        { href: "/docs", label: "Docs" },
        { href: "/dashboard", label: "Dashboard" },
    ];

    const handleConnect = () => {
        // Use injected connector (MetaMask, Phantom EVM, Rabby, etc.)
        const injectedConnector = connectors.find(c => c.id === 'injected') || connectors[0];
        if (injectedConnector) {
            connect({ connector: injectedConnector });
        }
    };

    const formatAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    return (
        <>
            <header style={{
                position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
                height: "56px",
                backgroundColor: "#FFFFFF",
                borderBottom: "1px solid #E8E8E8",
                borderTop: "3px solid #CCFF00",
                display: "flex", alignItems: "center",
                justifyContent: "space-between",
                padding: "0 16px",
            }}>
                {/* Logo */}
                <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
                    <img src="/logo.png" alt="PolyHunt Logo" style={{ width: "28px", height: "28px", borderRadius: "10%" }} />
                    <span style={{
                        fontWeight: 700, fontSize: "1rem", color: "#000000",
                        fontFamily: "Inter, sans-serif", letterSpacing: "-0.02em"
                    }}>
                        PolyHunt
                    </span>
                </Link>

                {/* Desktop Nav links */}
                <nav className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            style={{
                                textDecoration: "none",
                                fontSize: "0.875rem",
                                fontWeight: pathname === link.href ? 600 : 400,
                                color: pathname === link.href ? "#000000" : "#6B6B6B",
                                fontFamily: "Inter, sans-serif",
                                transition: "color 0.1s",
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop: Wallet + Trade button */}
                <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {isConnected && address && (
                        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginRight: "8px", borderRight: "1px solid #E8E8E8", paddingRight: "20px" }}>
                            <Link href={`/profile/${address}`} style={{ 
                                textDecoration: "none", 
                                fontSize: "0.85rem", 
                                fontWeight: 600, 
                                color: "#165DFC",
                                transition: "color 0.15s"
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = "#0047ca"}
                            onMouseLeave={e => e.currentTarget.style.color = "#165DFC"}
                            >
                                My Profile
                            </Link>
                        </div>
                    )}
                    <a href="https://polymarket.com" target="_blank" rel="noopener noreferrer" className="nav-trade-btn" style={{
                        display: "inline-flex", alignItems: "center", gap: "6px",
                        padding: "7px 14px", borderRadius: "6px",
                        border: "1px solid #E8E8E8", background: "#FFFFFF",
                        color: "#000000", fontSize: "0.8rem", fontWeight: 600,
                        textDecoration: "none", fontFamily: "Inter, sans-serif",
                        transition: "all 0.15s", whiteSpace: "nowrap",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#FAFAFA"; e.currentTarget.style.borderColor = "#E8E8E8"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#FFFFFF"; e.currentTarget.style.borderColor = "#E8E8E8"; }}
                    >
                        Trade on Polymarket ↗
                    </a>
                    
                    {isConnected && address ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{
                                fontSize: "0.85rem",
                                fontWeight: 600,
                                color: "#000000",
                                background: "#FAFAFA",
                                padding: "6px 12px",
                                borderRadius: "6px",
                                fontFamily: "monospace"
                            }}>
                                {formatAddress(address)}
                            </span>
                            <button 
                                onClick={() => disconnect()}
                                style={{
                                    background: "#FFFFFF",
                                    border: "1px solid #E8E8E8",
                                    borderRadius: "6px",
                                    padding: "6px 10px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    color: "#6B6B6B",
                                    transition: "all 0.15s"
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = "#EF4444"; e.currentTarget.style.color = "#EF4444"; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = "#E8E8E8"; e.currentTarget.style.color = "#6B6B6B"; }}
                            >
                                <LogOut size={14} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleConnect}
                            style={{
                                background: "#CCFF00",
                                color: "#000000",
                                border: "none",
                                borderRadius: "6px",
                                padding: "7px 16px",
                                fontSize: "0.85rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                transition: "all 0.15s",
                                boxShadow: "0 2px 8px rgba(204,255,0,0.15)"
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#bfe600"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "#CCFF00"; e.currentTarget.style.transform = "translateY(0)"; }}
                        >
                            <Wallet size={14} />
                            Connect Wallet
                        </button>
                    )}
                </div>

                {/* Mobile: Wallet + Hamburger */}
                <div className="mobile-nav" style={{ display: "none", alignItems: "center", gap: "8px" }}>
                    {isConnected && address ? (
                        <span style={{
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            color: "#000000",
                            background: "#FAFAFA",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            fontFamily: "monospace"
                        }}>
                            {formatAddress(address)}
                        </span>
                    ) : (
                        <button
                            onClick={handleConnect}
                            style={{
                                background: "#CCFF00",
                                color: "#000000",
                                border: "none",
                                borderRadius: "6px",
                                padding: "5px 10px",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "background 0.15s"
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "#bfe600"}
                            onMouseLeave={e => e.currentTarget.style.background = "#CCFF00"}
                        >
                            Connect
                        </button>
                    )}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#000000" }}
                    >
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </header>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <div className="mobile-nav" style={{
                    display: "none",
                    position: "fixed", top: "56px", left: 0, right: 0, zIndex: 49,
                    backgroundColor: "#FFFFFF", borderBottom: "1px solid #E8E8E8",
                    flexDirection: "column", padding: "8px 0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                }}>
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            style={{
                                textDecoration: "none", padding: "14px 20px",
                                fontSize: "1rem", fontWeight: pathname === link.href ? 600 : 400,
                                color: pathname === link.href ? "#000000" : "#6B6B6B",
                                fontFamily: "Inter, sans-serif",
                                borderBottom: "1px solid #FAFAFA",
                                display: "block",
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/privacy-policy"
                        onClick={() => setMenuOpen(false)}
                        style={{
                            textDecoration: "none", padding: "14px 20px",
                            fontSize: "1rem", fontWeight: pathname === "/privacy-policy" ? 600 : 400,
                            color: pathname === "/privacy-policy" ? "#000000" : "#6B6B6B",
                            fontFamily: "Inter, sans-serif",
                            borderBottom: "1px solid #FAFAFA",
                            display: "block",
                        }}
                    >
                        Privacy Policy
                    </Link>
                    {isConnected && address && (
                        <Link href={`/profile/${address}`} onClick={() => setMenuOpen(false)} style={{
                            textDecoration: "none", padding: "14px 20px", fontSize: "1rem", fontWeight: 600, color: "#165DFC",
                            fontFamily: "Inter, sans-serif", borderBottom: "1px solid #FAFAFA", display: "block"
                        }}>My Profile</Link>
                    )}
                    {isConnected && (
                        <button 
                            onClick={() => { disconnect(); setMenuOpen(false); }}
                            style={{
                                width: "100%", textAlign: "left", background: "none", border: "none",
                                textDecoration: "none", padding: "14px 20px", fontSize: "1rem", fontWeight: 600, color: "#EF4444",
                                fontFamily: "Inter, sans-serif", borderBottom: "1px solid #FAFAFA", display: "block", cursor: "pointer"
                            }}
                        >
                            Disconnect Wallet
                        </button>
                    )}
                    <a href="https://polymarket.com" target="_blank" rel="noopener noreferrer" style={{
                        padding: "14px 20px", fontSize: "1rem", fontWeight: 500,
                        color: "#6B6B6B", fontFamily: "Inter, sans-serif",
                        textDecoration: "none", display: "block"
                    }}>
                        Trade on Polymarket ↗
                    </a>
                </div>
            )}
        </>
    );
}
