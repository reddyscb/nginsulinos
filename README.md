# InsulinNG — Nigeria Insulin Manufacturing Network (Ops Platform POC)

A proof-of-concept operations platform for a 4-plant local insulin
manufacturing network in Nigeria — Lagos (Lekki FTZ), Kano (Bompai
Industrial), Port Harcourt (Trans-Amadi), and Abuja (FCT Idu Industrial).

Nigeria currently imports 100% of its insulin. This platform models what it
would take to run a private, distributed fill-finish manufacturing network
that competes on price and supply reliability — covering everything from
shift-level production targets to P&L, cold-chain logistics, and NAFDAC
compliance.

**Live demo:** `https://reddyscb.github.io/nginsulinos/`

## What's inside

| Section | What it covers |
|---|---|
| **Overview** | Live network map of all 4 plants, national KPIs, per-plant status cards, system alerts feed |
| **Production Control** | Per-plant daily/monthly targets, 3-shift real-time output tracking, equipment health, batch traceability |
| **Financial** | $42.5M CapEx breakdown by plant and category, full P&L (Revenue → COGS → Gross Profit → OpEx → EBIT → Tax → Net Profit), budget-vs-actual expense tracking, Pioneer Status tax tracking |
| **Logistics & Cold Chain** | Delivery orders across van/motorcycle/drone, live 2–8°C cold-chain gauges, hospital network stock status with reorder actions |
| **Analytics & AI** | Weekly production trends, revenue-vs-cost trend, plant-to-plant comparison, AI demand forecasting with confidence band |
| **Compliance & QA** | NAFDAC registration & GMP checklist status, QC pass rates, SOP version control, adverse event tracking |
| **Roadmap** | Recommended next-phase features (HR/shift management, supplier relationship management, energy management, mobile apps, patient impact dashboard, blockchain traceability, predictive maintenance, and more) with priority ratings |

All data in the app is realistic mock data for demonstration — there's no
backend. It's meant to show what the system should do and how it should feel
to use, before investing in a real data layer.

## Tech stack

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Recharts](https://recharts.org/) for charts
- [lucide-react](https://lucide.dev/) for icons
- [Tailwind CSS](https://tailwindcss.com/) (via CDN, no build config needed)

## Run it locally

Requires [Node.js](https://nodejs.org/) 18+.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Deployment

This repo auto-deploys to **GitHub Pages** via the workflow in
`.github/workflows/deploy.yml`. Every push to `main`:

1. Installs dependencies (`npm install`)
2. Builds the app (`npm run build`)
3. Publishes the `dist/` output to GitHub Pages

Check the **Actions** tab to watch a deployment in progress. Pages source is
set to **GitHub Actions** under **Settings → Pages**.

To trigger a manual deploy without a code change, go to **Actions → Deploy to
GitHub Pages → Run workflow**.

## Project structure

```
.
├─ .github/workflows/deploy.yml   # CI: build + deploy to GitHub Pages
├─ index.html                     # HTML entry point, loads Tailwind CDN
├─ src/
│  ├─ main.jsx                    # React root
│  └─ App.jsx                     # The entire dashboard (all 7 tabs)
├─ package.json
└─ vite.config.js                 # base: "./" so it works under /repo-name/
```

## Extending this POC

To turn this into a real system, the main thing to change is `src/App.jsx`:
the constants near the top (`PLANTS`, `ALERTS`, `DELIVERIES`, `HOSPITALS`,
`EXPENSE_CATS`, etc.) currently hold static mock data and are where you'd
wire in real API calls, a database, or an ERP integration instead.

## License

Proof-of-concept / internal planning tool — not for production use as-is.
