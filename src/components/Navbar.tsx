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
        { href: "/leaderboard", label: "Leaderboards" },
        { href: "/submit", label: "Submit Agent" },
        { href: "/docs", label: "Docs" },
        { href: "/dashboard", label: "Dashboard" },
    ];

    const handleConnect = () => {
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
            <header className="fixed top-0 left-0 right-0 z-50 h-[56px] bg-bg-secondary border-b border-border flex items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 no-underline">
                    <img src="/logo.png" alt="PolyHunt Logo" className="w-7 h-7 rounded-sm" />
                    <span className="font-bold text-[1rem] text-text-primary font-sans tracking-tight">
                        PolyHunt
                    </span>
                </Link>

                {/* Desktop Nav links */}
                <nav className="desktop-nav flex items-center gap-6">
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`no-underline text-[0.875rem] font-sans transition-colors duration-100 ${
                                pathname === link.href ? "font-semibold text-text-primary" : "font-normal text-text-secondary hover:text-text-primary"
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop: Wallet + Trade button */}
                <div className="desktop-nav flex items-center gap-3">
                    {isConnected && address && (
                        <div className="flex items-center gap-4 mr-2 border-r border-border pr-5">
                            <Link href={`/profile/${address}`} className="no-underline text-[0.85rem] font-semibold text-brand hover:text-brand-dark transition-colors duration-150">
                                My Profile
                            </Link>
                        </div>
                    )}
                    <a href="https://polymarket.com" target="_blank" rel="noopener noreferrer" className="nav-trade-btn inline-flex items-center gap-1.5 px-3.5 py-1.75 rounded-md border border-border bg-bg-secondary text-text-primary text-[0.8rem] font-semibold no-underline font-sans transition-all duration-150 whitespace-nowrap hover:bg-bg-primary hover:border-text-muted">
                        Trade on Polymarket ↗
                    </a>
                    
                    {isConnected && address ? (
                        <div className="flex items-center gap-2">
                            <span className="text-[0.85rem] font-semibold text-text-primary bg-bg-primary px-3 py-1.5 rounded-md font-mono">
                                {formatAddress(address)}
                            </span>
                            <button 
                                onClick={() => disconnect()}
                                className="bg-bg-secondary border border-border rounded-md px-2.5 py-1.5 cursor-pointer flex items-center text-text-secondary transition-all duration-150 hover:border-error hover:text-error"
                            >
                                <LogOut size={14} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleConnect}
                            className="bg-brand-lime text-text-primary border-none rounded-md px-4 py-1.75 text-[0.85rem] font-semibold cursor-pointer flex items-center gap-1.5 transition-all duration-150 shadow-[0_2px_8px_rgba(204,255,0,0.15)] hover:bg-[#bfe600] hover:-translate-y-0.5"
                        >
                            <Wallet size={14} />
                            Connect Wallet
                        </button>
                    )}
                </div>

                {/* Mobile: Wallet + Hamburger */}
                <div className="mobile-nav hidden items-center gap-2">
                    {isConnected && address ? (
                        <span className="text-[0.75rem] font-semibold text-text-primary bg-bg-primary px-2 py-1 rounded-md font-mono">
                            {formatAddress(address)}
                        </span>
                    ) : (
                        <button
                            onClick={handleConnect}
                            className="bg-brand-lime text-text-primary border-none rounded-md px-2.5 py-1.25 text-[0.75rem] font-semibold cursor-pointer transition-colors duration-150 hover:bg-[#bfe600]"
                        >
                            Connect
                        </button>
                    )}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="bg-transparent border-none cursor-pointer p-1 text-text-primary"
                    >
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </header>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <div className="mobile-nav hidden fixed top-[56px] left-0 right-0 z-49 bg-bg-secondary border-b border-border flex-col py-2 shadow-md">
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className={`no-underline px-5 py-3.5 text-[1rem] font-sans border-b border-border block ${
                                pathname === link.href ? "font-semibold text-text-primary" : "font-normal text-text-secondary"
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/privacy-policy"
                        onClick={() => setMenuOpen(false)}
                        className={`no-underline px-5 py-3.5 text-[1rem] font-sans border-b border-border block ${
                            pathname === "/privacy-policy" ? "font-semibold text-text-primary" : "font-normal text-text-secondary"
                        }`}
                    >
                        Privacy Policy
                    </Link>
                    {isConnected && address && (
                        <Link href={`/profile/${address}`} onClick={() => setMenuOpen(false)} className="no-underline px-5 py-3.5 text-[1rem] font-semibold text-brand font-sans border-b border-border block">My Profile</Link>
                    )}
                    {isConnected && (
                        <button 
                            onClick={() => { disconnect(); setMenuOpen(false); }}
                            className="w-full text-left bg-transparent border-none no-underline px-5 py-3.5 text-[1rem] font-semibold text-error font-sans border-b border-border block cursor-pointer"
                        >
                            Disconnect Wallet
                        </button>
                    )}
                    <a href="https://polymarket.com" target="_blank" rel="noopener noreferrer" className="px-5 py-3.5 text-[1rem] font-medium text-text-secondary font-sans no-underline block">
                        Trade on Polymarket ↗
                    </a>
                </div>
            )}
        </>
    );
}
