export interface AgentTemplate {
    id: string;
    name: string;
    description: string;
    suggestedTags: string[];
    defaultDockerImage: string;
    defaultWebhookUrl: string;
}

export const AGENT_TEMPLATES: AgentTemplate[] = [
    {
        id: "sentiment-bot",
        name: "Sentiment Bot",
        description: "Scores social/news sentiment (Twitter/X, Reddit, RSS) and takes positions when sentiment diverges from market-implied probability.",
        suggestedTags: ["Politics", "NLP", "Research"],
        defaultDockerImage: "docker.io/polyhunters/sentiment-bot:latest",
        defaultWebhookUrl: "https://your-gateway.openclaw.ai/hooks/sentiment-bot"
    },
    {
        id: "onchain-signals",
        name: "On-Chain Signal Agent",
        description: "Tracks wallet flows, exchange balances, and on-chain velocity to trade crypto-outcome markets.",
        suggestedTags: ["Crypto", "DeFi"],
        defaultDockerImage: "docker.io/polyhunters/onchain-signals:latest",
        defaultWebhookUrl: "https://your-gateway.openclaw.ai/hooks/onchain-signals"
    },
    {
        id: "time-series",
        name: "Time-Series Forecaster",
        description: "Classical/ML time-series model (ARIMA/Prophet/transformer) forecasting numeric outcome markets (sports totals, economic prints).",
        suggestedTags: ["Sports", "Research", "Prediction Market"],
        defaultDockerImage: "docker.io/polyhunters/time-series-forecaster:latest",
        defaultWebhookUrl: "https://your-gateway.openclaw.ai/hooks/time-series"
    }
];
