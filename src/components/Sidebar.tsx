"use client";

export function Sidebar() {
    return (
        <div className="p-6 bg-bg-primary rounded-xl border border-border">
            <h3 className="text-[0.9rem] font-bold mb-4 text-text-secondary uppercase tracking-wider">
                Platform Stats
            </h3>

            <div className="flex flex-col gap-4">
                <div>
                    <div className="text-[0.85rem] text-text-secondary mb-1">Total Volume Secured</div>
                    <div className="text-[1.4rem] font-bold text-text-primary">$42.8M</div>
                </div>

                <hr className="divider" />

                <div>
                    <div className="text-[0.85rem] text-text-secondary mb-1">Active OpenClaw Nodes</div>
                    <div className="text-[1.4rem] font-bold text-text-primary">1,248</div>
                </div>

                <hr className="divider" />

                <div>
                    <div className="text-[0.85rem] text-text-secondary mb-1">Avg. Daily ROI</div>
                    <div className="text-[1.4rem] font-bold text-success">+1.4%</div>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-[0.9rem] font-bold mb-4 text-text-secondary uppercase tracking-wider">
                    Trending Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                    {["Politics", "Sports", "Crypto", "Macro", "Arbitrage", "NLP", "Low-Liquidity"].map((tag) => (
                        <span key={tag} className="tag cursor-pointer transition-colors duration-150 hover:bg-border bg-bg-primary">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
