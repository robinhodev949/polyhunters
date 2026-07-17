"use client";

import { useEffect, useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { Terminal, Activity, Server, Database, Copy, Check, ExternalLink, RefreshCw, Wallet } from "lucide-react";

interface Rental {
    id: string;
    rentalCode: string;
    totalAmount: number;
    paymentStatus: string;
    containerStatus: string;
    startedAt: string | null;
    expiresAt: string;
    agent: {
        id: string;
        name: string;
        tagline: string;
        dockerImageUrl: string | null;
        webhookUrl: string | null;
    };
}

function RentalCard({ rental }: { rental: Rental }) {
    const [copied, setCopied] = useState(false);
    const isRunning = rental.containerStatus === "running";
    const isExpired = new Date(rental.expiresAt) < new Date();

    const copy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const statusClass = isExpired 
        ? "text-text-muted bg-text-muted/15" 
        : isRunning 
            ? "text-success bg-success/15" 
            : "text-error bg-error/15";
    const statusLabel = isExpired ? "Expired" : isRunning ? "Running" : "Pending";

    return (
        <div className="bg-bg-secondary border border-border rounded-xl p-5 flex flex-col gap-4">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-[1rem] font-bold text-text-primary m-0 mb-1">
                        {rental.agent.name}
                    </h3>
                    <p className="text-[0.8rem] text-text-secondary m-0">{rental.agent.tagline}</p>
                </div>
                <span className={`text-[0.75rem] font-bold px-2.5 py-0.75 rounded-xl uppercase ${statusClass}`}>
                    ● {statusLabel}
                </span>
            </div>

            {/* Rental Code */}
            <div className="bg-brand/5 border border-brand/10 rounded-lg p-3">
                <div className="text-[0.7rem] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                    Your Rental Code
                </div>
                <div className="flex items-center justify-between">
                    <code className="text-[1rem] font-bold text-brand font-mono">
                        {rental.rentalCode}
                    </code>
                    <button onClick={() => copy(rental.rentalCode)} className="bg-transparent border-none cursor-pointer p-1">
                        {copied ? <Check size={16} className="text-success" /> : <Copy size={16} className="text-text-secondary" />}
                    </button>
                </div>
                <p className="text-[0.72rem] text-text-muted m-0 mt-1.5">
                    Use this code to authenticate via the PolyHunt API
                </p>
            </div>

            {/* Details row */}
            <div className="grid grid-cols-3 gap-2">
                <div className="text-center bg-bg-primary rounded-md p-2.5 border border-border">
                    <div className="text-[0.7rem] text-text-muted mb-0.5">Paid</div>
                    <div className="text-[0.9rem] font-bold text-text-primary">{rental.totalAmount} USDC</div>
                </div>
                <div className="text-center bg-bg-primary rounded-md p-2.5 border border-border">
                    <div className="text-[0.7rem] text-text-muted mb-0.5">Started</div>
                    <div className="text-[0.8rem] font-semibold text-text-primary">
                        {rental.startedAt ? new Date(rental.startedAt).toLocaleDateString() : "—"}
                    </div>
                </div>
                <div className="text-center bg-bg-primary rounded-md p-2.5 border border-border">
                    <div className="text-[0.7rem] text-text-muted mb-0.5">Expires</div>
                    <div className={`text-[0.8rem] font-semibold ${isExpired ? "text-error" : "text-text-primary"}`}>
                        {new Date(rental.expiresAt).toLocaleDateString()}
                    </div>
                </div>
            </div>

            {/* API access link */}
            <div className="flex gap-2">
                <a href="/marketplace" className="no-underline flex-1">
                    <button className="w-full py-2 bg-brand text-white border-none rounded-md text-[0.8rem] font-semibold cursor-pointer flex items-center justify-center gap-1.5 transition-colors duration-150 hover:bg-brand-dark">
                        <ExternalLink size={14} /> View Marketplace
                    </button>
                </a>
                <a href="/docs" className="no-underline flex-1">
                    <button className="w-full py-2 bg-bg-secondary text-text-primary border border-border rounded-md text-[0.8rem] font-semibold cursor-pointer transition-all duration-150 hover:bg-bg-primary hover:border-text-muted">
                        API Docs
                    </button>
                </a>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const { address, isConnected } = useAccount();
    const { connect, connectors } = useConnect();
    const [rentals, setRentals] = useState<Rental[]>([]);
    const [loading, setLoading] = useState(false);

    const handleConnect = () => {
        const injectedConnector = connectors.find(c => c.id === 'injected') || connectors[0];
        if (injectedConnector) {
            connect({ connector: injectedConnector });
        }
    };

    const loadRentals = () => {
        if (!isConnected || !address) return;
        setLoading(true);
        fetch(`/api/rentals/my?wallet=${address}`)
            .then(r => r.json())
            .then(data => setRentals(Array.isArray(data) ? data : []))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadRentals();
    }, [isConnected, address]);

    if (!isConnected) {
        return (
            <div className="bg-bg-secondary min-h-[calc(100vh-56px)] flex items-center justify-center">
                <div className="bg-bg-secondary border border-border rounded-xl p-12 max-w-[440px] w-full text-center shadow-sm">
                    <div className="w-12 h-12 bg-brand-lime/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                        <Server size={24} className="text-text-primary" />
                    </div>
                    <h1 className="text-[1.4rem] font-bold text-text-primary mb-3 font-sans">
                        Connect Your Wallet
                    </h1>
                    <p className="text-[0.9rem] text-text-secondary mb-8 leading-relaxed">
                        Connect your EVM wallet to view your active prediction agents, rental codes, and node status on Robinhood Chain.
                    </p>
                    <div className="flex justify-center">
                        <button
                            onClick={handleConnect}
                            className="bg-brand-lime text-text-primary border-none rounded-lg px-6 py-3 text-[0.95rem] font-bold cursor-pointer flex items-center gap-2 transition-all duration-150 shadow-[0_2px_8px_rgba(204,255,0,0.15)] hover:bg-[#bfe600] hover:-translate-y-0.5"
                        >
                            <Wallet size={16} />
                            Connect Wallet
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-bg-secondary min-h-[calc(100vh-56px)]">
            {/* Header */}
            <div className="bg-bg-secondary border-b border-border">
                <div className="max-w-[1100px] mx-auto py-7 px-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="flex items-center gap-2 mb-1.5">
                                <Activity size={14} className="text-success" />
                                <span className="text-[0.8rem] font-bold text-success uppercase">Connected</span>
                            </div>
                            <h1 className="text-[1.7rem] font-extrabold text-text-primary m-0 tracking-tight">
                                My Dashboard
                            </h1>
                        </div>
                        <div className="text-right">
                            <p className="text-[0.7rem] text-text-muted uppercase tracking-wider mb-0.5 font-semibold">Wallet Address</p>
                            <p className="text-[0.85rem] text-text-primary font-mono m-0">
                                {address?.slice(0, 6)}...{address?.slice(-4)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1100px] mx-auto py-8 px-8">

                {/* Active Rentals */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[1rem] font-bold text-text-primary m-0 flex items-center gap-2">
                            <Terminal size={16} className="text-text-secondary" /> Active Agents
                            <span className="text-[0.75rem] bg-bg-primary text-text-secondary px-2 py-0.5 rounded font-semibold">
                                {loading ? "..." : rentals.length}
                            </span>
                        </h2>
                        <button onClick={loadRentals} className="bg-bg-secondary border border-border rounded-md px-3 py-1.5 cursor-pointer flex items-center gap-1.5 text-[0.8rem] text-text-secondary transition-all duration-150 hover:border-text-muted hover:text-text-primary">
                            <RefreshCw size={13} /> Refresh
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center py-20 text-text-muted">Loading your agents...</div>
                    ) : rentals.length === 0 ? (
                        <div className="bg-bg-secondary border border-border rounded-xl py-14 px-8 text-center">
                            <Database size={32} className="text-text-muted mx-auto mb-4 block" />
                            <h3 className="text-[1.1rem] font-bold text-text-primary mb-2">
                                No active agents
                            </h3>
                            <p className="text-[0.9rem] text-text-secondary mb-6 max-w-[360px] mx-auto">
                                Deploy an agent from the marketplace to start automating prediction strategies.
                            </p>
                            <a href="/marketplace" className="no-underline">
                                <button className="bg-brand-lime text-text-primary border-none px-6 py-2.5 rounded-md text-[0.9rem] font-bold cursor-pointer transition-all duration-150 shadow-[0_2px_8px_rgba(204,255,0,0.15)] hover:bg-[#bfe600]">
                                    Browse Marketplace
                                </button>
                            </a>
                        </div>
                    ) : (
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-4">
                            {rentals.map(rental => (
                                <RentalCard key={rental.id} rental={rental} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Protocol info strip */}
                <div className="bg-bg-secondary border border-border rounded-xl p-5">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-[0.72rem] text-text-muted uppercase tracking-wider mb-1">Escrow Contract</div>
                            <div className="text-[0.9rem] font-bold text-text-primary">USDC on Robinhood Chain L2</div>
                        </div>
                        <div>
                            <div className="text-[0.72rem] text-text-muted uppercase tracking-wider mb-1">Platform Fee</div>
                            <div className="text-[0.9rem] font-bold text-text-primary">2% per rental</div>
                        </div>
                        <div>
                            <div className="text-[0.72rem] text-text-muted uppercase tracking-wider mb-1">Owner Payout</div>
                            <div className="text-[0.9rem] font-bold text-success">98% in USDC</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
