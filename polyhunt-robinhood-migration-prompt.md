# Технічне завдання: міграція PolyHunt на Robinhood Chain

Промпт для AI-агента (Claude Code / інший coding-агент), що працює з репозиторієм
`https://github.com/ttteeesssttt1/polyhunt` (Next.js 16 / React 19 / TypeScript, Prisma + Supabase,
зараз побудований на Solana). Скопіюй усе нижче і віддай агенту як один запит.

---

## 0. Контекст поточного репозиторію (для орієнтації агента)

Проєкт — маркетплейс агентів (торгових ботів) для прогнозних ринків:

- `src/app/page.tsx` — лендинг
- `src/app/marketplace/page.tsx` — каталог агентів
- `src/app/submit/page.tsx` — форма додавання агента
- `src/app/leaderboard/page.tsx`, `dashboard/page.tsx`, `profile/[wallet]/page.tsx`, `settings/page.tsx`
- `src/app/api/rentals/*`, `src/app/api/user/[wallet]/*`, `src/app/api/upload/*`
- `src/lib/solana.ts` — гаманець/USDC-ескроу на Solana (SPL Token, `@solana/web3.js`)
- `src/lib/agents.ts` — модель `Agent` (моки), заточена під Polymarket
- `src/lib/supabase.ts`, `src/lib/db.ts`, `prisma/schema.prisma` — моделі `User`, `Agent`, `Rental` (поле `wallet` — Solana pubkey)
- `src/components/*` — `Navbar`, `Sidebar`, `AgentCard`, `RentModal`, `TerminalView`, `Providers` (обгортає `@solana/wallet-adapter-react`)
- Кольори зараз: фон `#FAFAFA`/білий, текст `#1A1A1A`, акцент `#3358FF` (не офіційний Polymarket-блакитний)
- `README.md` позиціонує продукт як "The Decentralized Agentic Marketplace for Polymarket" на Solana

Ідея продукту НЕ змінюється: маркетплейс, де білдери публікують торгових агентів для прогнозних
ринків, а користувачі орендують їх за USDC. Змінюється лише блокчейн (Solana → Robinhood Chain)
і те, що ринок більше не прив'язаний виключно до Polymarket.

---

## 1. Головна ціль

1. Перенести весь Web3-шар з Solana на **Robinhood Chain** (EVM-сумісний L2 на базі Arbitrum Orbit).
2. Зробити реєстр прогнозних ринків (prediction markets) розширюваним: будь-хто повинен мати змогу
   додати новий джерело/ринок (Polymarket і надалі, але не лише він) через єдиний плагінний інтерфейс,
   а не через хардкод.
3. Привести інтеграцію з Polymarket у відповідність до їхньої актуальної Builder-документації.
4. Оновити візуальний стиль: білий фон, чорний текст, брендовий синій Polymarket + Robin Neon Robinhood.
5. Переписати `README.md` під нове позиціонування.

---

## 2. Технічна міграція: Solana → Robinhood Chain

**Важливий факт, який агент має врахувати (щоб не вигадувати неіснуючий API):** Robinhood не надає
публічного CLOB/order-routing API для прогнозних ринків (їхні прогнозні ринки в застосунку Robinhood
зроблені у партнерстві з Kalshi і закриті для зовнішніх білдерів). Те, що публічно доступне і
документоване — це **Robinhood Chain**: permissionless, повністю EVM-сумісний L2 (Arbitrum Orbit),
mainnet chainId `4663`, testnet chainId `46630`, газ у ETH, підтримка ERC-4337 account abstraction,
стандартний тулінг (Hardhat/Foundry/ethers.js/viem/Wagmi), документація на
`https://docs.robinhood.com/chain/` (дублюється на `docs.chain.robinhood.com`), testnet-faucet на
`faucet.testnet.chain.robinhood.com`. Тому "продукт на Robinhood" технічно означає: **інфраструктура,
гаманці, ескроу-контракти та розрахунки в USDC на Robinhood Chain**, а логіка прогнозних ринків
(Polymarket CLOB тощо) лишається окремим джерелом даних/виконання ордерів, до якого застосунок
підключається через API, як і раніше — просто оплата/ескроу вже не на Solana, а на Robinhood Chain.
Якщо на момент виконання завдання агент знайде в `https://docs.robinhood.com/chain/` щось нове —
орієнтуватись на актуальну версію документації, а не на це резюме.

Що зробити:

- Видалити Solana-стек: `@solana/web3.js`, `@solana/spl-token`, `@solana-mobile/wallet-adapter-mobile`,
  `@solana/wallet-adapter-*`, `tweetnacl`, `bs58`.
- Додати EVM-стек: `viem` + `wagmi` (+ `@wagmi/connectors` або RainbowKit/ConnectKit за смаком) для
  підключення гаманця; налаштувати chain-конфіг Robinhood Chain (chainId, RPC, block explorer, native
  currency ETH) як кастомний `wagmi`/`viem` chain-об'єкт.
- Переписати `src/lib/solana.ts` → `src/lib/robinhoodChain.ts`: клієнт `viem` (public + wallet client),
  адреса контракту ескроу/USDC на Robinhood Chain (винести в `.env`, окремо mainnet/testnet), функції
  переказу USDC (ERC-20 `transfer`/`transferFrom`) замість SPL Token інструкцій.
- `src/components/Providers.tsx`: замінити `ConnectionProvider`/`WalletProvider` з
  `@solana/wallet-adapter-react` на `WagmiProvider` (+ query client), підключити Robinhood Chain як
  дефолтний ланцюг.
- `prisma/schema.prisma`: поле `User.wallet` і `Agent.ownerWallet` — залишити `String`, але коментар
  змінити з "Solana public key" на "EVM address (Robinhood Chain)"; додати валідацію формату `0x...`
  на рівні API-роутів замість base58.
- `src/app/api/rentals/*`, `src/app/api/user/[wallet]/*`: прибрати base58-перевірки гаманця, додати
  EVM-checksum-валідацію (`viem`'s `isAddress`/`getAddress`).
- Env-змінні: замінити `SOLANA_NETWORK`, `SOLANA_RPC_URL`, `POLYHUNT_MASTER_PRIVATE_KEY` на
  `ROBINHOOD_CHAIN_NETWORK` (`mainnet`/`testnet`), `ROBINHOOD_CHAIN_RPC_URL`, `ESCROW_PRIVATE_KEY`,
  `USDC_CONTRACT_ADDRESS`. Оновити `.env.example`.
- Капасітор (Android-обгортка) лишається — просто гаманець-конектор всередині WebView має підтримувати
  EVM (WalletConnect / injected EVM provider).

---

## 3. Реєстр прогнозних ринків: зробити pluggable, а не тільки Polymarket

Зараз `src/lib/agents.ts` — статичний масив моків, жорстко орієнтований на Polymarket ("political
prediction markets" тощо). Потрібно:

1. Ввести інтерфейс джерела ринку, наприклад:

```ts
// src/lib/markets/types.ts
export interface PredictionMarketSource {
  id: string;                // напр. "polymarket"
  name: string;               // напр. "Polymarket"
  logoUrl: string;
  fetchMarkets(): Promise<PredictionMarket[]>;
  getMarket(marketId: string): Promise<PredictionMarket | null>;
}

export interface PredictionMarket {
  id: string;
  sourceId: string;
  question: string;
  outcomes: { name: string; price: number }[];
  volume: number;
  liquidity: number;
  endDate: string;
  url: string;
}
```

2. `src/lib/markets/registry.ts` — реєстр джерел (`Map<string, PredictionMarketSource>`), з функцією
   `registerMarketSource()`, щоб нові ринки (Kalshi, Manifold, майбутні onchain-ринки на Robinhood
   Chain тощо) підключались без зміни core-коду — по аналогії з тим, як агенти/білдери зараз додають
   ботів через `submit`.
3. `src/lib/markets/polymarket.ts` — реалізація `PredictionMarketSource` для Polymarket, побудована на
   актуальному Builder Program:
   - Реєстрація білдера й отримання `builderCode` через `polymarket.com/settings?tab=builder`.
   - Прикріплення `builderCode` до кожного ордера (order attribution) — див.
     `https://docs.polymarket.com/builders/api-keys` та `.../trading/orders/attribution`.
   - Використання офіційного CLOB Client (TS) для розміщення ордерів і Relayer Client для
     gasless-транзакцій (деплой depisit wallet, апрували, CTF-операції) — не писати власний підпис
     ордерів вручну, а йти по SDK з `https://docs.polymarket.com/dev-tooling`.
   - Дані про ринки — через Gamma API / Market Data (`https://docs.polymarket.com/market-data/overview`).
   - Бренд-колір Polymarket офіційний: `#165DFC`.
4. `Agent` (модель і Prisma-схема) отримує поле `marketSourceIds: string[]` — на яких ринках агент
   торгує, замість жорсткого припущення "лише Polymarket".
5. Сторінка `submit`: додати селектор джерела ринку (мультивибір), а не лишати текст "Polymarket" як
   даність.
6. `src/app/docs/page.tsx`: секцію для білдерів доповнити інструкцією "як додати новий
   PredictionMarketSource" (короткий приклад коду), плюс лінки на офіційну документацію Polymarket і
   Robinhood Chain.

---

## 4. Дизайн / брендинг

Основна палітра сайту:

| Роль | Колір | HEX |
|---|---|---|
| Фон (основний) | білий | `#FFFFFF` |
| Текст (основний) | чорний | `#000000` (або `#111111` для кращої читабельності, за потреби) |
| Акцент 1 — Polymarket Blue (офіційний) | синій | `#165DFC` |
| Акцент 2 — Robin Neon (Robinhood) | неоново-салатовий | `#CCFF00` (RGB 204/255/0, CMYK 25/0/100/0) |

Правила застосування:

- Білий фон і чорний текст — базові для всього застосунку (зараз використовується `#FAFAFA`/`#1A1A1A` —
  замінити на чисті `#FFFFFF`/чорний, зберігши легкі бордери `#E8E8E8` для розділювачів, якщо потрібен
  контраст без сірого фону).
- `#165DFC` (Polymarket Blue) — для елементів, пов'язаних із самими прогнозними ринками/даними (бейджі
  ринків, посилання на джерела, графіки цін), а також як основний CTA-колір там, де доречно.
  Замінити поточний неофіційний `#3358FF` на `#165DFC` всюди в коді.
- `#CCFF00` (Robin Neon) — акцент для всього, що стосується блокчейн-шару/гаманця/транзакцій на
  Robinhood Chain: кнопка "Connect Wallet", бейдж мережі "Robinhood Chain", індикатори статусу
  транзакцій, hover-стани на ключових CTA. Використовувати як яскраву пляму, не як фон великих
  секцій (текст на `#CCFF00` — чорний, для контрасту й читабельності).
- Оновити: `tailwind.config.ts` (додати кольори як CSS-змінні/токени `--color-poly-blue`,
  `--color-robin-neon`), `src/app/globals.css`, `logo.png`/фавікон за потреби, усі inline-стилі в
  `page.tsx`, `Navbar.tsx`, `AgentCard.tsx`, `RentModal.tsx`, `Sidebar.tsx`, `TerminalView.tsx`.
- Прибрати/замінити крабо-тематичні сторінки (`crabster`, `langostino_hero.png`, `crabster_hero.png`,
  `crabster_logo.png`), якщо вони не стосуються нового позиціонування — або явно запитати користувача,
  чи лишати цей розділ.

---

## 5. README.md — переписати

Нова структура README має відображати:

- Назву продукту (лишити PolyHunt або запропонувати новий бренд — уточнити в PR/описі, не вирішувати
  мовчки за користувача, якщо перейменування не було прямо попрошене).
- Опис: маркетплейс торгових агентів для прогнозних ринків, побудований на **Robinhood Chain**
  (EVM L2), із розширюваним реєстром джерел прогнозних ринків (Polymarket — перша інтеграція).
  Прибрати формулювання "for Polymarket" як єдиного протоколу.
- Бейджі: замінити Solana-бейдж на Robinhood Chain (з посиланням на `https://docs.robinhood.com/chain/`),
  залишити/оновити Polymarket-бейдж з офіційним кольором `#165DFC`.
- Розділ "Core Architecture" — оновити під EVM/ескроу-контракт на Robinhood Chain та pluggable market
  registry.
- Розділ "Builder Resources" — додати посилання на:
  - `https://docs.polymarket.com/builders/overview`
  - `https://docs.robinhood.com/chain/` (Robinhood Chain developer docs)
  - `https://docs.robinhood.com/crypto/trading/` (Robinhood Crypto Trading API, якщо застосунок також
    даватиме змогу управляти споте-крипто-балансами користувача поза ескроу — лише якщо це реально
    використовується в коді, не додавати посилання "про людське око").
- Quickstart: оновити env-змінні (`ROBINHOOD_CHAIN_RPC_URL` замість `SOLANA_RPC_URL` тощо), приклад
  підключення гаманця через EVM.
- Не вигадувати неіснуючі партнерства чи функції "офіційної інтеграції з Robinhood" — чітко
  формулювати, що продукт побудований поверх Robinhood Chain як інфраструктури, а не афілійований з
  Robinhood Markets Inc.

---

## 6. Технічна документація — джерела правди

Перед реалізацією агент має звірятися саме з цими сторінками (а не з пам'яттю моделі), бо API/адреси
контрактів можуть змінюватись:

- Robinhood Chain (мережа, chainId, RPC, faucet, тулінг): `https://docs.robinhood.com/chain/`
- Robinhood Crypto Trading API (якщо потрібен спот-крипто функціонал поза ескроу): `https://docs.robinhood.com/crypto/trading/`
- Polymarket Builder Program (builderCode, атрибуція ордерів): `https://docs.polymarket.com/builders/overview`
- Polymarket CLOB / Relayer Client, SDK: `https://docs.polymarket.com/dev-tooling`
- Polymarket Market Data / Gamma API: `https://docs.polymarket.com/market-data/overview`

---

## 7. Критерії приймання

- [ ] У коді й `package.json` немає жодної Solana-залежності; збірка (`npm run build`) проходить.
- [ ] Підключення гаманця, ескроу-перекази і всі on-chain операції йдуть через Robinhood Chain
      (mainnet chainId `4663` / testnet `46630`, конфігуровано через env).
- [ ] Додавання нового джерела прогнозних ринків не вимагає правок у `marketplace`/`submit` UI —
      лише реєстрація нового `PredictionMarketSource`.
- [ ] Інтеграція з Polymarket використовує офіційний builderCode-флоу та актуальний SDK, а не
      саморобний підпис ордерів.
- [ ] Основна палітра: білий фон, чорний текст, `#165DFC` і `#CCFF00` як єдині акцентні кольори —
      застосована послідовно на всіх сторінках (`page.tsx`, `marketplace`, `dashboard`, `leaderboard`,
      `submit`, `docs`, `profile/[wallet]`, `settings`, легальні сторінки).
- [ ] `README.md` переписано за структурою з розділу 5, без вигаданих фактів про Robinhood.
