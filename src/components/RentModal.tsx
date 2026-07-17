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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] p-6 backdrop-blur-sm">
            <div className="bg-bg-secondary rounded-2xl p-8 w-full max-w-[480px] relative shadow-2xl border border-border">
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 bg-transparent border-none cursor-pointer p-1">
                    <X size={20} className="text-text-muted" />
                </button>

                {/* Step: Configure */}
                {step === "configure" && (
                    <>
                        <h2 className="text-[1.3rem] font-bold m-0 mb-1 text-text-primary">
                            Rent {agent.name}
                        </h2>
                        <p className="text-text-secondary text-[0.9rem] m-0 mb-7">
                            {agent.tagline}
                        </p>

                        <div className="mb-5">
                            <label className="font-semibold text-text-secondary text-[0.9rem] block mb-2">
                                Rental Duration
                            </label>
                            <div className="flex gap-2">
                                {[1, 3, 7, 14, 30].map(d => (
                                    <button 
                                        key={d} 
                                        onClick={() => setDays(d)} 
                                        className={`flex-1 py-2 px-1 rounded-lg border cursor-pointer text-[0.85rem] transition-all duration-150 ${
                                            days === d 
                                                ? "bg-brand-lime border-brand-lime text-text-primary font-bold" 
                                                : "bg-transparent border-border text-text-secondary font-medium hover:border-text-muted"
                                        }`}
                                    >
                                        {d}d
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-brand/5 border border-brand/15 rounded-xl p-4 mb-6">
                            <div className="flex justify-between mb-2">
                                <span className="text-text-secondary text-[0.9rem]">Daily Rate</span>
                                <span className="font-semibold text-text-primary">{agent.pricePerDay} USDC</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-text-secondary text-[0.9rem]">Duration</span>
                                <span className="font-semibold text-text-primary">{days} days</span>
                            </div>
                            <div className="border-t border-brand/15 pt-2 flex justify-between">
                                <span className="font-bold text-text-primary">Total</span>
                                <span className="font-bold text-brand text-[1.1rem]">{totalCost} USDC</span>
                            </div>
                        </div>

                        {!isConnected && (
                            <p className="text-error text-[0.85rem] mb-3 text-center font-medium">
                                ⚠ Please connect your wallet first.
                            </p>
                        )}
                        {error && <p className="text-error text-[0.85rem] mb-3">{error}</p>}

                        <button 
                            onClick={handleInitiate} 
                            disabled={!isConnected || loading} 
                            className={`w-full py-3 rounded-lg text-[1rem] font-bold flex items-center justify-center gap-2 transition-all duration-150 shadow-[0_2px_8px_rgba(204,255,0,0.15)] ${
                                isConnected && !loading
                                    ? "bg-brand-lime text-text-primary cursor-pointer hover:bg-[#bfe600]"
                                    : "bg-brand-lime/50 text-text-primary/50 cursor-not-allowed"
                            }`}
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                            Continue — {totalCost} USDC <ArrowRight size={16} />
                        </button>
                    </>
                )}

                {/* Step: Pay */}
                {step === "pay" && (
                    <>
                        <h2 className="text-[1.3rem] font-bold m-0 mb-2 text-text-primary">
                            Send USDC Payment
                        </h2>
                        <p className="text-text-secondary text-[0.9rem] m-0 mb-5 leading-relaxed">
                            Send exactly <strong className="text-text-primary">{totalCost} USDC</strong> on Robinhood Chain to the escrow wallet.
                        </p>

                        {/* Interactive Direct Pay Button */}
                        <button 
                            onClick={handleDirectPay} 
                            disabled={isTxPending || isTxConfirming || loading}
                            className="w-full py-3.5 rounded-lg bg-brand text-white border-none text-[1rem] font-semibold cursor-pointer flex items-center justify-center gap-2 mb-5 transition-all duration-150 shadow-[0_4px_12px_rgba(22,93,252,0.2)] hover:bg-brand-dark"
                        >
                            {isTxPending || isTxConfirming ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <CreditCard size={18} />
                            )}
                            {isTxPending ? "Approve in Wallet..." : isTxConfirming ? "Confirming Payment..." : `Pay ${totalCost} USDC via Connected Wallet`}
                        </button>

                        {(txError || error) && (
                            <p className="text-error text-[0.85rem] mb-3 break-words">
                                {txError?.message || error}
                            </p>
                        )}

                        <div className="flex items-center gap-2 my-4 text-text-muted">
                            <div className="flex-1 h-[1px] bg-border"></div>
                            <span className="text-[0.75rem] uppercase font-bold">Or pay manually</span>
                            <div className="flex-1 h-[1px] bg-border"></div>
                        </div>

                        {/* Escrow wallet copy container */}
                        <div className="bg-bg-primary border border-border rounded-lg p-3.5 mb-4">
                            <div className="text-[0.75rem] text-text-muted mb-1.5 uppercase font-bold tracking-wider">
                                PolyHunt Escrow Wallet (Robinhood Chain)
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <code className="text-[0.8rem] text-text-primary break-all flex-1 font-mono">
                                    {escrowWallet}
                                </code>
                                <button onClick={() => copyToClipboard(escrowWallet)} className="bg-transparent border-none cursor-pointer flex-shrink-0">
                                    {copied ? <Check size={16} className="text-success" /> : <Copy size={16} className="text-text-secondary" />}
                                </button>
                            </div>
                        </div>

                        <p className="text-text-secondary text-[0.9rem] font-medium mb-2">
                            After sending, paste your transaction hash:
                        </p>
                        <input
                            type="text"
                            placeholder="e.g. 0xabcdef...123"
                            value={manualTxHash}
                            onChange={e => setManualTxHash(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-lg border border-border text-[0.85rem] text-text-primary mb-2 outline-none focus:border-brand"
                        />
                        <p className="text-text-muted text-[0.75rem] m-0 mb-4 leading-normal">
                            Provide the 0x-prefixed transaction hash from your wallet provider. The backend will strictly verify the on-chain receipt log before activating.
                        </p>

                        <button 
                            onClick={() => handleVerify()} 
                            disabled={!manualTxHash || loading} 
                            className={`w-full py-3 rounded-lg text-[1rem] font-bold flex items-center justify-center gap-2 transition-all duration-150 ${
                                manualTxHash && !loading
                                    ? "bg-brand-lime text-text-primary cursor-pointer hover:bg-[#bfe600]"
                                    : "bg-brand-lime/50 text-text-primary/50 cursor-not-allowed"
                            }`}
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                            Verify & Activate Agent
                        </button>
                    </>
                )}

                {/* Step: Done */}
                {step === "done" && (
                    <>
                        <div className="text-center py-2 pb-4">
                            <div className="text-[3rem] mb-3">🎉</div>
                            <h2 className="text-[1.4rem] font-bold m-0 mb-1.5 text-text-primary">
                                Agent is Live!
                            </h2>
                            <p className="text-text-secondary m-0 mb-5 text-[0.9rem]">
                                <strong className="text-text-primary">{agent.name}</strong> is now trading on your prediction markets.
                            </p>
                        </div>

                        {/* Rental Code */}
                        <div className="bg-brand/5 border-2 border-brand rounded-xl p-4 mb-4">
                            <div className="text-[0.7rem] font-bold text-brand uppercase tracking-wider mb-2">
                                🔑 Your Rental Code — Save This!
                            </div>
                            <div className="flex items-center justify-between">
                                <code className="text-[1.3rem] font-extrabold text-brand font-mono tracking-wider">
                                    {result?.rentalCode || "RC-loading"}
                                </code>
                                <button onClick={() => {
                                    navigator.clipboard.writeText(result?.rentalCode || "");
                                    setCodeCopied(true);
                                    setTimeout(() => setCodeCopied(false), 2000);
                                }} className="bg-transparent border-none cursor-pointer p-1">
                                    {codeCopied ? <Check size={18} className="text-success" /> : <Copy size={18} className="text-brand" />}
                                </button>
                            </div>
                            <p className="text-[0.75rem] text-text-secondary m-0 mt-2 leading-normal">
                                Use this code in your Dashboard and the PolyHunt API to authenticate your agent connection.
                            </p>
                        </div>

                        {/* Expiry */}
                        <div className="bg-success/5 border border-success/20 rounded-lg p-3 mb-5">
                            <div className="flex justify-between mb-1">
                                <span className="text-text-secondary text-[0.85rem]">Expires</span>
                                <span className="font-semibold text-[0.85rem] text-text-primary">
                                    {result?.expiresAt ? new Date(result.expiresAt).toLocaleDateString() : "—"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-secondary text-[0.85rem]">Status</span>
                                <span className="font-semibold text-[0.85rem] text-success">✓ Running</span>
                            </div>
                        </div>

                        <a href="/dashboard" className="no-underline">
                            <button className="w-full py-3 rounded-lg bg-brand-lime text-text-primary border-none text-[1rem] font-bold cursor-pointer flex items-center justify-center gap-2 transition-all duration-150 hover:bg-[#bfe600]">
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
