import React, { useState, useMemo } from "react";
import {
  LayoutDashboard, Factory, Wallet, Truck, LineChart as LineChartIcon,
  ShieldCheck, Rocket, AlertTriangle, AlertCircle, Info, ChevronRight,
  Thermometer, Package, Bike, Car, Plane, CheckCircle2, XCircle, Clock,
  Users, Zap, Sun, Fuel, Battery, FileText, FlaskConical, Activity,
  TrendingUp, TrendingDown, Building2, MapPin, ArrowUpRight, ArrowDownRight,
  Target, Gauge, Boxes, Stethoscope, Radio, Lock, Wrench, ClipboardList,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, AreaChart, Area, PieChart, Pie, Cell,
} from "recharts";

/* ---------------------------------- TOKENS ---------------------------------- */
const C = {
  bg: "#F4F7F5",
  surface: "#FFFFFF",
  ink: "#12241E",
  sub: "#5B6B66",
  faint: "#8A9A95",
  border: "#E1E8E3",
  primary: "#0E5C46",
  primaryDeep: "#0A4636",
  primaryLight: "#E4F2ED",
  navy: "#152A3A",
  accent: "#C98A2B",
  accentLight: "#FBF0DD",
  danger: "#B23A2E",
  dangerLight: "#FAE6E3",
  warn: "#C98A2B",
  warnLight: "#FBF0DD",
  ok: "#1E7A54",
  okLight: "#E3F2EA",
  grid: "#EAEFEC",
};
const PLANT_COLORS = ["#0E5C46", "#C98A2B", "#3A6EA5", "#8A4E9E"];
const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
*{box-sizing:border-box;}
.f-display{font-family:'Space Grotesk',Inter,system-ui,sans-serif;}
.f-body{font-family:'Inter',system-ui,sans-serif;}
.f-mono{font-family:'IBM Plex Mono',ui-monospace,monospace;}

.rgrid{display:grid;gap:14px;}
.rgrid-4{grid-template-columns:repeat(auto-fit,minmax(150px,1fr));}
.rgrid-3{grid-template-columns:repeat(auto-fit,minmax(180px,1fr));}
.rgrid-2{grid-template-columns:repeat(auto-fit,minmax(220px,1fr));}
.rgrid-2b{grid-template-columns:repeat(auto-fit,minmax(240px,1fr));}
.rgrid-2wide{grid-template-columns:repeat(auto-fit,minmax(320px,1fr));}

.app-shell{display:flex;min-height:100vh;}
.sidebar{width:232px;flex-shrink:0;display:flex;flex-direction:column;padding:22px 14px;}
.sidebar-nav{display:flex;flex-direction:column;gap:4px;}
.main-col{flex:1;min-width:0;}
.header-bar{display:flex;align-items:center;justify-content:space-between;padding:18px 28px;flex-wrap:wrap;gap:8px;}
.main-content{padding:28px;max-width:1180px;}
.network-strip{display:flex;align-items:center;position:relative;flex-wrap:wrap;gap:20px 8px;}
.network-line{position:absolute;left:6%;right:6%;top:22px;height:1.5px;background:rgba(255,255,255,0.18);}
.network-node{flex:1;min-width:110px;display:flex;flex-direction:column;align-items:center;position:relative;z-index:1;}

@media (max-width: 860px){
  .app-shell{flex-direction:column;}
  .sidebar{width:100%;flex-direction:row;align-items:center;overflow-x:auto;padding:10px 12px;gap:10px;}
  .sidebar-brand{flex-shrink:0;margin-bottom:0 !important;}
  .sidebar-nav{flex-direction:row;flex-shrink:0;}
  .nav-btn{flex-direction:column;gap:2px !important;padding:6px 10px !important;font-size:10.5px !important;}
  .nav-btn .nav-label{white-space:nowrap;}
  .sidebar-footer{display:none;}
  .header-bar{padding:14px 16px;}
  .header-bar h1{font-size:18px !important;}
  .main-content{padding:16px;}
  .network-line{display:none;}
  .network-strip{justify-content:center;}
}
`;

/* ---------------------------------- DATA ---------------------------------- */
const PLANTS = [
  {
    id: "lagos", name: "Lagos — Lekki FTZ", zone: "South-West", short: "LAG",
    status: "Operational", capexM: 14, capacityDay: 12000, outputDay: 10200,
    targetMonth: 300000, mtdVials: 194000, mtdRevenueB: 1.84, employees: 210,
    color: PLANT_COLORS[0], tempC: 4.2, coldStatus: "Normal",
    power: { grid: 55, generator: 25, solar: 20 },
    shifts: [
      { name: "Shift A · 06:00–14:00", output: 3600, target: 4000 },
      { name: "Shift B · 14:00–22:00", output: 3450, target: 4000 },
      { name: "Shift C · 22:00–06:00", output: 3150, target: 4000 },
    ],
    equipment: [
      { name: "Fill-Finish Line 1", type: "Fill-Finish", health: 96, status: "Running" },
      { name: "Fill-Finish Line 2", type: "Fill-Finish", health: 88, status: "Running" },
      { name: "Bioreactor A (2000L)", type: "Upstream", health: 91, status: "Running" },
      { name: "Cold Store 1 (Bulk)", type: "Cold Chain", health: 99, status: "Normal" },
      { name: "Lyophilizer 1", type: "Downstream", health: 74, status: "Maintenance Due" },
    ],
    batches: [
      { id: "LAG-26071-A", stage: "Fill & Finish", qty: 42000, qc: "In Progress", eta: "Jul 29" },
      { id: "LAG-26070-C", stage: "QC Release", qty: 38500, qc: "Pass", eta: "Jul 27" },
      { id: "LAG-26069-B", stage: "Packaging", qty: 40200, qc: "Pass", eta: "Jul 28" },
      { id: "LAG-26068-A", stage: "Dispatched", qty: 41000, qc: "Pass", eta: "Shipped" },
    ],
  },
  {
    id: "kano", name: "Kano — Bompai Industrial", zone: "North-West", short: "KAN",
    status: "Operational", capexM: 10.5, capacityDay: 9000, outputDay: 6750,
    targetMonth: 220000, mtdVials: 128000, mtdRevenueB: 1.22, employees: 165,
    color: PLANT_COLORS[1], tempC: 5.6, coldStatus: "Normal",
    power: { grid: 35, generator: 40, solar: 25 },
    shifts: [
      { name: "Shift A · 06:00–14:00", output: 2400, target: 3000 },
      { name: "Shift B · 14:00–22:00", output: 2250, target: 3000 },
      { name: "Shift C · 22:00–06:00", output: 2100, target: 3000 },
    ],
    equipment: [
      { name: "Fill-Finish Line 1", type: "Fill-Finish", health: 90, status: "Running" },
      { name: "Bioreactor A (1200L)", type: "Upstream", health: 82, status: "Running" },
      { name: "Cold Store 1 (Bulk)", type: "Cold Chain", health: 95, status: "Normal" },
      { name: "Generator Bank", type: "Power", health: 67, status: "Under Load" },
    ],
    batches: [
      { id: "KAN-26071-A", stage: "Upstream Fermentation", qty: 28000, qc: "Pending", eta: "Aug 01" },
      { id: "KAN-26070-B", stage: "QC Release", qty: 22000, qc: "Pass", eta: "Jul 27" },
      { id: "KAN-26069-A", stage: "Dispatched", qty: 24500, qc: "Pass", eta: "Shipped" },
    ],
  },
  {
    id: "ph", name: "Port Harcourt — Trans-Amadi", zone: "South-South", short: "PHC",
    status: "Ramping Up", capexM: 10, capacityDay: 8000, outputDay: 5600,
    targetMonth: 190000, mtdVials: 106000, mtdRevenueB: 1.01, employees: 150,
    color: PLANT_COLORS[2], tempC: 3.8, coldStatus: "Normal",
    power: { grid: 45, generator: 45, solar: 10 },
    shifts: [
      { name: "Shift A · 06:00–14:00", output: 2000, target: 2650 },
      { name: "Shift B · 14:00–22:00", output: 1900, target: 2650 },
      { name: "Shift C · 22:00–06:00", output: 1700, target: 2650 },
    ],
    equipment: [
      { name: "Fill-Finish Line 1", type: "Fill-Finish", health: 93, status: "Running" },
      { name: "Bioreactor A (1200L)", type: "Upstream", health: 79, status: "Running" },
      { name: "Cold Store 1 (Bulk)", type: "Cold Chain", health: 92, status: "Normal" },
      { name: "QC Lab Analyzer", type: "QC", health: 55, status: "Calibration Due" },
    ],
    batches: [
      { id: "PHC-26071-A", stage: "Upstream Fermentation", qty: 20000, qc: "Pending", eta: "Aug 02" },
      { id: "PHC-26070-B", stage: "Fill & Finish", qty: 19500, qc: "In Progress", eta: "Jul 30" },
    ],
  },
  {
    id: "abuja", name: "Abuja — FCT Idu Industrial", zone: "North-Central", short: "ABJ",
    status: "Operational", capexM: 8, capacityDay: 7000, outputDay: 6300,
    targetMonth: 170000, mtdVials: 119700, mtdRevenueB: 1.14, employees: 140,
    color: PLANT_COLORS[3], tempC: 4.5, coldStatus: "Normal",
    power: { grid: 60, generator: 20, solar: 20 },
    shifts: [
      { name: "Shift A · 06:00–14:00", output: 2200, target: 2350 },
      { name: "Shift B · 14:00–22:00", output: 2150, target: 2350 },
      { name: "Shift C · 22:00–06:00", output: 1950, target: 2350 },
    ],
    equipment: [
      { name: "Fill-Finish Line 1", type: "Fill-Finish", health: 97, status: "Running" },
      { name: "Bioreactor A (1000L)", type: "Upstream", health: 94, status: "Running" },
      { name: "Cold Store 1 (Bulk)", type: "Cold Chain", health: 98, status: "Normal" },
    ],
    batches: [
      { id: "ABJ-26071-A", stage: "QC Release", qty: 24000, qc: "Pass", eta: "Jul 27" },
      { id: "ABJ-26070-B", stage: "Packaging", qty: 23500, qc: "Pass", eta: "Jul 28" },
      { id: "ABJ-26069-A", stage: "Dispatched", qty: 24000, qc: "Pass", eta: "Shipped" },
    ],
  },
];

const ALERTS = [
  { level: "critical", text: "Port Harcourt — QC Lab Analyzer calibration overdue by 4 days; batch release at risk.", time: "08:12" },
  { level: "critical", text: "Kano — Generator Bank under sustained load (>85%) for 6+ hours; fuel reserve at 18%.", time: "07:40" },
  { level: "warning", text: "Lagos — Lyophilizer 1 health at 74%; schedule preventive maintenance before next batch.", time: "06:55" },
  { level: "warning", text: "3 hospital accounts (Kano zone) at Critical stock — reorder not yet placed.", time: "06:20" },
  { level: "info", text: "Abuja plant hit 92% of monthly production target with 4 days remaining.", time: "05:00" },
  { level: "info", text: "NAFDAC pre-inspection scheduled for Lagos facility — Aug 14.", time: "Yesterday" },
];

const WEEKLY_PROD = [
  { week: "W1", vials: 165000 }, { week: "W2", vials: 172000 }, { week: "W3", vials: 178500 },
  { week: "W4", vials: 181000 }, { week: "W5", vials: 189000 }, { week: "W6", vials: 194500 },
  { week: "W7", vials: 201000 }, { week: "W8", vials: 208000 },
];

const REV_COST_TREND = [
  { month: "Feb", revenue: 6.9, cost: 4.1 }, { month: "Mar", revenue: 7.2, cost: 4.2 },
  { month: "Apr", revenue: 7.6, cost: 4.3 }, { month: "May", revenue: 7.9, cost: 4.4 },
  { month: "Jun", revenue: 8.1, cost: 4.5 }, { month: "Jul", revenue: 8.4, cost: 4.6 },
];

const DEMAND_FORECAST = [
  { month: "Aug", actual: 880, forecast: null }, { month: "Sep", actual: 905, forecast: null },
  { month: "Oct", actual: null, forecast: 940 }, { month: "Nov", actual: null, forecast: 985 },
  { month: "Dec", actual: null, forecast: 1040 }, { month: "Jan", actual: null, forecast: 1080 },
];

const HOSPITALS = [
  { name: "Lagos University Teaching Hospital", zone: "South-West", stock: "Active", vials: 4200 },
  { name: "National Hospital, Abuja", zone: "North-Central", stock: "Active", vials: 3100 },
  { name: "Univ. of Port Harcourt Teaching Hosp.", zone: "South-South", stock: "Low", vials: 850 },
  { name: "Aminu Kano Teaching Hospital", zone: "North-West", stock: "Critical", vials: 210 },
  { name: "General Hospital, Ikeja", zone: "South-West", stock: "Active", vials: 1900 },
  { name: "Federal Medical Centre, Owerri", zone: "South-East", stock: "Low", vials: 640 },
];

const DELIVERIES = [
  { id: "DEL-4471", hospital: "LUTH, Lagos", origin: "Lagos", mode: "van", qty: 4200, status: "In Transit", eta: "2h 10m" },
  { id: "DEL-4472", hospital: "Aminu Kano TH", origin: "Kano", mode: "motorcycle", qty: 210, status: "Dispatched", eta: "45m" },
  { id: "DEL-4473", hospital: "National Hospital, Abuja", origin: "Abuja", mode: "van", qty: 3100, status: "Delivered", eta: "—" },
  { id: "DEL-4474", hospital: "UPTH, Port Harcourt", origin: "Port Harcourt", mode: "drone", qty: 300, status: "In Transit", eta: "22m" },
  { id: "DEL-4475", hospital: "FMC Owerri", origin: "Port Harcourt", mode: "van", qty: 640, status: "Scheduled", eta: "Tomorrow" },
];

const EXPENSE_CATS = [
  { name: "API / Raw Materials", budget: 2650, actual: 2710 },
  { name: "Salaries & Wages", budget: 980, actual: 965 },
  { name: "Utilities & Power", budget: 410, actual: 468 },
  { name: "Maintenance", budget: 260, actual: 298 },
  { name: "Logistics & Distribution", budget: 340, actual: 355 },
  { name: "Regulatory & Compliance", budget: 130, actual: 122 },
];

const CAPEX_CATS = [
  { name: "Land, Building & Cleanroom", pct: 28 },
  { name: "Fill-Finish & Bioprocess Equip.", pct: 38 },
  { name: "Cold Chain & Warehousing", pct: 10 },
  { name: "Power Infrastructure", pct: 9 },
  { name: "Regulatory & Commissioning", pct: 6 },
  { name: "Working Capital & Contingency", pct: 9 },
];

const ROADMAP = [
  { icon: Users, title: "HR & Shift Management", priority: "HIGH", why: "3-shift operations across 4 plants with 665+ staff need clash-free rostering, overtime control, and skills tracking for GMP-certified roles.", features: ["Shift roster builder", "Certification & training expiry alerts", "Overtime & leave tracking", "Payroll integration"] },
  { icon: Truck, title: "Supplier Relationship Mgmt", priority: "HIGH", why: "Active Pharmaceutical Ingredient sourced from China/India is the single largest cost and risk line — quality, lead time and FX exposure must be tracked per supplier.", features: ["Supplier scorecards (quality, OTIF, price)", "Purchase order & contract tracking", "Dual-sourcing risk flags", "Landed-cost & FX exposure view"] },
  { icon: Zap, title: "Energy Management", priority: "MEDIUM", why: "Grid instability is a direct threat to cold-chain integrity and bioreactor uptime — fuel and solar mix must be actively managed, not just monitored.", features: ["Generator fuel level & consumption", "Grid vs generator vs solar mix", "Downtime-risk alerts", "Cost-per-kWh by source"] },
  { icon: Radio, title: "Mobile Apps (Field & Plant)", priority: "HIGH", why: "Plant managers need floor access without a laptop; delivery riders need routing and proof-of-delivery in low-connectivity areas.", features: ["Plant manager app (targets, alerts, batch sign-off)", "Driver/rider app (routes, POD, offline mode)", "Push notifications for critical alerts"] },
  { icon: Stethoscope, title: "Patient Impact Dashboard", priority: "MEDIUM", why: "Investors, government partners and Pioneer Status renewal all respond to CSR proof — lives reached and affordability gains, not just revenue.", features: ["Patients reached / vials dispensed", "Price-vs-import savings tracker", "Zone-level access-gap heatmap", "Auto-generated CSR/ESG reports"] },
  { icon: Lock, title: "Blockchain Traceability", priority: "FUTURE", why: "Counterfeit insulin is a real safety risk in Nigeria's supply chain; a tamper-evident batch ledger builds regulatory and hospital trust.", features: ["Batch-to-vial serial ledger", "Hospital-side QR verification", "Chain-of-custody audit trail"] },
  { icon: Wrench, title: "Predictive Maintenance AI", priority: "MEDIUM", why: "Bioreactors and fill-lines are the scarcest capital asset — unplanned downtime directly caps output; sensor-driven prediction beats fixed schedules.", features: ["Equipment health trend modeling", "Failure-risk scoring per asset", "Auto-generated maintenance work orders"] },
  { icon: ClipboardList, title: "Regulatory Intelligence Tracker", priority: "MEDIUM", why: "Pioneer Status, NAFDAC policy, and import-duty rules shift often — missing a renewal window is a tax or licensing risk.", features: ["Filing deadline calendar", "Policy-change news feed", "Multi-agency (NAFDAC, NIPC, FIRS) status board"] },
  { icon: Lock, title: "Cybersecurity & Data Governance", priority: "HIGH", why: "The platform holds financial, patient-adjacent, and GMP records across 4 sites — a breach or data-integrity failure is both a business and regulatory risk.", features: ["Role-based access control", "Audit-logged data changes (21 CFR Part 11-style)", "Encrypted backups & DR plan"] },
];

const fmtN = (n) => "₦" + n.toLocaleString("en-NG", { maximumFractionDigits: 0 });
const fmtNB = (n) => "₦" + n.toFixed(2) + "B";
const fmtUSD = (nairaB) => "$" + (nairaB * 1000 / 1400).toFixed(2) + "M";
const pct = (a, b) => Math.round((a / b) * 100);

/* ---------------------------------- UI PRIMITIVES ---------------------------------- */
function Badge({ children, tone = "primary" }) {
  const map = {
    primary: { bg: C.primaryLight, fg: C.primaryDeep },
    ok: { bg: C.okLight, fg: C.ok },
    warn: { bg: C.warnLight, fg: C.warn },
    danger: { bg: C.dangerLight, fg: C.danger },
    neutral: { bg: C.grid, fg: C.sub },
  };
  const t = map[tone];
  return (
    <span className="f-mono" style={{ background: t.bg, color: t.fg, fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, letterSpacing: 0.3, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

function Bar({ value, max, color = C.primary, height = 8 }) {
  const w = Math.min(100, Math.round((value / max) * 100));
  return (
    <div style={{ background: C.grid, borderRadius: 99, height, width: "100%", overflow: "hidden" }}>
      <div style={{ width: `${w}%`, height: "100%", background: color, borderRadius: 99, transition: "width .4s" }} />
    </div>
  );
}

function Card({ children, style, className = "" }) {
  return (
    <div className={className} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18, ...style }}>
      {children}
    </div>
  );
}

function SectionTitle({ eyebrow, title, right }) {
  return (
    <div className="flex items-end justify-between mb-4 flex-wrap gap-2">
      <div>
        {eyebrow && <div className="f-mono" style={{ fontSize: 11, color: C.faint, letterSpacing: 1, fontWeight: 600, marginBottom: 2 }}>{eyebrow.toUpperCase()}</div>}
        <h2 className="f-display" style={{ fontSize: 20, fontWeight: 600, color: C.ink, margin: 0 }}>{title}</h2>
      </div>
      {right}
    </div>
  );
}

function StatTile({ label, value, sub, trend, icon: Icon }) {
  return (
    <Card style={{ padding: 16 }}>
      <div className="flex items-center justify-between mb-2">
        <span className="f-mono" style={{ fontSize: 11, color: C.sub, letterSpacing: 0.4, fontWeight: 600 }}>{label.toUpperCase()}</span>
        {Icon && <Icon size={15} color={C.faint} />}
      </div>
      <div className="f-display" style={{ fontSize: 26, fontWeight: 700, color: C.ink, lineHeight: 1.1 }}>{value}</div>
      {sub && (
        <div className="flex items-center gap-1 mt-1">
          {trend === "up" && <ArrowUpRight size={13} color={C.ok} />}
          {trend === "down" && <ArrowDownRight size={13} color={C.danger} />}
          <span style={{ fontSize: 12.5, color: trend === "up" ? C.ok : trend === "down" ? C.danger : C.sub }}>{sub}</span>
        </div>
      )}
    </Card>
  );
}

const NAV = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "production", label: "Production Control", icon: Factory },
  { id: "financial", label: "Financial", icon: Wallet },
  { id: "logistics", label: "Logistics & Cold Chain", icon: Truck },
  { id: "analytics", label: "Analytics & AI", icon: LineChartIcon },
  { id: "compliance", label: "Compliance & QA", icon: ShieldCheck },
  { id: "roadmap", label: "Roadmap", icon: Rocket },
];

/* ---------------------------------- TABS ---------------------------------- */
function OverviewTab() {
  const totalOutput = PLANTS.reduce((s, p) => s + p.outputDay, 0);
  const totalCapacity = PLANTS.reduce((s, p) => s + p.capacityDay, 0);
  const totalTarget = PLANTS.reduce((s, p) => s + p.targetMonth, 0);
  const totalMtd = PLANTS.reduce((s, p) => s + p.mtdVials, 0);
  const totalMtdRev = PLANTS.reduce((s, p) => s + p.mtdRevenueB, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Signature network strip */}
      <Card style={{ padding: 22, background: C.navy, border: "none" }}>
        <div className="f-mono" style={{ fontSize: 11, color: "#9FB3C8", letterSpacing: 1, fontWeight: 600, marginBottom: 14 }}>
          NATIONAL PRODUCTION NETWORK · LIVE
        </div>
        <div className="network-strip">
          <div className="network-line" />
          {PLANTS.map((p) => (
            <div key={p.id} className="network-node">
              <div style={{ width: 44, height: 44, borderRadius: 99, background: p.color, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 5px rgba(255,255,255,0.08)` }}>
                <span className="f-mono" style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{p.short}</span>
              </div>
              <div className="f-body" style={{ color: "#fff", fontSize: 13, fontWeight: 600, marginTop: 10, textAlign: "center" }}>{p.name.split("—")[0].trim()}</div>
              <div style={{ color: "#9FB3C8", fontSize: 11.5, marginTop: 2 }}>{p.zone}</div>
              <div className="f-mono" style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginTop: 8 }}>{p.outputDay.toLocaleString()}</div>
              <div style={{ color: "#9FB3C8", fontSize: 10.5, textAlign: "center" }}>vials / day · {pct(p.outputDay, p.capacityDay)}% cap.</div>
            </div>
          ))}
        </div>
      </Card>

      <div className="rgrid rgrid-4">
        <StatTile label="Daily Output (all plants)" value={totalOutput.toLocaleString()} sub={`${pct(totalOutput, totalCapacity)}% of installed capacity`} trend="up" icon={Boxes} />
        <StatTile label="MTD Revenue" value={fmtNB(totalMtdRev)} sub={fmtUSD(totalMtdRev) + " USD equiv."} trend="up" icon={Wallet} />
        <StatTile label="Monthly Target Progress" value={`${pct(totalMtd, totalTarget)}%`} sub={`${totalMtd.toLocaleString()} / ${totalTarget.toLocaleString()} vials`} icon={Target} />
        <StatTile label="Cold Chain Status" value="4 / 4 Normal" sub="All plants within 2–8°C" trend="up" icon={Thermometer} />
      </div>

      <SectionTitle eyebrow="By Facility" title="Plant Status" />
      <div className="rgrid rgrid-2">
        {PLANTS.map((p) => (
          <Card key={p.id}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <div style={{ width: 9, height: 9, borderRadius: 99, background: p.color }} />
                  <span className="f-display" style={{ fontWeight: 600, fontSize: 15.5, color: C.ink }}>{p.name}</span>
                </div>
                <div style={{ fontSize: 12.5, color: C.sub, marginTop: 3, marginLeft: 17 }}>{p.zone} · {p.employees} staff</div>
              </div>
              <Badge tone={p.status === "Operational" ? "ok" : "warn"}>{p.status}</Badge>
            </div>
            <div className="rgrid rgrid-3">
              <div>
                <div style={{ fontSize: 11, color: C.faint }}>Daily Output</div>
                <div className="f-mono" style={{ fontWeight: 700, fontSize: 15, color: C.ink }}>{p.outputDay.toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: C.faint }}>Capacity %</div>
                <div className="f-mono" style={{ fontWeight: 700, fontSize: 15, color: C.ink }}>{pct(p.outputDay, p.capacityDay)}%</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: C.faint }}>MTD Revenue</div>
                <div className="f-mono" style={{ fontWeight: 700, fontSize: 15, color: C.ink }}>{fmtNB(p.mtdRevenueB)}</div>
              </div>
            </div>
            <div style={{ fontSize: 11.5, color: C.sub, marginBottom: 4 }}>Monthly target progress — {pct(p.mtdVials, p.targetMonth)}%</div>
            <Bar value={p.mtdVials} max={p.targetMonth} color={p.color} />
          </Card>
        ))}
      </div>

      <SectionTitle eyebrow="Live Feed" title="System Alerts" />
      <Card style={{ padding: 0 }}>
        {ALERTS.map((a, i) => {
          const icon = a.level === "critical" ? AlertCircle : a.level === "warning" ? AlertTriangle : Info;
          const color = a.level === "critical" ? C.danger : a.level === "warning" ? C.warn : C.sub;
          const Icon = icon;
          return (
            <div key={i} className="flex items-start gap-3" style={{ padding: "13px 18px", borderBottom: i < ALERTS.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <Icon size={16} color={color} style={{ marginTop: 2, flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: 13.5, color: C.ink }}>{a.text}</div>
              <span className="f-mono" style={{ fontSize: 11, color: C.faint, flexShrink: 0 }}>{a.time}</span>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

function ProductionTab() {
  const [sel, setSel] = useState(PLANTS[0].id);
  const plant = PLANTS.find((p) => p.id === sel);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2 flex-wrap">
        {PLANTS.map((p) => (
          <button key={p.id} onClick={() => setSel(p.id)}
            className="f-body" style={{
              padding: "8px 14px", borderRadius: 9, border: `1px solid ${sel === p.id ? p.color : C.border}`,
              background: sel === p.id ? p.color : C.surface, color: sel === p.id ? "#fff" : C.ink,
              fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>
            {p.short} — {p.name.split("—")[0].trim()}
          </button>
        ))}
      </div>

      <SectionTitle eyebrow="Target Management" title={`${plant.name} — Daily & Monthly Targets`} />
      <div className="rgrid rgrid-3">
        <StatTile label="Daily Target" value={plant.shifts.reduce((s, sh) => s + sh.target, 0).toLocaleString()} sub="vials, 3-shift combined" icon={Target} />
        <StatTile label="Monthly Target" value={plant.targetMonth.toLocaleString()} sub={`${pct(plant.mtdVials, plant.targetMonth)}% achieved MTD`} icon={Target} />
        <StatTile label="Installed Capacity" value={plant.capacityDay.toLocaleString() + "/day"} sub={`Utilization ${pct(plant.outputDay, plant.capacityDay)}%`} icon={Gauge} />
      </div>

      <SectionTitle eyebrow="Real-Time Monitor" title="Shift-Wise Production Today" />
      <Card>
        <div className="flex flex-col gap-4">
          {plant.shifts.map((s, i) => (
            <div key={i}>
              <div className="flex justify-between mb-1">
                <span style={{ fontSize: 13, color: C.ink, fontWeight: 600 }}>{s.name}</span>
                <span className="f-mono" style={{ fontSize: 12.5, color: C.sub }}>{s.output.toLocaleString()} / {s.target.toLocaleString()} vials</span>
              </div>
              <Bar value={s.output} max={s.target} color={s.output >= s.target ? C.ok : plant.color} height={10} />
            </div>
          ))}
        </div>
      </Card>

      <SectionTitle eyebrow="Asset Health" title="Equipment Status" />
      <div className="rgrid rgrid-2b">
        {plant.equipment.map((e, i) => (
          <Card key={i} style={{ padding: 14 }}>
            <div className="flex justify-between items-center mb-2">
              <span style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>{e.name}</span>
              <Badge tone={e.status === "Running" || e.status === "Normal" ? "ok" : e.status.includes("Due") || e.status === "Under Load" ? "warn" : "danger"}>{e.status}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Bar value={e.health} max={100} color={e.health > 85 ? C.ok : e.health > 65 ? C.warn : C.danger} />
              <span className="f-mono" style={{ fontSize: 12, color: C.sub, width: 34 }}>{e.health}%</span>
            </div>
            <div style={{ fontSize: 11, color: C.faint, marginTop: 4 }}>{e.type}</div>
          </Card>
        ))}
      </div>

      <SectionTitle eyebrow="Traceability" title="Batch Tracking" />
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}><table className="w-full f-body" style={{ borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: C.bg }}>
              {["Batch ID", "Stage", "Qty (vials)", "QC Status", "ETA"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, color: C.sub, fontWeight: 600, letterSpacing: 0.3 }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {plant.batches.map((b, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${C.border}` }}>
                <td className="f-mono" style={{ padding: "10px 16px", fontWeight: 600 }}>{b.id}</td>
                <td style={{ padding: "10px 16px" }}>{b.stage}</td>
                <td className="f-mono" style={{ padding: "10px 16px" }}>{b.qty.toLocaleString()}</td>
                <td style={{ padding: "10px 16px" }}>
                  <Badge tone={b.qc === "Pass" ? "ok" : b.qc === "Pending" ? "neutral" : "warn"}>{b.qc}</Badge>
                </td>
                <td style={{ padding: "10px 16px", color: C.sub }}>{b.eta}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </Card>
    </div>
  );
}

function FinancialTab() {
  const totalMtdRev = PLANTS.reduce((s, p) => s + p.mtdRevenueB, 0);
  const revenueFull = 8.36, cogs = 4.51, opex = 1.84;
  const gross = revenueFull - cogs;
  const ebit = gross - opex;
  const tax = 0;
  const net = ebit - tax;
  const pnl = [
    { label: "Revenue", val: revenueFull, tone: "ink" },
    { label: "− COGS (API, consumables, direct labor)", val: -cogs, tone: "sub" },
    { label: "= Gross Profit", val: gross, tone: "bold" },
    { label: "− Operating Expenses", val: -opex, tone: "sub" },
    { label: "= EBIT", val: ebit, tone: "bold" },
    { label: "− Tax (Pioneer Status: 0% — Yrs 1–3)", val: -tax, tone: "sub" },
    { label: "= Net Profit", val: net, tone: "final" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle eyebrow="Capital Deployment" title="Investment Allocation — $42.5M Total CapEx" />
      <div className="rgrid rgrid-2wide">
        <Card>
          <div style={{ fontSize: 12, color: C.sub, marginBottom: 10, fontWeight: 600 }}>BY PLANT</div>
          {PLANTS.map((p) => (
            <div key={p.id} className="mb-3">
              <div className="flex justify-between mb-1">
                <span style={{ fontSize: 13, color: C.ink }}>{p.name.split("—")[0].trim()}</span>
                <span className="f-mono" style={{ fontSize: 12.5, color: C.sub }}>${p.capexM}M</span>
              </div>
              <Bar value={p.capexM} max={14} color={p.color} />
            </div>
          ))}
        </Card>
        <Card>
          <div style={{ fontSize: 12, color: C.sub, marginBottom: 10, fontWeight: 600 }}>BY CATEGORY</div>
          {CAPEX_CATS.map((c, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between mb-1">
                <span style={{ fontSize: 13, color: C.ink }}>{c.name}</span>
                <span className="f-mono" style={{ fontSize: 12.5, color: C.sub }}>{c.pct}%</span>
              </div>
              <Bar value={c.pct} max={40} color={C.accent} />
            </div>
          ))}
        </Card>
      </div>

      <SectionTitle eyebrow="Monthly, Aggregate" title="P&L Dashboard" />
      <Card>
        <div className="flex flex-col gap-2.5">
          {pnl.map((r, i) => (
            <div key={i} className="flex justify-between items-center" style={{ padding: "8px 0", borderTop: r.tone === "bold" || r.tone === "final" ? `1px solid ${C.border}` : "none" }}>
              <span className="f-body" style={{ fontSize: r.tone === "final" ? 15 : 13.5, fontWeight: r.tone === "final" || r.tone === "bold" ? 700 : 400, color: r.tone === "final" ? C.primary : C.ink }}>{r.label}</span>
              <span className="f-mono" style={{ fontSize: r.tone === "final" ? 17 : 14, fontWeight: r.tone === "final" || r.tone === "bold" ? 700 : 500, color: r.val < 0 ? C.danger : r.tone === "final" ? C.primary : C.ink }}>
                {r.val < 0 ? "−" : ""}₦{Math.abs(r.val).toFixed(2)}B
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-6 mt-4 pt-3" style={{ borderTop: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 12.5, color: C.sub }}>Gross Margin: <b className="f-mono" style={{ color: C.ink }}>{Math.round((gross / revenueFull) * 100)}%</b></div>
          <div style={{ fontSize: 12.5, color: C.sub }}>EBIT Margin: <b className="f-mono" style={{ color: C.ink }}>{Math.round((ebit / revenueFull) * 100)}%</b></div>
          <div style={{ fontSize: 12.5, color: C.sub }}>Net Profit: <b className="f-mono" style={{ color: C.ink }}>{fmtUSD(net)}/mo</b></div>
        </div>
      </Card>

      <SectionTitle eyebrow="6 Categories, Monthly" title="Expense Tracking — Budget vs Actual (₦M)" />
      <Card>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={EXPENSE_CATS} margin={{ left: -10 }}>
            <CartesianGrid stroke={C.grid} vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10.5, fill: C.sub }} interval={0} angle={-18} textAnchor="end" height={70} />
            <YAxis tick={{ fontSize: 11, fill: C.sub }} />
            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: `1px solid ${C.border}` }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="budget" fill={C.grid} stroke={C.faint} name="Budget" radius={[4, 4, 0, 0]} />
            <Bar dataKey="actual" fill={C.primary} name="Actual" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <SectionTitle eyebrow="Incentives" title="Tax Compliance — Pioneer Status" />
      <Card>
        <div className="flex items-center gap-3 mb-3">
          <CheckCircle2 size={18} color={C.ok} />
          <span style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>Pioneer Status Certificate — Active</span>
          <Badge tone="ok">0% CIT · Year 2 of 3</Badge>
        </div>
        <div className="rgrid rgrid-3">
          <div>
            <div style={{ fontSize: 11, color: C.faint }}>Granting Authority</div>
            <div style={{ fontSize: 13, color: C.ink }}>NIPC / Federal Ministry of Industry</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: C.faint }}>Renewal / Expiry</div>
            <div style={{ fontSize: 13, color: C.ink }}>Mar 2028</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: C.faint }}>Est. Tax Saved (cumulative)</div>
            <div className="f-mono" style={{ fontSize: 13, color: C.ok, fontWeight: 700 }}>₦4.8B</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function LogisticsTab() {
  const modeIcon = { van: Car, motorcycle: Bike, drone: Plane };
  const stockTone = { Active: "ok", Low: "warn", Critical: "danger" };
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle eyebrow="Fulfilment" title="Delivery Management" />
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}><table className="w-full f-body" style={{ borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: C.bg }}>
              {["Order", "Hospital / Clinic", "Origin Plant", "Mode", "Qty", "Status", "ETA"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, color: C.sub, fontWeight: 600 }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DELIVERIES.map((d, i) => {
              const Icon = modeIcon[d.mode];
              return (
                <tr key={i} style={{ borderTop: `1px solid ${C.border}` }}>
                  <td className="f-mono" style={{ padding: "10px 16px", fontWeight: 600 }}>{d.id}</td>
                  <td style={{ padding: "10px 16px" }}>{d.hospital}</td>
                  <td style={{ padding: "10px 16px", color: C.sub }}>{d.origin}</td>
                  <td style={{ padding: "10px 16px" }}><Icon size={15} color={C.sub} /></td>
                  <td className="f-mono" style={{ padding: "10px 16px" }}>{d.qty.toLocaleString()}</td>
                  <td style={{ padding: "10px 16px" }}>
                    <Badge tone={d.status === "Delivered" ? "ok" : d.status === "In Transit" ? "primary" : "neutral"}>{d.status}</Badge>
                  </td>
                  <td style={{ padding: "10px 16px", color: C.sub }}>{d.eta}</td>
                </tr>
              );
            })}
          </tbody>
        </table></div>
      </Card>

      <SectionTitle eyebrow="2–8°C Monitoring" title="Cold Chain — Live Temperature" />
      <div className="rgrid rgrid-4">
        {PLANTS.map((p) => (
          <Card key={p.id} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 12.5, color: C.sub, marginBottom: 6 }}>{p.short} Bulk Store</div>
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <Thermometer size={18} color={C.ok} />
              <span className="f-mono" style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{p.tempC}°C</span>
            </div>
            <Badge tone="ok">{p.coldStatus}</Badge>
          </Card>
        ))}
      </div>

      <SectionTitle eyebrow="847 Active Customers" title="Hospital Network — Stock Status" right={<Badge tone="neutral">Sample of network</Badge>} />
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}><table className="w-full f-body" style={{ borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: C.bg }}>
              {["Facility", "Zone", "Vials on Hand", "Status", ""].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, color: C.sub, fontWeight: 600 }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOSPITALS.map((h, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${C.border}` }}>
                <td style={{ padding: "10px 16px" }}>{h.name}</td>
                <td style={{ padding: "10px 16px", color: C.sub }}>{h.zone}</td>
                <td className="f-mono" style={{ padding: "10px 16px" }}>{h.vials.toLocaleString()}</td>
                <td style={{ padding: "10px 16px" }}><Badge tone={stockTone[h.stock]}>{h.stock}</Badge></td>
                <td style={{ padding: "10px 16px" }}>
                  {h.stock !== "Active" && (
                    <button className="f-body" style={{ fontSize: 12, fontWeight: 600, color: "#fff", background: C.primary, border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer" }}>
                      Reorder
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </Card>
    </div>
  );
}

function AnalyticsTab() {
  const plantComp = PLANTS.map((p) => ({
    name: p.short, Utilization: pct(p.outputDay, p.capacityDay), Margin: 24 + (p.status === "Operational" ? 4 : -3), Output: Math.round(p.outputDay / 100),
  }));
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle eyebrow="8-Week Trend" title="Production Trends" />
      <Card>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={WEEKLY_PROD}>
            <CartesianGrid stroke={C.grid} vertical={false} />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: C.sub }} />
            <YAxis tick={{ fontSize: 11, fill: C.sub }} />
            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: `1px solid ${C.border}` }} formatter={(v) => v.toLocaleString()} />
            <Bar dataKey="vials" fill={C.primary} radius={[5, 5, 0, 0]} name="Vials produced" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <SectionTitle eyebrow="6-Month Trend, ₦B" title="Revenue vs Cost" />
      <Card>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={REV_COST_TREND}>
            <CartesianGrid stroke={C.grid} vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.sub }} />
            <YAxis tick={{ fontSize: 11, fill: C.sub }} />
            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: `1px solid ${C.border}` }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="revenue" stroke={C.primary} strokeWidth={2.5} dot={{ r: 3 }} name="Revenue" />
            <Line type="monotone" dataKey="cost" stroke={C.accent} strokeWidth={2.5} dot={{ r: 3 }} name="Total Cost" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="rgrid rgrid-2wide">
        <div>
          <SectionTitle eyebrow="Benchmark" title="Plant Comparison" />
          <Card>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={plantComp}>
                <PolarGrid stroke={C.grid} />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 12, fill: C.ink }} />
                <PolarRadiusAxis tick={{ fontSize: 9, fill: C.faint }} />
                <Radar name="Utilization %" dataKey="Utilization" stroke={C.primary} fill={C.primary} fillOpacity={0.35} />
                <Radar name="Margin %" dataKey="Margin" stroke={C.accent} fill={C.accent} fillOpacity={0.25} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </div>
        <div>
          <SectionTitle eyebrow="AI-Powered" title="Demand Forecasting" />
          <Card>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={DEMAND_FORECAST}>
                <CartesianGrid stroke={C.grid} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.sub }} />
                <YAxis tick={{ fontSize: 11, fill: C.sub }} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: `1px solid ${C.border}` }} />
                <Area type="monotone" dataKey="actual" stroke={C.primary} fill={C.primaryLight} strokeWidth={2.5} name="Actual (k vials)" />
                <Area type="monotone" dataKey="forecast" stroke={C.accent} fill={C.accentLight} strokeWidth={2.5} strokeDasharray="5 4" name="Forecast (k vials, 80% CI)" />
              </AreaChart>
            </ResponsiveContainer>
            <div style={{ fontSize: 11.5, color: C.faint, marginTop: 6 }}>Model: seasonal-adjusted regression on 24-mo demand + hospital reorder velocity. Confidence narrows closer to present.</div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ComplianceTab() {
  const nafdac = [
    { plant: "Lagos", status: "Registered", gmp: 100, inspection: "Aug 14, 2026" },
    { plant: "Kano", status: "Registered", gmp: 92, inspection: "Sep 02, 2026" },
    { plant: "Port Harcourt", status: "Provisional", gmp: 78, inspection: "Oct 20, 2026" },
    { plant: "Abuja", status: "Registered", gmp: 97, inspection: "Aug 30, 2026" },
  ];
  const qc = [
    { test: "Sterility Testing", pass: 99.6 },
    { test: "Potency Assay", pass: 98.9 },
    { test: "Visual Inspection", pass: 99.8 },
  ];
  const docs = [
    { name: "SOP-Fill-Finish-Line-Ops", version: "v4.2", status: "Current", updated: "Jun 2026" },
    { name: "SOP-Cold-Chain-Excursion-Response", version: "v2.1", status: "Current", updated: "May 2026" },
    { name: "SOP-Batch-Release-QC", version: "v5.0", status: "Under Review", updated: "Jul 2026" },
    { name: "Training-Record-GMP-Induction", version: "v1.3", status: "Current", updated: "Jan 2026" },
  ];
  const events = [
    { id: "AE-0231", severity: "Minor", desc: "Injection-site irritation reported", status: "Reported to NAFDAC", date: "Jul 22" },
    { id: "AE-0230", severity: "Moderate", desc: "Suspected potency deviation, single lot", status: "Under Investigation", date: "Jul 18" },
  ];
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle eyebrow="Regulatory" title="NAFDAC Tracking" />
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}><table className="w-full f-body" style={{ borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: C.bg }}>
              {["Plant", "Registration", "GMP Checklist", "Next Inspection"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, color: C.sub, fontWeight: 600 }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {nafdac.map((n, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${C.border}` }}>
                <td style={{ padding: "10px 16px", fontWeight: 600 }}>{n.plant}</td>
                <td style={{ padding: "10px 16px" }}><Badge tone={n.status === "Registered" ? "ok" : "warn"}>{n.status}</Badge></td>
                <td style={{ padding: "10px 16px", width: 220 }}>
                  <div className="flex items-center gap-2">
                    <Bar value={n.gmp} max={100} color={n.gmp > 90 ? C.ok : C.warn} />
                    <span className="f-mono" style={{ fontSize: 12, color: C.sub }}>{n.gmp}%</span>
                  </div>
                </td>
                <td style={{ padding: "10px 16px", color: C.sub }}>{n.inspection}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </Card>

      <div className="rgrid rgrid-3">
        {qc.map((q, i) => (
          <StatTile key={i} label={q.test} value={q.pass + "%"} sub="pass rate, trailing 90 days" trend="up" icon={FlaskConical} />
        ))}
      </div>

      <SectionTitle eyebrow="Document Control" title="SOP Version Management" />
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}><table className="w-full f-body" style={{ borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: C.bg }}>
              {["Document", "Version", "Status", "Last Updated"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, color: C.sub, fontWeight: 600 }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {docs.map((d, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${C.border}` }}>
                <td style={{ padding: "10px 16px" }}>{d.name}</td>
                <td className="f-mono" style={{ padding: "10px 16px" }}>{d.version}</td>
                <td style={{ padding: "10px 16px" }}><Badge tone={d.status === "Current" ? "ok" : "warn"}>{d.status}</Badge></td>
                <td style={{ padding: "10px 16px", color: C.sub }}>{d.updated}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </Card>

      <SectionTitle eyebrow="Patient Safety" title="Adverse Event Tracking" />
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}><table className="w-full f-body" style={{ borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: C.bg }}>
              {["Event ID", "Severity", "Description", "Status", "Date"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, color: C.sub, fontWeight: 600 }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {events.map((e, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${C.border}` }}>
                <td className="f-mono" style={{ padding: "10px 16px", fontWeight: 600 }}>{e.id}</td>
                <td style={{ padding: "10px 16px" }}><Badge tone={e.severity === "Minor" ? "neutral" : "warn"}>{e.severity}</Badge></td>
                <td style={{ padding: "10px 16px" }}>{e.desc}</td>
                <td style={{ padding: "10px 16px", color: C.sub }}>{e.status}</td>
                <td style={{ padding: "10px 16px", color: C.sub }}>{e.date}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </Card>
    </div>
  );
}

function RoadmapTab() {
  const toneFor = { HIGH: "danger", MEDIUM: "warn", FUTURE: "neutral" };
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle eyebrow="Beyond the POC" title="Additional Functionality — Recommended Roadmap" />
      <div className="rgrid rgrid-2">
        {ROADMAP.map((r, i) => {
          const Icon = r.icon;
          return (
            <Card key={i}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={16} color={C.primary} />
                  </div>
                  <span className="f-display" style={{ fontWeight: 600, fontSize: 15, color: C.ink }}>{r.title}</span>
                </div>
                <Badge tone={toneFor[r.priority]}>{r.priority}</Badge>
              </div>
              <p style={{ fontSize: 13, color: C.sub, margin: "8px 0 10px", lineHeight: 1.5 }}>{r.why}</p>
              <div className="flex flex-col gap-1.5">
                {r.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <ChevronRight size={12} color={C.faint} />
                    <span style={{ fontSize: 12.5, color: C.ink }}>{f}</span>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------- APP ---------------------------------- */
export default function App() {
  const [tab, setTab] = useState("overview");
  const tabs = { overview: OverviewTab, production: ProductionTab, financial: FinancialTab, logistics: LogisticsTab, analytics: AnalyticsTab, compliance: ComplianceTab, roadmap: RoadmapTab };
  const Active = tabs[tab];

  return (
    <div className="f-body app-shell" style={{ background: C.bg, color: C.ink }}>
      <style>{FONTS}</style>
      {/* Sidebar */}
      <div className="sidebar" style={{ background: C.navy }}>
        <div className="flex items-center gap-2 sidebar-brand" style={{ padding: "0 8px", marginBottom: 26 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <FlaskConical size={16} color="#fff" />
          </div>
          <div>
            <div className="f-display" style={{ color: "#fff", fontWeight: 700, fontSize: 14.5, lineHeight: 1.1 }}>InsulinNG</div>
            <div className="f-mono" style={{ color: "#8FA5B8", fontSize: 9.5, letterSpacing: 0.5 }}>OPS PLATFORM · POC</div>
          </div>
        </div>
        <div className="sidebar-nav">
          {NAV.map((n) => {
            const Icon = n.icon;
            const active = tab === n.id;
            return (
              <button key={n.id} onClick={() => setTab(n.id)}
                className="flex items-center gap-2.5 f-body nav-btn"
                style={{
                  padding: "9px 12px", borderRadius: 8, border: "none", cursor: "pointer", textAlign: "left",
                  background: active ? "rgba(255,255,255,0.08)" : "transparent",
                  color: active ? "#fff" : "#9FB3C8", fontSize: 13.5, fontWeight: active ? 600 : 500,
                }}>
                <Icon size={16} />
                <span className="nav-label">{n.label}</span>
              </button>
            );
          })}
        </div>
        <div className="sidebar-footer" style={{ marginTop: "auto", padding: "14px 12px", background: "rgba(255,255,255,0.06)", borderRadius: 10 }}>
          <div style={{ fontSize: 11, color: "#8FA5B8", marginBottom: 4 }}>Network capacity live</div>
          <div className="f-mono" style={{ color: "#fff", fontSize: 15, fontWeight: 700 }}>28,850 <span style={{ fontWeight: 400, fontSize: 11, color: "#8FA5B8" }}>vials/day</span></div>
        </div>
      </div>

      {/* Main */}
      <div className="main-col">
        <div className="header-bar" style={{ borderBottom: `1px solid ${C.border}`, background: C.surface }}>
          <div>
            <div className="f-mono" style={{ fontSize: 11, color: C.faint, letterSpacing: 0.5 }}>MON, JUL 27 2026 · 08:24 WAT</div>
            <h1 className="f-display" style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{NAV.find((n) => n.id === tab).label}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div style={{ width: 8, height: 8, borderRadius: 99, background: C.ok, flexShrink: 0 }} />
            <span style={{ fontSize: 12.5, color: C.sub, whiteSpace: "nowrap" }}>All systems operational</span>
          </div>
        </div>
        <div className="main-content">
          <Active />
        </div>
      </div>
    </div>
  );
}
