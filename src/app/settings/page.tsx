"use client";

import { useState, useEffect } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { Save, User as UserIcon, Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
    const { address, isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");

    // Load existing profile data
    useEffect(() => {
        if (!isConnected || !address) return;
        fetch(`/api/user/${address}`)
            .then(res => res.json())
            .then(data => {
                if (data.user) {
                    setUsername(data.user.username || "");
                    setBio(data.user.bio || "");
                    setAvatarUrl(data.user.avatarUrl || "");
                }
            })
            .catch(console.error);
    }, [isConnected, address]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isConnected || !address) {
            setStatus("Wallet not connected or does not support signing.");
            return;
        }

        setLoading(true);
        setStatus("Waiting for wallet signature...");

        try {
            // Create a message to sign
            const timestamp = Date.now();
            const message = `Update PolyHunt profile for ${address}. Timestamp: ${timestamp}`;
            
            // Request EVM signature
            const signature = await signMessageAsync({ message });

            // Send to backend (EVM payload uses hex signature string directly)
            const response = await fetch("/api/profile/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    wallet: address,
                    signature,
                    message,
                    username,
                    bio,
                    avatarUrl
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                setStatus("Profile updated successfully!");
            } else {
                setStatus(`Error: ${data.error}`);
            }
        } catch (error: any) {
            console.error(error);
            setStatus(`Signature failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (!isConnected) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center bg-bg-secondary">
                <div className="text-center p-10 bg-bg-secondary rounded-2xl border border-border shadow-sm">
                    <SettingsIcon size={48} className="text-text-muted mb-4 mx-auto" />
                    <h2 className="text-[1.5rem] font-bold text-text-primary mb-2">Wallet Required</h2>
                    <p className="text-text-secondary">Please connect your EVM wallet to edit your profile settings.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-secondary py-10 px-6">
            <div className="max-w-[600px] mx-auto bg-bg-secondary rounded-2xl border border-border overflow-hidden shadow-sm">
                <div className="p-8 border-b border-border bg-bg-primary">
                    <h1 className="text-[1.8rem] font-bold m-0 text-text-primary flex items-center gap-3">
                        <UserIcon size={28} className="text-brand" />
                        Profile Settings
                    </h1>
                    <p className="text-text-secondary m-0 mt-2 text-[0.95rem]">
                        Setup your Polyhunter identity to appear on leaderboards and agent pages.
                    </p>
                </div>

                <form onSubmit={handleSave} className="p-8 flex flex-col gap-6">
                    <div>
                        <label className="block text-[0.9rem] font-bold text-text-secondary mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="e.g. polyhunter99"
                            maxLength={30}
                            className="w-full px-4 py-3 rounded-lg border border-border text-[1rem] outline-none transition-colors duration-200 focus:border-brand"
                        />
                    </div>

                    <div>
                        <label className="block text-[0.9rem] font-bold text-text-secondary mb-2">
                            Avatar URL
                        </label>
                        <input
                            type="url"
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                            placeholder="https://example.com/avatar.png"
                            className="w-full px-4 py-3 rounded-lg border border-border text-[1rem] outline-none transition-colors duration-200 focus:border-brand"
                        />
                        {avatarUrl && (
                            <div className="mt-3 flex items-center gap-3">
                                <img src={avatarUrl} alt="Avatar preview" className="w-12 h-12 rounded-full object-cover border border-border" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                <span className="text-[0.8rem] text-text-muted">Preview</span>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-[0.9rem] font-bold text-text-secondary mb-2">
                            Bio
                        </label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell the community about yourself..."
                            rows={4}
                            maxLength={160}
                            className="w-full px-4 py-3 rounded-lg border border-border text-[1rem] outline-none resize-none font-sans transition-colors duration-200 focus:border-brand"
                        />
                        <div className="text-right text-[0.8rem] text-text-muted mt-1">
                            {bio.length}/160
                        </div>
                    </div>

                    <div className="border-t border-border pt-6 flex items-center justify-between">
                        <span className={`text-[0.9rem] font-medium ${status.toLowerCase().includes("error") || status.toLowerCase().includes("failed") ? "text-error" : "text-success"}`}>
                            {status}
                        </span>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`border-none rounded-lg px-6 py-3 text-[0.95rem] font-bold flex items-center gap-2 transition-colors duration-150 ${
                                loading 
                                    ? "bg-text-muted text-text-primary cursor-not-allowed" 
                                    : "bg-brand-lime text-text-primary cursor-pointer hover:bg-[#bfe600]"
                            }`}
                        >
                            <Save size={18} />
                            {loading ? "Saving..." : "Save Profile"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
