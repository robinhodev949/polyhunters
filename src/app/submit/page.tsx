"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { UploadCloud, CheckCircle, ShieldCheck, AlertCircle, Github, Info, Layers } from "lucide-react";
import Link from "next/link";

const AVAILABLE_SOURCES = [
  { id: "polymarket", name: "Polymarket" },
  { id: "kalshi", name: "Kalshi" },
  { id: "manifold", name: "Manifold" },
  { id: "onchain-evm", name: "On-chain EVM Contracts" }
];

export default function SubmitPage() {
    const router = useRouter();
    const { address, isConnected } = useAccount();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: "",
        tagline: "",
        description: "",
        pricePerDay: "",
        tags: "",
        dockerImageUrl: "",
        githubUrl: "",
        webhookUrl: "",
        hookToken: "",
    });

    const [selectedSources, setSelectedSources] = useState<string[]>(["polymarket"]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const toggleSource = (sourceId: string) => {
        if (selectedSources.includes(sourceId)) {
            // Keep at least one selected
            if (selectedSources.length > 1) {
                setSelectedSources(selectedSources.filter(id => id !== sourceId));
            }
        } else {
            setSelectedSources([...selectedSources, sourceId]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!isConnected || !address) {
            setError("Please connect your EVM wallet first to submit an agent.");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch("/api/agent/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    tagline: form.tagline,
                    description: form.description,
                    pricePerDay: Number(form.pricePerDay),
                    tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
                    dockerImageUrl: form.dockerImageUrl || null,
                    githubUrl: form.githubUrl || null,
                    webhookUrl: form.webhookUrl || null,
                    hookToken: form.hookToken || null,
                    ownerWallet: address,
                    marketSourceIds: selectedSources
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Submission failed");
            }

            setIsSuccess(true);
            setTimeout(() => router.push("/marketplace"), 2500);
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div style={{ maxWidth: "600px", margin: "120px auto", textAlign: "center", padding: "0 24px" }}>
                <CheckCircle size={64} color="#0A7C4E" style={{ margin: "0 auto 24px", display: "block" }} />
                <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "12px", color: "#111111" }}>Agent Submitted!</h1>
                <p style={{ color: "#6B6B6B", fontSize: "1.1rem" }}>
                    Your agent has been listed on PolyHunt. Redirecting to the marketplace...
                </p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "100px 24px 60px" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <h1 style={{ fontSize: "2.4rem", fontWeight: 700, margin: "0 0 12px 0", letterSpacing: "-0.02em", fontFamily: "Inter, sans-serif", color: "#111111" }}>
                    List Your Agent
                </h1>
                <p style={{ fontSize: "1.1rem", color: "#6B6B6B", margin: 0, fontWeight: 400 }}>
                    List your prediction agent. Earn USDC passively on Robinhood Chain when users rent and run your model.
                </p>
            </div>

            {/* Banner Info */}
            <div style={{
                display: "flex", alignItems: "flex-start", gap: "12px",
                background: "rgba(22,93,252,0.04)", border: "1px solid rgba(22,93,252,0.15)",
                padding: "16px", borderRadius: "10px", marginBottom: "24px"
            }}>
                <Info size={18} color="#165DFC" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                    <p style={{ fontSize: "0.9rem", color: "#111111", fontWeight: 600, margin: "0 0 4px 0" }}>Developer Requirements</p>
                    <p style={{ fontSize: "0.85rem", color: "#6B6B6B", margin: 0, lineHeight: 1.6 }}>
                        We support agents connecting to multiple prediction market protocols using the official APIs. For Polymarket, we recommend using the official{" "}
                        <a href="https://github.com/Polymarket/clob-client" target="_blank" rel="noopener noreferrer" style={{ color: "#165DFC", fontWeight: 600 }}>Polymarket CLOB client</a>. 
                        Rent payments are settled in USDC on Robinhood Chain L2.
                    </p>
                </div>
            </div>

            {!isConnected && (
                <div style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    background: "rgba(255, 196, 0, 0.1)", border: "1px solid rgba(255, 196, 0, 0.4)",
                    padding: "12px 16px", borderRadius: "8px", marginBottom: "24px", color: "#92600A",
                    fontWeight: 500
                }}>
                    <AlertCircle size={18} />
                    <span style={{ fontSize: "0.9rem" }}>Please connect your EVM wallet to submit an agent.</span>
                </div>
            )}

            {error && (
                <div style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.25)",
                    padding: "12px 16px", borderRadius: "8px", marginBottom: "24px", color: "#B91C1C",
                    fontWeight: 500
                }}>
                    <AlertCircle size={18} />
                    <span style={{ fontSize: "0.9rem" }}>{error}</span>
                </div>
            )}

            <div style={{ padding: "32px", border: "1px solid #E8E8E8", borderRadius: "12px", background: "#FFFFFF" }}>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                        <div>
                            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#111111", marginBottom: "8px" }}>Agent Name</label>
                            <input required name="name" type="text" value={form.name} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #E8E8E8", outline: "none", fontSize: "0.9rem" }} placeholder="e.g. SentientOracle" />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#111111", marginBottom: "8px" }}>Price (USDC/Day)</label>
                            <input required name="pricePerDay" type="number" min="1" value={form.pricePerDay} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #E8E8E8", outline: "none", fontSize: "0.9rem" }} placeholder="e.g. 15" />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#111111", marginBottom: "8px" }}>Tagline</label>
                        <input required name="tagline" type="text" value={form.tagline} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #E8E8E8", outline: "none", fontSize: "0.9rem" }} placeholder="Catchy one-liner describing your strategy..." />
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#111111", marginBottom: "8px" }}>Full Description</label>
                        <textarea
                            required name="description" value={form.description} onChange={handleChange}
                            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #E8E8E8", outline: "none", fontSize: "0.9rem", resize: "vertical" }} rows={4}
                            placeholder="Explain the data feeds, risk models, and execution details of your trading algorithm..."
                        />
                    </div>

                    {/* Pluggable Prediction Markets Selector */}
                    <div>
                        <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.9rem", fontWeight: 600, color: "#111111", marginBottom: "8px" }}>
                            <Layers size={16} color="#165DFC" /> Supported Prediction Markets
                        </label>
                        <p style={{ fontSize: "0.85rem", color: "#6B6B6B", margin: "0 0 10px 0" }}>
                            Select the target market networks this agent is designed to trade on.
                        </p>
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            {AVAILABLE_SOURCES.map(source => {
                                const selected = selectedSources.includes(source.id);
                                return (
                                    <button
                                        type="button"
                                        key={source.id}
                                        onClick={() => toggleSource(source.id)}
                                        style={{
                                            padding: "8px 16px",
                                            borderRadius: "8px",
                                            fontSize: "0.85rem",
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            border: "1px solid",
                                            transition: "all 0.15s",
                                            backgroundColor: selected ? "#165DFC" : "#FFFFFF",
                                            borderColor: selected ? "#165DFC" : "#E8E8E8",
                                            color: selected ? "#FFFFFF" : "#6B6B6B",
                                        }}
                                    >
                                        {source.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#111111", marginBottom: "8px" }}>Tags (comma separated)</label>
                        <input name="tags" type="text" value={form.tags} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #E8E8E8", outline: "none", fontSize: "0.9rem" }} placeholder="e.g. Politics, NLP, Sentiment" />
                    </div>

                    {/* GitHub URL */}
                    <div>
                        <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.9rem", fontWeight: 600, color: "#111111", marginBottom: "8px" }}>
                            <Github size={16} color="#111111" />
                            GitHub Repository{" "}
                            <span style={{ color: "#0A7C4E", fontWeight: 600, fontSize: "0.8rem", background: "rgba(10,124,78,0.08)", padding: "2px 6px", borderRadius: "4px" }}>Recommended</span>
                        </label>
                        <p style={{ fontSize: "0.85rem", color: "#6B6B6B", margin: "0 0 8px 0" }}>
                            Link your agent repo. Verified open source code significantly improves trust and installation rates on PolyHunt.
                        </p>
                        <input name="githubUrl" type="url" value={form.githubUrl} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #E8E8E8", outline: "none", fontSize: "0.9rem" }} placeholder="https://github.com/yourusername/your-agent" />
                    </div>

                    {/* Docker Image URL */}
                    <div>
                        <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.9rem", fontWeight: 600, color: "#111111", marginBottom: "8px" }}>
                            <ShieldCheck size={16} color="#165DFC" /> Docker Image URL <span style={{ color: "#9CA3AF", fontWeight: 400 }}>(recommended)</span>
                        </label>
                        <p style={{ fontSize: "0.85rem", color: "#6B6B6B", margin: "0 0 8px 0" }}>
                            The compiled Docker image URL of your agent deployment package. Learn more in the <Link href="/docs" style={{ color: "#165DFC", fontWeight: 600 }}>Docs</Link>.
                        </p>
                        <input name="dockerImageUrl" type="text" value={form.dockerImageUrl} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #E8E8E8", outline: "none", fontSize: "0.9rem" }} placeholder="e.g. docker.io/yourusername/agent-name:latest" />
                    </div>

                    {/* Webhook URL */}
                    <div>
                        <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.9rem", fontWeight: 600, color: "#111111", marginBottom: "8px" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#165DFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                            OpenClaw Webhook URL <span style={{ color: "#9CA3AF", fontWeight: 400 }}>(optional)</span>
                        </label>
                        <p style={{ fontSize: "0.85rem", color: "#6B6B6B", margin: "0 0 8px 0" }}>
                            Optional web hook endpoint to stream operational signals or trigger custom orchestration logs.
                        </p>
                        <input name="webhookUrl" type="url" value={form.webhookUrl} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #E8E8E8", outline: "none", fontSize: "0.9rem" }} placeholder="https://your-gateway.openclaw.ai/hooks/agent" />
                    </div>

                    {/* Hook Token */}
                    {form.webhookUrl && (
                        <div>
                            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#111111", marginBottom: "8px" }}>
                                Hook Token <span style={{ color: "#9CA3AF", fontWeight: 400 }}>(OpenClaw secret)</span>
                            </label>
                            <input name="hookToken" type="password" value={form.hookToken} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #E8E8E8", outline: "none", fontSize: "0.9rem" }} placeholder="your-secret-hook-token" />
                        </div>
                    )}

                    <hr style={{ border: "none", borderTop: "1px solid #E8E8E8", margin: "8px 0" }} />

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                            width: "100%", padding: "14px", fontSize: "1rem", fontWeight: 700,
                            justifyContent: "center", display: "flex", alignItems: "center", gap: "8px",
                            background: "#CCFF00", color: "#000000", border: "none",
                            borderRadius: "8px", cursor: isSubmitting ? "not-allowed" : "pointer",
                            opacity: isSubmitting ? 0.7 : 1,
                            transition: "background 0.15s",
                            boxShadow: "0 2px 8px rgba(204,255,0,0.15)"
                        }}
                        onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.background = "#bfe600"; }}
                        onMouseLeave={e => { if (!isSubmitting) e.currentTarget.style.background = "#CCFF00"; }}
                    >
                        {isSubmitting ? (
                            <span>Saving to database...</span>
                        ) : (
                            <><UploadCloud size={18} /> Submit Agent</>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
