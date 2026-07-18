"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import Link from "next/link";
import { 
    ArrowLeft, ArrowUp, Play, Github, Shield, 
    MessageSquare, HelpCircle, Code, Check, Copy, Award
} from "lucide-react";
import { RentModal } from "@/components/RentModal";
import { RecommendationRails } from "@/components/RecommendationRails";

interface Comment {
    id: string;
    wallet: string;
    username: string | null;
    avatarUrl: string | null;
    content: string;
    createdAt: string;
    isQA: boolean;
    replies?: Comment[];
}

export default function AgentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    
    const router = useRouter();
    const { address, isConnected } = useAccount();
    
    const [agent, setAgent] = useState<any>(null);
    const [loadingAgent, setLoadingAgent] = useState(true);
    const [showRentModal, setShowRentModal] = useState(false);

    // Comments states
    const [comments, setComments] = useState<Comment[]>([]);
    const [loadingComments, setLoadingComments] = useState(true);
    const [commentText, setCommentText] = useState("");
    const [commentType, setCommentType] = useState<"discussion" | "qa">("discussion");
    
    // Reply states
    const [replyingToId, setReplyingToId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");

    // Upvote states
    const [upvotesCount, setUpvotesCount] = useState(0);
    const [hasUpvoted, setHasUpvoted] = useState(false);

    // Clipboard copy state
    const [badgeCopied, setBadgeCopied] = useState(false);

    const loadAgent = () => {
        setLoadingAgent(true);
        fetch(`/api/agents/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.agent) {
                    setAgent(data.agent);
                    setUpvotesCount(data.agent.upvotes);
                }
                setLoadingAgent(false);
            })
            .catch(err => {
                console.error("Failed to load agent:", err);
                setLoadingAgent(false);
            });
    };

    const loadComments = () => {
        setLoadingComments(true);
        fetch(`/api/agents/${id}/comments`)
            .then(res => res.json())
            .then(data => {
                if (data.comments) {
                    setComments(data.comments);
                }
                setLoadingComments(false);
            })
            .catch(err => {
                console.error("Failed to load comments:", err);
                setLoadingComments(false);
            });
    };

    useEffect(() => {
        loadAgent();
        loadComments();
    }, [id]);

    const handleUpvote = async () => {
        if (hasUpvoted) {
            setUpvotesCount(prev => prev - 1);
            setHasUpvoted(false);
            return;
        }
        setUpvotesCount(prev => prev + 1);
        setHasUpvoted(true);
        try {
            await fetch(`/api/agents/${id}/upvote`, { method: "POST" });
        } catch {
            setUpvotesCount(prev => prev - 1);
            setHasUpvoted(false);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isConnected || !address || !commentText.trim()) return;

        try {
            const res = await fetch(`/api/agents/${id}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    wallet: address,
                    content: commentText.trim(),
                    isQA: commentType === "qa"
                })
            });

            if (res.ok) {
                setCommentText("");
                loadComments();
            }
        } catch (err) {
            console.error("Failed to submit comment:", err);
        }
    };

    const handleReplySubmit = async (parentId: string) => {
        if (!isConnected || !address || !replyText.trim()) return;

        try {
            const res = await fetch(`/api/agents/${id}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    wallet: address,
                    content: replyText.trim(),
                    parentId
                })
            });

            if (res.ok) {
                setReplyText("");
                setReplyingToId(null);
                loadComments();
            }
        } catch (err) {
            console.error("Failed to submit reply:", err);
        }
    };

    const copyBadgeMarkdown = () => {
        const badgeUrl = `${window.location.origin}/api/agents/${id}/badge`;
        const linkUrl = window.location.href;
        const markdown = `[![Featured on PolyHunt](${badgeUrl})](${linkUrl})`;
        navigator.clipboard.writeText(markdown);
        setBadgeCopied(true);
        setTimeout(() => setBadgeCopied(false), 2000);
    };

    if (loadingAgent) {
        return (
            <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ border: "3px solid #E8E8E8", borderTopColor: "#165DFC", borderRadius: "50%", width: "32px", height: "32px", animation: "spin 1s linear infinite" }} />
                <style dangerouslySetInnerHTML={{__html: `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}} />
            </div>
        );
    }

    if (!agent) {
        return (
            <div style={{ maxWidth: "600px", margin: "120px auto", textAlign: "center", padding: "0 24px" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#111111", marginBottom: "12px" }}>Agent Not Found</h1>
                <p style={{ color: "#6B6B6B" }}>The agent you are looking for does not exist or has been removed.</p>
                <Link href="/marketplace" style={{ color: "#165DFC", fontWeight: 600, textDecoration: "none", display: "inline-block", marginTop: "16px" }}>
                    Back to Marketplace
                </Link>
            </div>
        );
    }

    // Filter comments based on Tab: Q&A shows only isQA comments; Discussion shows non-Q&A parent comments
    const filteredComments = comments.filter(c => commentType === "qa" ? c.isQA : !c.isQA);

    return (
        <div style={{ background: "#FAFAFA", minHeight: "100vh", paddingBottom: "80px", color: "#111111", fontFamily: "var(--font-sans)" }}>
            
            {/* Top Bar */}
            <div style={{ background: "#FFFFFF", borderBottom: "1px solid #E8E8E8", padding: "16px 24px" }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                    <Link href="/marketplace" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#6B6B6B", textDecoration: "none", fontSize: "0.9rem", fontWeight: 600 }}>
                        <ArrowLeft size={16} /> Back to marketplace
                    </Link>
                </div>
            </div>

            {/* Content Body */}
            <div style={{ maxWidth: "1100px", margin: "32px auto 0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "1fr 340px", gap: "32px" }}>
                
                {/* Left Column: Details & Comments */}
                <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                    
                    {/* Header Details Card */}
                    <div style={{ background: "#FFFFFF", border: "1px solid #E8E8E8", borderRadius: "16px", padding: "32px", display: "flex", gap: "28px", alignItems: "start" }}>
                        <div style={{ width: "90px", height: "90px", borderRadius: "16px", background: "linear-gradient(135deg, #165DFC 0%, #0047ca 100%)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #E8E8E8", flexShrink: 0 }}>
                            <span style={{ fontSize: "2.8rem", fontWeight: 800, color: "#FFFFFF" }}>{agent.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "8px" }}>
                                <h1 style={{ fontSize: "1.8rem", fontWeight: 800, margin: 0 }}>{agent.name}</h1>
                                {agent.status === "live" ? (
                                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0A7C4E", background: "rgba(10,124,78,0.1)", padding: "2px 8px", borderRadius: "12px", textTransform: "uppercase" }}>Live</span>
                                ) : (
                                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#DA552F", background: "rgba(218,85,47,0.1)", padding: "2px 8px", borderRadius: "12px", textTransform: "uppercase" }}>Beta</span>
                                )}
                            </div>
                            <p style={{ fontSize: "1.1rem", color: "#6B6B6B", lineHeight: 1.5, margin: "0 0 16px 0" }}>{agent.tagline}</p>
                            
                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                                {agent.tags.map((t: string) => (
                                    <span key={t} style={{ fontSize: "0.8rem", background: "#FAFAFA", border: "1px solid #E8E8E8", padding: "4px 10px", borderRadius: "6px", color: "#6B6B6B" }}>{t}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Full Description & Tech Stack */}
                    <div style={{ background: "#FFFFFF", border: "1px solid #E8E8E8", borderRadius: "16px", padding: "32px" }}>
                        <h2 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "16px" }}>Strategy Description</h2>
                        <p style={{ fontSize: "1rem", color: "#6B6B6B", lineHeight: 1.7, margin: "0 0 24px 0", whiteSpace: "pre-line" }}>
                            {agent.description || "No strategy description provided."}
                        </p>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", borderTop: "1px solid #E8E8E8", paddingTop: "24px" }}>
                            <div>
                                <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#111111", display: "flex", alignItems: "center", gap: "6px", margin: "0 0 8px 0" }}>
                                    <Github size={16} /> Repository
                                </h3>
                                {agent.githubUrl ? (
                                    <a href={agent.githubUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.85rem", color: "#165DFC", fontWeight: 600, textDecoration: "none" }}>{agent.githubUrl}</a>
                                ) : (
                                    <span style={{ fontSize: "0.85rem", color: "#9CA3AF" }}>Closed source developer model</span>
                                )}
                            </div>
                            <div>
                                <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#111111", display: "flex", alignItems: "center", gap: "6px", margin: "0 0 8px 0" }}>
                                    <Shield size={16} color="#165DFC" /> Cloud Container
                                </h3>
                                <code style={{ fontSize: "0.8rem", color: "#6B6B6B", background: "#FAFAFA", border: "1px solid #E8E8E8", padding: "2px 6px", borderRadius: "4px" }}>
                                    {agent.dockerImageUrl || "polyhunters/sandbox-runner:latest"}
                                </code>
                            </div>
                        </div>
                    </div>

                    {/* Threaded Comments / Q&A section */}
                    <div style={{ background: "#FFFFFF", border: "1px solid #E8E8E8", borderRadius: "16px", padding: "32px" }}>
                        
                        {/* Tab Switcher */}
                        <div style={{ display: "flex", gap: "16px", borderBottom: "1px solid #E8E8E8", marginBottom: "24px" }}>
                            <button 
                                onClick={() => setCommentType("discussion")}
                                style={{
                                    padding: "10px 16px", background: "none", border: "none",
                                    borderBottom: commentType === "discussion" ? "3px solid #165DFC" : "none",
                                    color: commentType === "discussion" ? "#165DFC" : "#6B6B6B",
                                    fontWeight: 700, fontSize: "0.95rem", cursor: "pointer"
                                }}
                            >
                                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <MessageSquare size={16} /> Discussion ({comments.filter(c => !c.isQA).length})
                                </span>
                            </button>
                            <button 
                                onClick={() => setCommentType("qa")}
                                style={{
                                    padding: "10px 16px", background: "none", border: "none",
                                    borderBottom: commentType === "qa" ? "3px solid #165DFC" : "none",
                                    color: commentType === "qa" ? "#165DFC" : "#6B6B6B",
                                    fontWeight: 700, fontSize: "0.95rem", cursor: "pointer"
                                }}
                            >
                                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <HelpCircle size={16} /> Q&A Thread ({comments.filter(c => c.isQA).length})
                                </span>
                            </button>
                        </div>

                        {/* Submit Comment Form */}
                        {isConnected ? (
                            <form onSubmit={handleCommentSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
                                <textarea 
                                    value={commentText}
                                    onChange={e => setCommentText(e.target.value)}
                                    placeholder={commentType === "qa" ? "Ask a question about the risk metrics or execution..." : "Add your comment on this model's performance..."}
                                    required rows={3}
                                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #E8E8E8", outline: "none", fontSize: "0.95rem", resize: "none", fontFamily: "inherit" }}
                                />
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <button type="submit" style={{ background: "#165DFC", color: "#FFFFFF", border: "none", padding: "8px 20px", borderRadius: "6px", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer" }}>
                                        Post {commentType === "qa" ? "Question" : "Comment"}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div style={{ border: "1px dashed #E8E8E8", padding: "16px", borderRadius: "8px", textAlign: "center", marginBottom: "28px", color: "#6B6B6B", fontSize: "0.9rem" }}>
                                Please connect your wallet to post a question or join the discussion.
                            </div>
                        )}

                        {/* Comments List */}
                        {loadingComments ? (
                            <div style={{ textAlign: "center", padding: "20px", color: "#9CA3AF" }}>Loading comments...</div>
                        ) : filteredComments.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "40px", color: "#9CA3AF", fontSize: "0.95rem" }}>
                                No {commentType === "qa" ? "questions" : "comments"} yet. Be the first to start the thread!
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                                {filteredComments.map(comment => (
                                    <div key={comment.id} style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
                                        {/* Main comment card */}
                                        <div style={{ display: "flex", gap: "12px", alignItems: "start" }}>
                                            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #165DFC 0%, #0047ca 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontWeight: 700, fontSize: "0.85rem" }}>
                                                {comment.username ? comment.username.charAt(0).toUpperCase() : "H"}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                                                    <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{comment.username || "Anonymous Hunter"}</span>
                                                    <span style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>{new Date(comment.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <p style={{ margin: 0, fontSize: "0.95rem", color: "#111111", lineHeight: 1.5 }}>{comment.content}</p>
                                                
                                                {/* Reply trigger button */}
                                                {isConnected && replyingToId !== comment.id && (
                                                    <button onClick={() => setReplyingToId(comment.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#165DFC", fontSize: "0.8rem", fontWeight: 700, padding: "4px 0", marginTop: "6px" }}>
                                                        Reply
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Inline Reply input */}
                                        {replyingToId === comment.id && (
                                            <div style={{ marginLeft: "48px", display: "flex", flexDirection: "column", gap: "8px" }}>
                                                <textarea 
                                                    value={replyText}
                                                    onChange={e => setReplyText(e.target.value)}
                                                    placeholder="Type your reply..."
                                                    required rows={2}
                                                    style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #E8E8E8", outline: "none", fontSize: "0.9rem", resize: "none", fontFamily: "inherit" }}
                                                />
                                                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                                                    <button onClick={() => setReplyingToId(null)} style={{ background: "#FAFAFA", border: "1px solid #E8E8E8", color: "#6B6B6B", padding: "6px 12px", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                                                    <button onClick={() => handleReplySubmit(comment.id)} style={{ background: "#165DFC", color: "#FFFFFF", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>Post Reply</button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Threaded replies */}
                                        {comment.replies && comment.replies.map(reply => (
                                            <div key={reply.id} style={{ marginLeft: "48px", display: "flex", gap: "10px", alignItems: "start", borderLeft: "2px solid #E8E8E8", paddingLeft: "12px" }}>
                                                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#FAFAFA", border: "1px solid #E8E8E8", display: "flex", alignItems: "center", justifyContent: "center", color: "#165DFC", fontWeight: 700, fontSize: "0.75rem" }}>
                                                    {reply.username ? reply.username.charAt(0).toUpperCase() : "H"}
                                                </div>
                                                <div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                                                        <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>{reply.username || "Anonymous Hunter"}</span>
                                                        <span style={{ fontSize: "0.7rem", color: "#9CA3AF" }}>{new Date(reply.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <p style={{ margin: 0, fontSize: "0.9rem", color: "#111111", lineHeight: 1.5 }}>{reply.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Checkout & Payout stats */}
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    
                    {/* Checkout Box */}
                    <div style={{ background: "#FFFFFF", border: "1px solid #E8E8E8", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ color: "#6B6B6B", fontSize: "0.9rem", fontWeight: 500 }}>Daily Rental</span>
                            <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "#165DFC" }}>{agent.pricePerDay} USDC</span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #E8E8E8", paddingTop: "16px" }}>
                            <span style={{ color: "#6B6B6B", fontSize: "0.9rem" }}>Total ROI</span>
                            <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0A7C4E" }}>+{agent.roi}% ROI</span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ color: "#6B6B6B", fontSize: "0.9rem" }}>Rank / Popularity</span>
                            <span style={{ fontSize: "0.9rem", fontWeight: 700 }}>{agent.totalRentals} installations</span>
                        </div>

                        {/* Install and Upvote Action triggers */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
                            <button
                                onClick={() => setShowRentModal(true)}
                                style={{
                                    width: "100%", background: "#CCFF00", color: "#000000", border: "none", borderRadius: "8px",
                                    padding: "14px", fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center",
                                    justifyContent: "center", gap: "8px", cursor: "pointer", transition: "all 0.15s",
                                    boxShadow: "0 2px 8px rgba(204,255,0,0.15)"
                                }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#bfe600"}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#CCFF00"}
                            >
                                <Play size={16} fill="currentColor" /> Install & Run Model
                            </button>

                            <button
                                onClick={handleUpvote}
                                style={{
                                    width: "100%", background: hasUpvoted ? "rgba(22,93,252,0.05)" : "#FFFFFF",
                                    border: `1px solid ${hasUpvoted ? "#165DFC" : "#E8E8E8"}`, borderRadius: "8px",
                                    padding: "12px", fontSize: "0.95rem", fontWeight: 700, display: "flex", alignItems: "center",
                                    justifyContent: "center", gap: "8px", cursor: "pointer", color: hasUpvoted ? "#165DFC" : "#111111"
                                }}
                            >
                                <ArrowUp size={16} strokeWidth={hasUpvoted ? 3 : 2} /> Upvote Model ({upvotesCount})
                            </button>
                        </div>
                    </div>

                    {/* Embed featured badge widget */}
                    <div style={{ background: "#FFFFFF", border: "1px solid #E8E8E8", borderRadius: "16px", padding: "24px" }}>
                        <h4 style={{ margin: "0 0 10px 0", fontSize: "0.9rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "6px" }}>
                            <Code size={16} color="#165DFC" /> README Embed Badge
                        </h4>
                        <p style={{ margin: "0 0 14px 0", fontSize: "0.8rem", color: "#6B6B6B", lineHeight: 1.4 }}>
                            Display this agent featured badge in your project repository or personal portfolio:
                        </p>
                        
                        {/* Live badge preview */}
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px", border: "1px solid #E8E8E8", borderRadius: "8px", padding: "10px", background: "#FAFAFA" }}>
                            <img src={`/api/agents/${id}/badge`} alt="Featured on PolyHunt Badge" style={{ maxWidth: "100%", height: "auto" }} />
                        </div>

                        <button
                            onClick={copyBadgeMarkdown}
                            style={{
                                width: "100%", background: "#FFFFFF", border: "1px solid #E8E8E8", borderRadius: "6px",
                                padding: "8px", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", display: "flex",
                                alignItems: "center", justifyContent: "center", gap: "6px"
                            }}
                        >
                            {badgeCopied ? (
                                <><Check size={14} color="#0A7C4E" /> Copied Markdown!</>
                            ) : (
                                <><Copy size={14} color="#6B6B6B" /> Copy Markdown Snippet</>
                            )}
                        </button>
                    </div>

                </div>

            </div>

            {/* Smart Recommendations Rails section */}
            <div style={{ maxWidth: "1100px", margin: "48px auto 0 auto", padding: "0 24px" }}>
                <RecommendationRails wallet={address} similarTo={id} market={agent.marketSourceIds[0] || "polymarket"} />
            </div>

            {showRentModal && <RentModal agent={agent} onClose={() => setShowRentModal(false)} />}
        </div>
    );
}
