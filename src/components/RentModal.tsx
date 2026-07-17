"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { X, Copy, Check, ArrowRight, Loader2, ExternalLink, CreditCard } from "lucide-react";
import type { Agent } from "@prisma/client";
import { parseUnits } from "viem";
import { USDC_CONTRACT_ADDRESS } from "@/lib/robinhoodChain";

interface RentModalProps {
    agent: Agent;
    onClose: () => void;
}

type Step = "configure" | "pay" | "verify" | "done";

export function RentModal({ agent, onClose }: RentModalProps) {
    const { address, isConnected } = useAccount();
    const { writeContract, data: txHash, isPending: isTxPending, error: txError } = useWriteContract();
    const { isLoading: isTxConfirming, isSuccess: isTxConfirmed } = useWaitForTransactionReceipt({ hash: txHash });

    const [step, setStep] = useState<Step>("configure");
    const [days, setDays] = useState(7);
    const [rentalId, setRentalId] = useState("");
    const [escrowWallet, setEscrowWallet] = useState("");
    const [manualTxHash, setManualTxHash] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const [codeCopied, setCodeCopied] = useState(false);
    const [result, setResult] = useState<any>(null);

    const totalCost = agent.pricePerDay * days;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Step 1: Create pending rental in database
    const handleInitiate = async () => {
        if (!isConnected || !address) return;
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/rent/initiate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    agentId: agent.id,
                    renterWallet: address,
                    days,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setRentalId(data.rentalId);
            setEscrowWallet(data.escrowWallet);
            setStep("pay");
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    // Trigger direct payment via connected wallet
    const handleDirectPay = () => {
        if (!escrowWallet) return;
        
        const erc20Abi = [
            {
                name: 'transfer',
                type: 'function',
                stateMutability: 'nonpayable',
                inputs: [
                    { name: 'recipient', type: 'address' },
                    { name: 'amount', type: 'uint256' }
                ],
                outputs: [{ name: '', type: 'bool' }]
            }
        ] as const;

        writeContract({
            address: USDC_CONTRACT_ADDRESS as `0x${string}`,
            abi: erc20Abi,
            functionName: 'transfer',
            args: [escrowWallet as `0x${string}`, parseUnits(totalCost.toString(), 6)], // USDC uses 6 decimals
        });
    };

    // Automatically transition to verification step when onchain tx completes
    useEffect(() => {
        if (isTxConfirmed && txHash) {
            setManualTxHash(txHash);
            handleVerify(txHash);
        }
    }, [isTxConfirmed, txHash]);

    // Step 2: Verify the deposit (strictly backend receipt verification)
    const handleVerify = async (hashToVerify?: string) => {
        const hash = hashToVerify || manualTxHash;
        if (!hash || !isConnected || !address) return;
        
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/rent/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    rentalId,
                    txSignature: hash.trim(),
                    renterWallet: address,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setResult(data);
            setStep("done");
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000, padding: "24px", backdropFilter: "blur(4px)"
        }}>
            <div style={{
                background: "#FFFFFF", borderRadius: "16px", padding: "32px",
                width: "100%", maxWidth: "480px", position: "relative",
                boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                border: "1px solid #E8E8E8"
            }}>
                {/* Close Button */}
                <button onClick={onClose} style={{
                    position: "absolute", top: "16px", right: "16px",
                    background: "none", border: "none", cursor: "pointer", padding: "4px"
                }}>
                    <X size={20} color="#9CA3AF" />
                </button>

                {/* Step: Configure */}
                {step === "configure" && (
                    <>
                        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: "0 0 4px 0", color: "#111111" }}>
                            Rent {agent.name}
                        </h2>
                        <p style={{ color: "#6B6B6B", fontSize: "0.9rem", margin: "0 0 28px 0" }}>
                            {agent.tagline}
                        </p>

                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ fontWeight: 600, color: "#374151", fontSize: "0.9rem", display: "block", marginBottom: "8px" }}>
                                Rental Duration
                            </label>
                            <div style={{ display: "flex", gap: "8px" }}>
                                {[1, 3, 7, 14, 30].map(d => (
                                    <button key={d} onClick={() => setDays(d)} style={{
                                        flex: 1, padding: "8px 4px", borderRadius: "8px",
                                        border: "1px solid", cursor: "pointer",
                                        fontSize: "0.85rem",
                                        backgroundColor: days === d ? "#CCFF00" : "transparent",
                                        borderColor: days === d ? "#CCFF00" : "#E8E8E8",
                                        color: days === d ? "#000000" : "#6B6B6B",
                                        fontWeight: days === d ? 700 : 500,
                                        transition: "all 0.15s"
                                    }}>
                                        {d}d
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ background: "rgba(22,93,252,0.04)", border: "1px solid rgba(22,93,252,0.15)", borderRadius: "12px", padding: "16px", marginBottom: "24px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                <span style={{ color: "#6B6B6B", fontSize: "0.9rem" }}>Daily Rate</span>
                                <span style={{ fontWeight: 600, color: "#111111" }}>{agent.pricePerDay} USDC</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                <span style={{ color: "#6B6B6B", fontSize: "0.9rem" }}>Duration</span>
                                <span style={{ fontWeight: 600, color: "#111111" }}>{days} days</span>
                            </div>
                            <div style={{ borderTop: "1px solid rgba(22,93,252,0.15)", paddingTop: "8px", display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontWeight: 700, color: "#111111" }}>Total</span>
                                <span style={{ fontWeight: 700, color: "#165DFC", fontSize: "1.1rem" }}>{totalCost} USDC</span>
                            </div>
                        </div>

                        {!isConnected && (
                            <p style={{ color: "#DC2626", fontSize: "0.85rem", marginBottom: "12px", textAlign: "center", fontWeight: 500 }}>
                                ⚠ Please connect your wallet first.
                            </p>
                        )}
                        {error && <p style={{ color: "#DC2626", fontSize: "0.85rem", marginBottom: "12px" }}>{error}</p>}

                        <button onClick={handleInitiate} disabled={!isConnected || loading} style={{
                            width: "100%", padding: "12px", borderRadius: "8px",
                            background: "#CCFF00", color: "#000000", border: "none",
                            fontSize: "1rem", fontWeight: 700, cursor: isConnected ? "pointer" : "not-allowed",
                            opacity: isConnected ? 1 : 0.5,
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                            transition: "all 0.15s",
                            boxShadow: "0 2px 8px rgba(204,255,0,0.15)"
                        }}
                        onMouseEnter={e => { if (isConnected) e.currentTarget.style.background = "#bfe600"; }}
                        onMouseLeave={e => { if (isConnected) e.currentTarget.style.background = "#CCFF00"; }}
                        >
                            {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : null}
                            Continue — {totalCost} USDC <ArrowRight size={16} />
                        </button>
                    </>
                )}

                {/* Step: Pay */}
                {step === "pay" && (
                    <>
                        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: "0 0 8px 0", color: "#111111" }}>
                            Send USDC Payment
                        </h2>
                        <p style={{ color: "#6B6B6B", fontSize: "0.9rem", margin: "0 0 20px 0", lineHeight: 1.5 }}>
                            Send exactly <strong>{totalCost} USDC</strong> on Robinhood Chain to the escrow wallet.
                        </p>

                        {/* Interactive Direct Pay Button */}
                        <button 
                            onClick={handleDirectPay} 
                            disabled={isTxPending || isTxConfirming || loading}
                            style={{
                                width: "100%", padding: "14px", borderRadius: "8px",
                                background: "#165DFC", color: "#FFFFFF", border: "none",
                                fontSize: "1rem", fontWeight: 600, cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                                marginBottom: "20px", transition: "background 0.15s",
                                boxShadow: "0 4px 12px rgba(22,93,252,0.2)"
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "#0047ca"}
                            onMouseLeave={e => e.currentTarget.style.background = "#165DFC"}
                        >
                            {isTxPending || isTxConfirming ? (
                                <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                            ) : (
                                <CreditCard size={18} />
                            )}
                            {isTxPending ? "Approve in Wallet..." : isTxConfirming ? "Confirming Payment..." : `Pay ${totalCost} USDC via Connected Wallet`}
                        </button>

                        {(txError || error) && (
                            <p style={{ color: "#DC2626", fontSize: "0.85rem", marginBottom: "12px", wordBreak: "break-word" }}>
                                {txError?.message || error}
                            </p>
                        )}

                        <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "16px 0", color: "#9CA3AF" }}>
                            <div style={{ flex: 1, height: "1px", background: "#E8E8E8" }}></div>
                            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700 }}>Or pay manually</span>
                            <div style={{ flex: 1, height: "1px", background: "#E8E8E8" }}></div>
                        </div>

                        {/* Escrow wallet copy container */}
                        <div style={{ background: "#FAFAFA", border: "1px solid #E8E8E8", borderRadius: "10px", padding: "14px", marginBottom: "16px" }}>
                            <div style={{ fontSize: "0.75rem", color: "#9CA3AF", marginBottom: "6px", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.06em" }}>
                                PolyHunt Escrow Wallet (Robinhood Chain)
                            </div>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                                <code style={{ fontSize: "0.8rem", color: "#111111", wordBreak: "break-all", flex: 1, fontFamily: "monospace" }}>
                                    {escrowWallet}
                                </code>
                                <button onClick={() => copyToClipboard(escrowWallet)} style={{
                                    background: "none", border: "none", cursor: "pointer", flexShrink: 0
                                }}>
                                    {copied ? <Check size={16} color="#16A34A" /> : <Copy size={16} color="#6B6B6B" />}
                                </button>
                            </div>
                        </div>

                        <p style={{ color: "#374151", fontSize: "0.9rem", fontWeight: 500, marginBottom: "8px" }}>
                            After sending, paste your transaction hash:
                        </p>
                        <input
                            type="text"
                            placeholder="e.g. 0xabcdef...123"
                            value={manualTxHash}
                            onChange={e => setManualTxHash(e.target.value)}
                            style={{
                                width: "100%", padding: "10px 12px", borderRadius: "8px",
                                border: "1px solid #E8E8E8", fontSize: "0.85rem",
                                color: "#111111", marginBottom: "8px", boxSizing: "border-box"
                            }}
                        />
                        <p style={{ color: "#9CA3AF", fontSize: "0.75rem", margin: "0 0 16px 0", lineHeight: 1.4 }}>
                            Provide the 0x-prefixed transaction hash from your wallet provider. The backend will strictly verify the on-chain receipt log before activating.
                        </p>

                        <button onClick={() => handleVerify()} disabled={!manualTxHash || loading} style={{
                            width: "100%", padding: "12px", borderRadius: "8px",
                            background: "#CCFF00", color: "#000000", border: "none",
                            fontSize: "1rem", fontWeight: 700, cursor: manualTxHash ? "pointer" : "not-allowed",
                            opacity: manualTxHash ? 1 : 0.5,
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                            transition: "all 0.15s"
                        }}
                        onMouseEnter={e => { if (manualTxHash) e.currentTarget.style.background = "#bfe600"; }}
                        onMouseLeave={e => { if (manualTxHash) e.currentTarget.style.background = "#CCFF00"; }}
                        >
                            {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : null}
                            Verify & Activate Agent
                        </button>
                    </>
                )}

                {/* Step: Done */}
                {step === "done" && (
                    <>
                        <div style={{ textAlign: "center", padding: "8px 0 16px" }}>
                            <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🎉</div>
                            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, margin: "0 0 6px 0", color: "#111111" }}>
                                Agent is Live!
                            </h2>
                            <p style={{ color: "#6B6B6B", margin: "0 0 20px 0", fontSize: "0.9rem" }}>
                                <strong>{agent.name}</strong> is now trading on your prediction markets.
                            </p>
                        </div>

                        {/* Rental Code */}
                        <div style={{ background: "rgba(22,93,252,0.04)", border: "2px solid #165DFC", borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
                            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#165DFC", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
                                🔑 Your Rental Code — Save This!
                            </div>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <code style={{ fontSize: "1.3rem", fontWeight: 800, color: "#165DFC", fontFamily: "monospace", letterSpacing: "0.05em" }}>
                                    {result?.rentalCode || "RC-loading"}
                                </code>
                                <button onClick={() => {
                                    navigator.clipboard.writeText(result?.rentalCode || "");
                                    setCodeCopied(true);
                                    setTimeout(() => setCodeCopied(false), 2000);
                                }} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
                                    {codeCopied ? <Check size={18} color="#0A7C4E" /> : <Copy size={18} color="#165DFC" />}
                                </button>
                            </div>
                            <p style={{ fontSize: "0.75rem", color: "#6B6B6B", margin: "8px 0 0 0", lineHeight: 1.4 }}>
                                Use this code in your Dashboard and the PolyHunt API to authenticate your agent connection.
                            </p>
                        </div>

                        {/* Expiry */}
                        <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "10px", padding: "12px", marginBottom: "20px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                                <span style={{ color: "#6B6B6B", fontSize: "0.85rem" }}>Expires</span>
                                <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "#111111" }}>
                                    {result?.expiresAt ? new Date(result.expiresAt).toLocaleDateString() : "—"}
                                </span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "#6B6B6B", fontSize: "0.85rem" }}>Status</span>
                                <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "#16A34A" }}>✓ Running</span>
                            </div>
                        </div>

                        <a href="/dashboard" style={{ textDecoration: "none" }}>
                            <button style={{
                                width: "100%", padding: "12px", borderRadius: "8px",
                                background: "#CCFF00", color: "#000000", border: "none",
                                fontSize: "1rem", fontWeight: 700, cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                                transition: "background 0.15s"
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#bfe600"}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#CCFF00"}
                            >
                                Go to Dashboard <ExternalLink size={16} />
                            </button>
                        </a>
                    </>
                )}
            </div>
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}} />
        </div>
    );
}
