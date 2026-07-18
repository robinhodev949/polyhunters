"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import Link from "next/link";
import { 
    Cpu, ArrowRight, ArrowLeft, UploadCloud, Info, 
    CheckCircle, Shield, AlertTriangle, Layers, Github,
    HelpCircle, DollarSign, BarChart3, HelpCircle as HelpIcon 
} from "lucide-react";
import { AGENT_TEMPLATES } from "@/lib/agentTemplates";
import { AgentCard } from "@/components/AgentCard";

const CATEGORIES = ["Prediction Market", "Crypto", "Politics", "Sports", "DeFi", "Research"];
const AVAILABLE_SOURCES = [
    { id: "polymarket", name: "Polymarket" },
    { id: "kalshi", name: "Kalshi" },
    { id: "manifold", name: "Manifold" },
    { id: "onchain-evm", name: "On-chain EVM Contracts" }
];

export default function StudioPage() {
    const router = useRouter();
    const { address, isConnected } = useAccount();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    // Wizard Form State
    const [form, setForm] = useState({
        name: "",
        tagline: "",
        description: "",
        tags: [] as string[],
        runtimeOption: "template" as "template" | "byo",
        selectedTemplateId: AGENT_TEMPLATES[0].id,
        dockerImageUrl: AGENT_TEMPLATES[0].defaultDockerImage,
        githubUrl: "",
        webhookUrl: AGENT_TEMPLATES[0].defaultWebhookUrl,
        hookToken: "",
        marketSourceIds: ["polymarket"] as string[],
        pricePerDay: "5",
        enableABTest: false,
        pricePerDayVariantB: "5",
        abTestSplitPercent: "50"
    });

    // Pricing Suggestion State
    const [suggestion, setSuggestion] = useState<any>(null);
    const [loadingSuggestion, setLoadingSuggestion] = useState(false);

    // Fetch suggestion when tags change or when entering pricing step (step 4)
    useEffect(() => {
        if (step === 4 && form.tags.length > 0) {
            setLoadingSuggestion(true);
            fetch(`/api/agents/pricing-suggestion?tags=${form.tags.join(",")}`)
                .then(res => res.json())
                .then(data => {
                    setSuggestion(data);
                    if (data.suggestedPricePerDay) {
                        setForm(f => ({ ...f, pricePerDay: String(data.suggestedPricePerDay) }));
                    }
                    setLoadingSuggestion(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoadingSuggestion(false);
                });
        }
    }, [step, form.tags]);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const toggleTag = (tag: string) => {
        if (form.tags.includes(tag)) {
            setForm({ ...form, tags: form.tags.filter(t => t !== tag) });
        } else {
            setForm({ ...form, tags: [...form.tags, tag] });
        }
    };

    const toggleSource = (sourceId: string) => {
        if (form.marketSourceIds.includes(sourceId)) {
            if (form.marketSourceIds.length > 1) {
                setForm({ ...form, marketSourceIds: form.marketSourceIds.filter(id => id !== sourceId) });
            }
        } else {
            setForm({ ...form, marketSourceIds: [...form.marketSourceIds, sourceId] });
        }
    };

    const selectTemplate = (templateId: string) => {
        const t = AGENT_TEMPLATES.find(x => x.id === templateId);
        if (t) {
            setForm({
                ...form,
                selectedTemplateId: templateId,
                description: t.description,
                tags: t.suggestedTags,
                dockerImageUrl: t.defaultDockerImage,
                webhookUrl: t.defaultWebhookUrl
            });
        }
    };

    const handleNext = () => {
        if (step === 1) {
            if (!form.name || !form.tagline || !form.description || form.tags.length === 0) {
                setError("Please fill in all details and select at least one tag.");
                return;
            }
            if (form.tagline.length > 80) {
                setError("Tagline cannot exceed 80 characters.");
                return;
            }
        }
        if (step === 2) {
            if (form.runtimeOption === "byo" && !form.dockerImageUrl) {
                setError("Please specify your Docker image URL.");
                return;
            }
        }
        setError("");
        setStep(s => s + 1);
    };

    const handleBack = () => {
        setError("");
        setStep(s => s - 1);
    };

    const handleSubmit = async () => {
        setError("");
        if (!isConnected || !address) {
            setError("Please connect your wallet first.");
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                name: form.name,
                tagline: form.tagline,
                description: form.description,
                pricePerDay: Number(form.pricePerDay),
                tags: form.tags,
                dockerImageUrl: form.dockerImageUrl || null,
                githubUrl: form.githubUrl || null,
                webhookUrl: form.webhookUrl || null,
                hookToken: form.hookToken || null,
                ownerWallet: address,
                marketSourceIds: form.marketSourceIds,
                pricePerDayVariantB: form.enableABTest ? Number(form.pricePerDayVariantB) : null,
                abTestSplitPercent: form.enableABTest ? Number(form.abTestSplitPercent) : null
            };

            const res = await fetch("/api/agent/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Submission failed");
            }

            setIsSuccess(true);
            setTimeout(() => router.push("/marketplace"), 2500);
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div style={{ maxWidth: "600px", margin: "120px auto", textAlign: "center", padding: "0 24px" }}>
                <CheckCircle size={64} color="#0A7C4E" style={{ margin: "0 auto 24px", display: "block" }} />
                <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "12px", color: "#111111" }}>Agent Published!</h1>
                <p style={{ color: "#6B6B6B", fontSize: "1.1rem" }}>
                    Your model is now live in the PolyHunt studio. Redirecting to the feed...
                </p>
            </div>
        );
    }

    // Dummy preview agent matching prisma model shape
    const previewAgent = {
        id: "preview-temp-id",
        name: form.name || "Untitled Agent",
        tagline: form.tagline || "Add a catchy tagline to represent your agent strategy...",
        description: form.description,
        pricePerDay: Number(form.pricePerDay) || 5,
        status: "live",
        roi: 0.0,
        tags: form.tags,
        upvotes: 0,
        totalRentals: 0,
        ownerWallet: address || "",
        marketSourceIds: form.marketSourceIds
    } as any;

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "100px 24px 80px", color: "#111111", fontFamily: "var(--font-sans)" }}>
            
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <h1 style={{ fontSize: "2.4rem", fontWeight: 800, margin: "0 0 8px 0", letterSpacing: "-0.03em" }}>
                    Creator Studio
                </h1>
                <p style={{ fontSize: "1.05rem", color: "#6B6B6B", margin: 0 }}>
                    Deploy, price, and distribute prediction market AI agents.
                </p>
            </div>

            {/* Progress Bar */}
            <div style={{ background: "#E8E8E8", height: "4px", borderRadius: "2px", marginBottom: "40px", position: "relative" }}>
                <div style={{
                    background: "#CCFF00",
                    height: "100%",
                    borderRadius: "2px",
                    width: `${(step / 5) * 100}%`,
                    transition: "width 0.25s ease-in-out"
                }} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "0.8rem", color: "#6B6B6B", fontWeight: 600 }}>
                    <span style={{ color: step >= 1 ? "#111111" : "#6B6B6B" }}>1. Basics</span>
                    <span style={{ color: step >= 2 ? "#111111" : "#6B6B6B" }}>2. Runtime</span>
                    <span style={{ color: step >= 3 ? "#111111" : "#6B6B6B" }}>3. Markets</span>
                    <span style={{ color: step >= 4 ? "#111111" : "#6B6B6B" }}>4. Pricing</span>
                    <span style={{ color: step >= 5 ? "#111111" : "#6B6B6B" }}>5. Review</span>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.25)",
                    padding: "12px 16px", borderRadius: "8px", marginBottom: "24px", color: "#B91C1C",
                    fontWeight: 500
                }}>
                    <AlertTriangle size={18} />
                    <span style={{ fontSize: "0.9rem" }}>{error}</span>
                </div>
            )}

            {/* Wallet Warn */}
            {!isConnected && (
                <div style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    background: "rgba(255, 196, 0, 0.1)", border: "1px solid rgba(255, 196, 0, 0.4)",
                    padding: "12px 16px", borderRadius: "8px", marginBottom: "24px", color: "#92600A",
                    fontWeight: 500
                }}>
                    <Info size={18} />
                    <span style={{ fontSize: "0.9rem" }}>Please connect your EVM wallet to list agents on Robinhood Chain L2.</span>
                </div>
            )}

            {/* Main Form container */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E8E8E8", borderRadius: "12px", padding: "32px", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
                
                {/* ── STEP 1: BASICS ── */}
                {step === 1 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0 }}>Step 1: Agent Profile Basics</h3>
                        
                        <div>
                            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 700, marginBottom: "8px" }}>Agent Name</label>
                            <input 
                                required name="name" type="text" value={form.name} onChange={handleTextChange} 
                                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #E8E8E8", outline: "none", fontSize: "0.95rem" }} 
                                placeholder="e.g. SentimentOracle" 
                            />
                        </div>

                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                <label style={{ fontSize: "0.9rem", fontWeight: 700 }}>Tagline</label>
                                <span style={{ fontSize: "0.8rem", color: form.tagline.length > 80 ? "#B91C1C" : "#9CA3AF" }}>
                                    {form.tagline.length}/80 chars
                                </span>
                            </div>
                            <input 
                                required name="tagline" type="text" value={form.tagline} onChange={handleTextChange} 
                                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #E8E8E8", outline: "none", fontSize: "0.95rem" }} 
                                placeholder="Catchy one-liner describing your bot strategy..." 
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 700, marginBottom: "8px" }}>Description</label>
                            <textarea 
                                required name="description" value={form.description} onChange={handleTextChange} rows={4}
                                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #E8E8E8", outline: "none", fontSize: "0.95rem", resize: "vertical" }} 
                                placeholder="Explain data inputs, models used (eg. sentiment, LLMs, technicals), and safety criteria..." 
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 700, marginBottom: "10px" }}>Category Tags (select all that apply)</label>
                            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                {CATEGORIES.map(tag => {
                                    const selected = form.tags.includes(tag);
                                    return (
                                        <button
                                            type="button"
                                            key={tag}
                                            onClick={() => toggleTag(tag)}
                                            style={{
                                                padding: "8px 16px", borderRadius: "8px", fontSize: "0.85rem",
                                                fontWeight: 600, cursor: "pointer", border: "1px solid",
                                                transition: "all 0.15s",
                                                backgroundColor: selected ? "#165DFC" : "#FFFFFF",
                                                borderColor: selected ? "#165DFC" : "#E8E8E8",
                                                color: selected ? "#FFFFFF" : "#6B6B6B"
                                            }}
                                        >
                                            {tag}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── STEP 2: RUNTIME ── */}
                {step === 2 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0 }}>Step 2: Deployment & Runtime</h3>
                        
                        <div>
                            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 700, marginBottom: "12px" }}>Select Starting Strategy Template</label>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
                                {AGENT_TEMPLATES.map(t => (
                                    <div 
                                        key={t.id}
                                        onClick={() => selectTemplate(t.id)}
                                        style={{
                                            border: `2px solid ${form.selectedTemplateId === t.id && form.runtimeOption === "template" ? "#CCFF00" : "#E8E8E8"}`,
                                            borderRadius: "10px", padding: "16px", cursor: "pointer",
                                            background: form.selectedTemplateId === t.id && form.runtimeOption === "template" ? "rgba(204,255,0,0.02)" : "#FFFFFF",
                                            transition: "all 0.15s"
                                        }}
                                    >
                                        <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "6px" }}>{t.name}</div>
                                        <div style={{ fontSize: "0.85rem", color: "#6B6B6B", lineHeight: 1.4 }}>{t.description}</div>
                                        <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                                            {t.suggestedTags.map(st => (
                                                <span key={st} style={{ fontSize: "0.75rem", background: "#FAFAFA", padding: "2px 8px", borderRadius: "4px", border: "1px solid #E8E8E8" }}>{st}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "12px 0" }}>
                            <input 
                                type="checkbox" id="byoCheck"
                                checked={form.runtimeOption === "byo"}
                                onChange={(e) => setForm({ ...form, runtimeOption: e.target.checked ? "byo" : "template" })}
                                style={{ width: "18px", height: "18px", cursor: "pointer" }}
                            />
                            <label htmlFor="byoCheck" style={{ fontSize: "0.95rem", fontWeight: 700, cursor: "pointer" }}>
                                Bring your own custom Docker Image
                            </label>
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 700, marginBottom: "8px" }}>Docker Image URL</label>
                            <input 
                                name="dockerImageUrl" type="text" value={form.dockerImageUrl} onChange={handleTextChange}
                                disabled={form.runtimeOption === "template"}
                                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #E8E8E8", outline: "none", fontSize: "0.95rem", background: form.runtimeOption === "template" ? "#FAFAFA" : "#FFFFFF" }} 
                                placeholder="docker.io/username/image-name:tag" 
                            />
                        </div>

                        <div>
                            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.9rem", fontWeight: 700, marginBottom: "8px" }}>
                                <Github size={16} /> GitHub Repository URL
                            </label>
                            <input 
                                name="githubUrl" type="url" value={form.githubUrl} onChange={handleTextChange}
                                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #E8E8E8", outline: "none", fontSize: "0.95rem" }} 
                                placeholder="https://github.com/your-username/agent-repo" 
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 700, marginBottom: "8px" }}>OpenClaw Gateway Webhook (optional)</label>
                            <input 
                                name="webhookUrl" type="url" value={form.webhookUrl} onChange={handleTextChange}
                                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #E8E8E8", outline: "none", fontSize: "0.95rem" }} 
                                placeholder="https://your-gateway.openclaw.ai/hooks/agent" 
                            />
                        </div>
                    </div>
                )}

                {/* ── STEP 3: MARKETS ── */}
                {step === 3 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0 }}>Step 3: Prediction Markets Integrations</h3>
                        <p style={{ margin: 0, fontSize: "0.9rem", color: "#6B6B6B", lineHeight: 1.5 }}>
                            Choose which prediction markets this agent is built to read/write. If you select Polymarket, ensure your agent is loaded with API keys or follows builder codes to execute trades.
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {AVAILABLE_SOURCES.map(source => {
                                const selected = form.marketSourceIds.includes(source.id);
                                return (
                                    <div 
                                        key={source.id}
                                        onClick={() => toggleSource(source.id)}
                                        style={{
                                            border: `1px solid ${selected ? "#165DFC" : "#E8E8E8"}`,
                                            borderRadius: "10px", padding: "16px", cursor: "pointer",
                                            background: selected ? "rgba(22,93,252,0.02)" : "#FFFFFF",
                                            display: "flex", justifyContent: "space-between", alignItems: "center",
                                            transition: "all 0.15s"
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: "1rem" }}>{source.name}</div>
                                            <div style={{ fontSize: "0.8rem", color: "#9CA3AF" }}>Integrated source endpoint</div>
                                        </div>
                                        <div style={{
                                            width: "24px", height: "24px", borderRadius: "50%",
                                            border: `2px solid ${selected ? "#165DFC" : "#9CA3AF"}`,
                                            background: selected ? "#165DFC" : "none",
                                            display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF"
                                        }}>
                                            {selected && <CheckCircle size={14} fill="currentColor" color="#165DFC" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ── STEP 4: PRICING ── */}
                {step === 4 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0 }}>Step 4: Pricing & Revenue Rules</h3>

                        {/* pricing suggestion widget */}
                        <div style={{ background: "#FAFAFA", border: "1px solid #E8E8E8", borderRadius: "10px", padding: "20px" }}>
                            <h4 style={{ margin: "0 0 8px 0", fontSize: "0.95rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
                                <DollarSign size={16} color="#165DFC" /> Smart Pricing Suggestion
                            </h4>
                            {loadingSuggestion ? (
                                <div style={{ fontSize: "0.85rem", color: "#6B6B6B" }}>Scanning similar listings in category...</div>
                            ) : suggestion ? (
                                <div>
                                    <div style={{ fontSize: "0.9rem", color: "#111111", marginBottom: "4px" }}>
                                        {suggestion.sampleSize > 0 
                                            ? `Similar agents charge ~${suggestion.suggestedPricePerDay} USDC/day (based on ${suggestion.sampleSize} live agents)`
                                            : suggestion.note
                                        }
                                    </div>
                                    {suggestion.sampleSize > 0 && (
                                        <div style={{ fontSize: "0.8rem", color: "#9CA3AF" }}>
                                            Price spread: 25% percentile: {suggestion.p25} USDC/day · 75% percentile: {suggestion.p75} USDC/day
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div style={{ fontSize: "0.85rem", color: "#6B6B6B" }}>No suggestion calculated yet.</div>
                            )}
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 700, marginBottom: "8px" }}>Daily Rental Price (USDC)</label>
                            <input 
                                required name="pricePerDay" type="number" min="1" value={form.pricePerDay} onChange={handleTextChange} 
                                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #E8E8E8", outline: "none", fontSize: "0.95rem" }} 
                                placeholder="USDC amount charged per 24 hour slot" 
                            />
                        </div>

                        {/* A/B Pricing Test toggles */}
                        <div style={{ borderTop: "1px solid #E8E8E8", paddingTop: "20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                                <input 
                                    type="checkbox" id="abTestCheck"
                                    checked={form.enableABTest}
                                    onChange={(e) => setForm({ ...form, enableABTest: e.target.checked })}
                                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                                />
                                <label htmlFor="abTestCheck" style={{ fontSize: "0.95rem", fontWeight: 700, cursor: "pointer" }}>
                                    Enable A/B Pricing Experiment
                                </label>
                            </div>
                            
                            {form.enableABTest && (
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", padding: "16px", background: "rgba(22,93,252,0.03)", border: "1px solid rgba(22,93,252,0.1)", borderRadius: "8px" }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>Variant B Price (USDC/day)</label>
                                        <input 
                                            name="pricePerDayVariantB" type="number" min="1" value={form.pricePerDayVariantB} onChange={handleTextChange}
                                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #E8E8E8", outline: "none", fontSize: "0.9rem" }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>Traffic Split Split % (B variant)</label>
                                        <input 
                                            name="abTestSplitPercent" type="number" min="1" max="99" value={form.abTestSplitPercent} onChange={handleTextChange}
                                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #E8E8E8", outline: "none", fontSize: "0.9rem" }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── STEP 5: REVIEW ── */}
                {step === 5 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0 }}>Step 5: Review & Publish</h3>
                        <p style={{ margin: 0, fontSize: "0.9rem", color: "#6B6B6B" }}>
                            Review how your agent card will appear in the main feed to other hunters:
                        </p>

                        <div style={{ pointerEvents: "none" }}>
                            <AgentCard agent={previewAgent} />
                        </div>

                        <div style={{ border: "1px solid #E8E8E8", padding: "16px", borderRadius: "8px", background: "#FAFAFA", fontSize: "0.85rem", color: "#6B6B6B", lineHeight: 1.5 }}>
                            <strong>Runtime Config Summary:</strong>
                            <div style={{ marginTop: "4px" }}>• Template ID: {form.selectedTemplateId} ({form.runtimeOption})</div>
                            <div>• Docker Image: <code>{form.dockerImageUrl}</code></div>
                            <div>• Markets: {form.marketSourceIds.join(", ")}</div>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <hr style={{ border: "none", borderTop: "1px solid #E8E8E8", margin: "32px 0 24px 0" }} />
                
                <div style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
                    {step > 1 ? (
                        <button 
                            onClick={handleBack}
                            style={{
                                background: "#FFFFFF", color: "#111111", border: "1px solid #E8E8E8",
                                padding: "12px 24px", borderRadius: "8px", fontWeight: 600, fontSize: "0.95rem",
                                cursor: "pointer", display: "flex", alignItems: "center", gap: "8px"
                            }}
                        >
                            <ArrowLeft size={16} /> Back
                        </button>
                    ) : (
                        <div />
                    )}

                    {step < 5 ? (
                        <button 
                            onClick={handleNext}
                            style={{
                                background: "#165DFC", color: "#FFFFFF", border: "none",
                                padding: "12px 28px", borderRadius: "8px", fontWeight: 600, fontSize: "0.95rem",
                                cursor: "pointer", display: "flex", alignItems: "center", gap: "8px"
                            }}
                        >
                            Continue <ArrowRight size={16} />
                        </button>
                    ) : (
                        <button 
                            onClick={handleSubmit}
                            disabled={isSubmitting || !isConnected}
                            style={{
                                background: "#CCFF00", color: "#000000", border: "none",
                                padding: "12px 28px", borderRadius: "8px", fontWeight: 700, fontSize: "0.95rem",
                                cursor: (isSubmitting || !isConnected) ? "not-allowed" : "pointer",
                                display: "flex", alignItems: "center", gap: "8px",
                                opacity: (isSubmitting || !isConnected) ? 0.7 : 1,
                                boxShadow: "0 2px 8px rgba(204,255,0,0.15)"
                            }}
                        >
                            {isSubmitting ? "Deploying..." : <><UploadCloud size={16} /> Publish Agent</>}
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}
