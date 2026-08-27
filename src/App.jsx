import React, { useState, useMemo } from "react";
import {
  Search, MapPin, Phone, MessageCircle, Star, Share2, Flag, ChevronRight,
  ChevronLeft, Plus, Check, X, LayoutDashboard, Users, ListChecks, Clock,
  ShieldCheck, TrendingUp, LogOut, Menu, Camera, Building2, AlertTriangle,
  Trash2, Pencil, ArrowLeft, BadgeCheck, Navigation
} from "lucide-react";

/* ---------------------------------- THEME ---------------------------------
   Primary green #16A34A (savanna-market awning green), warm sunbaked amber
   (#F0A93B) for verification/rating accents, deep charcoal (#26302B) for
   text, soft clay-sand surface (#FBF8F2) for the app background — a nod to
   Minna's laterite roads rather than generic AI-cream/terracotta.
------------------------------------------------------------------------- */
const COLORS = {
  primary: "#16A34A",
  primaryDark: "#0E7A38",
  primaryTint: "#EAF7EE",
  amber: "#F0A93B",
  amberTint: "#FDF3E2",
  ink: "#26302B",
  inkSoft: "#5B655F",
  surface: "#FBF8F2",
  card: "#FFFFFF",
  line: "#E7E2D6",
  danger: "#D8503A",
};

const CATEGORIES = [
  "Restaurants", "Hotels", "Salons", "Barbers", "Hospitals", "Clinics",
  "Pharmacies", "Schools", "Mosques", "Churches", "Filling Stations",
  "Mechanics", "Car Wash", "POS Agents", "Supermarkets", "Tailors",
  "Fashion Designers", "Phone Repair", "Electronics", "Printing Press",
  "Event Centres", "Building Materials", "Plumbers", "Electricians",
];

const LOCATIONS = ["Minna", "Bosso", "Chanchaga", "Tunga", "Suleja", "Bida", "Kontagora"];

const CAT_ICON = (cat) => {
  const map = {
    Restaurants: "🍲", Hotels: "🛏️", Salons: "💇🏽‍♀️", Barbers: "💈",
    Hospitals: "🏥", Clinics: "⚕️", Pharmacies: "💊", Schools: "🎒",
    Mosques: "🕌", Churches: "⛪", "Filling Stations": "⛽",
    Mechanics: "🔧", "Car Wash": "🚿", "POS Agents": "💳",
    Supermarkets: "🛒", Tailors: "🧵", "Fashion Designers": "👗",
    "Phone Repair": "📱", Electronics: "🔌", "Printing Press": "🖨️",
    "Event Centres": "🎪", "Building Materials": "🧱", Plumbers: "🚰",
    Electricians: "💡",
  };
  return map[cat] || "🏪";
};

/* --------------------------------- MOCK DATA ------------------------------- */
let idCounter = 100;
const nextId = () => String(++idCounter);

const initialBusinesses = [
  {
    id: "1", name: "Baba Ijebu Restaurant", category: "Restaurants", location: "Minna",
    address: "12 Bosso Road, Minna, Niger State", phone: "08031234567", whatsapp: "2348031234567",
    description: "Home-style Nigerian dishes — jollof rice, pepper soup, and grilled fish, made fresh daily. Popular lunch spot for civil servants around Bosso Road.",
    hours: "Mon–Sat: 8:00 AM – 9:00 PM, Sun: 12:00 PM – 8:00 PM",
    status: "approved", verified: true, ownerId: "owner-1",
    logo: "🍛", cover: "linear-gradient(135deg,#F0A93B,#e08b1f)",
    rating: 4.6, reviews: [
      { id: "r1", name: "Amina", rating: 5, text: "Best jollof in Minna, hands down.", date: "2026-07-02" },
      { id: "r2", name: "Chidi O.", rating: 4, text: "Great food, service can be slow at peak hours.", date: "2026-06-14" },
    ],
  },
  {
    id: "2", name: "GreenLeaf Suites", category: "Hotels", location: "Chanchaga",
    address: "5 Paiko Road, Chanchaga, Minna", phone: "08056781234", whatsapp: "2348056781234",
    description: "Comfortable budget-to-mid-range hotel with 24-hour power, free WiFi, and a small conference room for meetings.",
    hours: "Open 24 hours",
    status: "approved", verified: true, ownerId: "owner-2",
    logo: "🏨", cover: "linear-gradient(135deg,#16A34A,#0E7A38)",
    rating: 4.3, reviews: [{ id: "r3", name: "Grace", rating: 4, text: "Clean rooms, steady light. Would book again.", date: "2026-05-30" }],
  },
  {
    id: "3", name: "Tunga Fresh Pharmacy", category: "Pharmacies", location: "Tunga",
    address: "Along Tunga Market Road, Minna", phone: "08123456789", whatsapp: "2348123456789",
    description: "Registered pharmacy stocking prescription drugs, first-aid supplies, and baby care essentials.",
    hours: "Mon–Sun: 7:00 AM – 10:00 PM",
    status: "approved", verified: true, ownerId: "owner-3",
    logo: "💊", cover: "linear-gradient(135deg,#3B82C4,#245a8c)",
    rating: 4.8, reviews: [{ id: "r4", name: "Yusuf", rating: 5, text: "Always has what I need, friendly staff.", date: "2026-07-10" }],
  },
  {
    id: "4", name: "Bosso Auto Mechanics", category: "Mechanics", location: "Bosso",
    address: "Behind FUT Minna Gate, Bosso", phone: "08098765432", whatsapp: "2348098765432",
    description: "General auto repairs, engine diagnostics, and tyre services for cars and small buses.",
    hours: "Mon–Sat: 8:00 AM – 6:00 PM",
    status: "approved", verified: false, ownerId: "owner-1",
    logo: "🔧", cover: "linear-gradient(135deg,#5B655F,#3a4239)",
    rating: 4.1, reviews: [],
  },
  {
    id: "5", name: "Suleja POS & Payments", category: "POS Agents", location: "Suleja",
    address: "Suleja Central Market, Suleja", phone: "08145678901", whatsapp: "2348145678901",
    description: "Fast, reliable POS withdrawals and transfers, no network wahala.",
    hours: "Mon–Sun: 7:00 AM – 9:00 PM",
    status: "pending", verified: false, ownerId: "owner-2",
    logo: "💳", cover: "linear-gradient(135deg,#F0A93B,#c8791f)",
    rating: 0, reviews: [],
  },
  {
    id: "6", name: "Kontagora Bridal & Tailoring", category: "Tailors", location: "Kontagora",
    address: "GRA Road, Kontagora", phone: "08167891234", whatsapp: "2348167891234",
    description: "Custom-fit native wear, corporate wear, and bridal outfits with a 3-day rush option.",
    hours: "Mon–Sat: 9:00 AM – 7:00 PM",
    status: "pending", verified: false, ownerId: "owner-3",
    logo: "🧵", cover: "linear-gradient(135deg,#16A34A,#0b5c2a)",
    rating: 0, reviews: [],
  },
  {
    id: "7", name: "Bida Electronics Hub", category: "Electronics", location: "Bida",
    address: "Doko Road, Bida", phone: "08189991234", whatsapp: "2348189991234",
    description: "Phones, home appliances, generators and accessories at fair prices, with warranty.",
    hours: "Mon–Sat: 8:30 AM – 7:00 PM",
    status: "rejected", verified: false, ownerId: "owner-1",
    logo: "🔌", cover: "linear-gradient(135deg,#3B82C4,#1c3f5c)",
    rating: 0, reviews: [],
    rejectionReason: "Phone number could not be verified. Please resubmit with a working line.",
  },
];

const initialUsers = [
  { id: "owner-1", name: "Fatima Bello", email: "fatima@example.com", role: "owner", joined: "2026-03-11" },
  { id: "owner-2", name: "Chidi Okafor", email: "chidi@example.com", role: "owner", joined: "2026-04-02" },
  { id: "owner-3", name: "Musa Danladi", email: "musa@example.com", role: "owner", joined: "2026-05-19" },
  { id: "visitor-1", name: "Amina Yusuf", email: "amina@example.com", role: "visitor", joined: "2026-06-01" },
];

const initialReports = [
  { id: "rep-1", businessId: "4", businessName: "Bosso Auto Mechanics", reason: "Phone number no longer active", date: "2026-08-10", status: "open" },
];

/* --------------------------------- HELPERS --------------------------------- */
function StatusPill({ status }) {
  const styles = {
    approved: { bg: COLORS.primaryTint, fg: COLORS.primaryDark, label: "Approved" },
    pending: { bg: COLORS.amberTint, fg: "#9A6A0F", label: "Pending review" },
    rejected: { bg: "#FBEAE6", fg: COLORS.danger, label: "Rejected" },
  }[status];
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: styles.bg, color: styles.fg }}
    >
      {status === "approved" && <Check size={12} strokeWidth={3} />}
      {status === "pending" && <Clock size={12} strokeWidth={3} />}
      {status === "rejected" && <X size={12} strokeWidth={3} />}
      {styles.label}
    </span>
  );
}

function Stars({ value, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          fill={n <= Math.round(value) ? COLORS.amber : "none"}
          stroke={n <= Math.round(value) ? COLORS.amber : COLORS.line}
        />
      ))}
    </div>
  );
}

function avgRating(biz) {
  if (!biz.reviews.length) return 0;
  return biz.reviews.reduce((s, r) => s + r.rating, 0) / biz.reviews.length;
}

/* ==================================  APP  ================================== */
export default function MaboMap() {
  const [view, setView] = useState({ name: "home" });
  const [businesses, setBusinesses] = useState(initialBusinesses);
  const [users] = useState(initialUsers);
  const [reports, setReports] = useState(initialReports);
  const [searchCount, setSearchCount] = useState(214);

  const [ownerSession, setOwnerSession] = useState(null); // {id, name}
  const [adminSession, setAdminSession] = useState(false);

  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [locFilter, setLocFilter] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (name, extra = {}) => { setMenuOpen(false); setView({ name, ...extra }); window.scrollTo?.(0, 0); };

  const runSearch = (q = query, cat = catFilter, loc = locFilter) => {
    setSearchCount((c) => c + 1);
    go("search", { q, cat, loc });
  };

  const approvedBusinesses = businesses.filter((b) => b.status === "approved");
  const featured = approvedBusinesses.filter((b) => b.verified).slice(0, 6);

  const results = useMemo(() => {
    if (view.name !== "search") return [];
    const q = (view.q || "").toLowerCase().trim();
    return approvedBusinesses.filter((b) => {
      const matchesQ = !q || b.name.toLowerCase().includes(q) || b.category.toLowerCase().includes(q);
      const matchesCat = !view.cat || b.category === view.cat;
      const matchesLoc = !view.loc || b.location === view.loc;
      return matchesQ && matchesCat && matchesLoc;
    });
  }, [view, businesses]);

  const stats = {
    total: businesses.length,
    pending: businesses.filter((b) => b.status === "pending").length,
    approved: businesses.filter((b) => b.status === "approved").length,
    users: users.length,
    searches: searchCount,
  };

  /* ---------- mutation helpers ---------- */
  const addBusiness = (data) => {
    const biz = {
      id: nextId(), status: "pending", verified: false, rating: 0, reviews: [],
      ownerId: ownerSession.id, logo: CAT_ICON(data.category), cover: "linear-gradient(135deg,#16A34A,#0E7A38)",
      ...data,
    };
    setBusinesses((prev) => [biz, ...prev]);
    return biz;
  };
  const updateBusiness = (id, patch) => setBusinesses((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  const deleteBusiness = (id) => setBusinesses((prev) => prev.filter((b) => b.id !== id));
  const addReview = (id, review) =>
    setBusinesses((prev) => prev.map((b) => (b.id === id ? { ...b, reviews: [review, ...b.reviews] } : b)));
  const addReport = (biz, reason) =>
    setReports((prev) => [{ id: nextId(), businessId: biz.id, businessName: biz.name, reason, date: "2026-08-27", status: "open" }, ...prev]);

  return (
    <div style={{ background: COLORS.surface, color: COLORS.ink, minHeight: "100%", fontFamily: "'Inter', ui-sans-serif, system-ui" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Manrope', ui-sans-serif, system-ui; }
        * { box-sizing: border-box; }
        button { cursor: pointer; }
        input, select, textarea { font-family: inherit; }
        ::placeholder { color: #9AA39C; }
      `}</style>

      <Header go={go} view={view} menuOpen={menuOpen} setMenuOpen={setMenuOpen} ownerSession={ownerSession} adminSession={adminSession} />

      <main>
        {view.name === "home" && (
          <Home
            go={go} query={query} setQuery={setQuery} catFilter={catFilter} setCatFilter={setCatFilter}
            locFilter={locFilter} setLocFilter={setLocFilter} runSearch={runSearch} featured={featured}
          />
        )}

        {view.name === "search" && (
          <SearchResults view={view} results={results} go={go} setCatFilter={setCatFilter} setLocFilter={setLocFilter} runSearch={runSearch} />
        )}

        {view.name === "business" && (
          <BusinessProfile
            biz={businesses.find((b) => b.id === view.id)}
            go={go}
            addReview={addReview}
            addReport={addReport}
          />
        )}

        {view.name === "owner-login" && <OwnerAuth go={go} setOwnerSession={setOwnerSession} users={users} />}

        {view.name === "owner-dashboard" && ownerSession && (
          <OwnerDashboard
            ownerSession={ownerSession} businesses={businesses.filter((b) => b.ownerId === ownerSession.id)}
            go={go} setOwnerSession={setOwnerSession}
          />
        )}

        {view.name === "owner-add" && ownerSession && (
          <BusinessForm mode="add" go={go} onSubmit={(data) => { addBusiness(data); go("owner-dashboard"); }} />
        )}

        {view.name === "owner-edit" && ownerSession && (
          <BusinessForm
            mode="edit" go={go} initial={businesses.find((b) => b.id === view.id)}
            onSubmit={(data) => { updateBusiness(view.id, { ...data, status: "pending" }); go("owner-dashboard"); }}
          />
        )}

        {view.name === "admin-login" && <AdminAuth go={go} setAdminSession={setAdminSession} />}

        {view.name === "admin-dashboard" && adminSession && (
          <AdminDashboard
            stats={stats} businesses={businesses} reports={reports} users={users}
            updateBusiness={updateBusiness} deleteBusiness={deleteBusiness} go={go} setAdminSession={setAdminSession}
          />
        )}
      </main>

      <Footer go={go} />
    </div>
  );
}

/* =============================== HEADER / FOOTER =============================== */
function Header({ go, view, menuOpen, setMenuOpen, ownerSession, adminSession }) {
  const NavLink = ({ label, onClick, active }) => (
    <button
      onClick={onClick}
      className="text-sm font-semibold px-3 py-2 rounded-lg transition-colors"
      style={{ color: active ? COLORS.primary : COLORS.inkSoft, background: active ? COLORS.primaryTint : "transparent" }}
    >
      {label}
    </button>
  );
  return (
    <header className="sticky top-0 z-20" style={{ background: COLORS.card, borderBottom: `1px solid ${COLORS.line}` }}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <button onClick={() => go("home")} className="flex items-center gap-2">
          <span
            className="w-9 h-9 rounded-xl flex items-center justify-center font-display font-extrabold text-white"
            style={{ background: COLORS.primary }}
          >
            M
          </span>
          <span className="font-display font-extrabold text-lg tracking-tight" style={{ color: COLORS.ink }}>
            MABO <span style={{ color: COLORS.primary }}>MAP</span>
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink label="Home" onClick={() => go("home")} active={view.name === "home"} />
          <NavLink
            label="Business Portal"
            onClick={() => go(ownerSession ? "owner-dashboard" : "owner-login")}
            active={view.name.startsWith("owner")}
          />
          <NavLink
            label="Admin"
            onClick={() => go(adminSession ? "admin-dashboard" : "admin-login")}
            active={view.name.startsWith("admin")}
          />
        </nav>

        <button className="md:hidden p-2 rounded-lg" style={{ background: COLORS.primaryTint }} onClick={() => setMenuOpen((v) => !v)}>
          <Menu size={20} color={COLORS.primary} />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pb-3 flex flex-col gap-1" style={{ borderTop: `1px solid ${COLORS.line}` }}>
          <NavLink label="Home" onClick={() => go("home")} active={view.name === "home"} />
          <NavLink label="Business Portal" onClick={() => go(ownerSession ? "owner-dashboard" : "owner-login")} active={view.name.startsWith("owner")} />
          <NavLink label="Admin" onClick={() => go(adminSession ? "admin-dashboard" : "admin-login")} active={view.name.startsWith("admin")} />
        </div>
      )}
    </header>
  );
}

function Footer({ go }) {
  const [modal, setModal] = useState(null);
  const content = {
    about: { title: "About MABO MAP", body: "MABO MAP is a local business directory helping residents and visitors discover trusted businesses and services across Niger State, starting in Minna, Bosso, Chanchaga, Tunga, Suleja, Bida and Kontagora — with more Nigerian states coming soon." },
    contact: { title: "Contact Us", body: "Reach the MABO MAP team at hello@mabomap.ng or +234 800 000 0000. We reply within one business day." },
    privacy: { title: "Privacy Policy", body: "We collect only what's needed to list and verify businesses and to let visitors search, review, and contact them. We never sell personal data to third parties." },
    terms: { title: "Terms of Service", body: "Business listings must be accurate and lawful. MABO MAP reviews every submission before publishing and may remove listings that violate these terms." },
  };
  return (
    <footer className="mt-16" style={{ background: COLORS.ink, color: "#DDE3DC" }}>
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="font-display font-extrabold text-white text-lg mb-2">MABO MAP</div>
          <p className="text-sm" style={{ color: "#A7B0A4" }}>Find trusted businesses near you, starting in Niger State.</p>
        </div>
        <FooterCol title="Company" links={[["About", "about"], ["Contact", "contact"]]} onClick={setModal} />
        <FooterCol title="Legal" links={[["Privacy Policy", "privacy"], ["Terms of Service", "terms"]]} onClick={setModal} />
        <div>
          <div className="text-sm font-semibold text-white mb-3">Popular locations</div>
          <div className="flex flex-wrap gap-1.5">
            {LOCATIONS.slice(0, 4).map((l) => (
              <span key={l} className="text-xs px-2 py-1 rounded-full" style={{ background: "#33403A" }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="text-center text-xs py-4" style={{ borderTop: "1px solid #33403A", color: "#8A948A" }}>
        © 2026 MABO MAP. Built for Niger State — expanding across Nigeria.
      </div>

      {modal && (
        <Modal onClose={() => setModal(null)} title={content[modal].title}>
          <p className="text-sm leading-relaxed" style={{ color: COLORS.inkSoft }}>{content[modal].body}</p>
        </Modal>
      )}
    </footer>
  );
}
function FooterCol({ title, links, onClick }) {
  return (
    <div>
      <div className="text-sm font-semibold text-white mb-3">{title}</div>
      <div className="flex flex-col gap-2">
        {links.map(([label, key]) => (
          <button key={key} onClick={() => onClick(key)} className="text-sm text-left" style={{ color: "#A7B0A4" }}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Modal({ onClose, title, children, wide }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4" style={{ background: "rgba(20,24,20,0.55)" }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${wide ? "md:max-w-2xl" : "md:max-w-md"} rounded-t-3xl md:rounded-2xl p-6 max-h-[85vh] overflow-y-auto`}
        style={{ background: COLORS.card }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-full" style={{ background: COLORS.surface }}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* =================================== HOME =================================== */
function Home({ go, query, setQuery, catFilter, setCatFilter, locFilter, setLocFilter, runSearch, featured }) {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${COLORS.primaryTint}, ${COLORS.surface})` }}>
        <div className="max-w-6xl mx-auto px-4 pt-12 pb-16 md:pt-20 md:pb-24">
          <div className="flex items-center gap-1.5 mb-4 flex-wrap">
            {LOCATIONS.map((l, i) => (
              <React.Fragment key={l}>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1" style={{ background: COLORS.card, color: COLORS.primaryDark, border: `1px solid ${COLORS.line}` }}>
                  <MapPin size={11} /> {l}
                </span>
                {i < LOCATIONS.length - 1 && <ChevronRight size={12} color={COLORS.line} />}
              </React.Fragment>
            ))}
          </div>

          <h1 className="font-display font-extrabold text-3xl md:text-5xl leading-tight max-w-2xl" style={{ color: COLORS.ink }}>
            Find Businesses Near You in <span style={{ color: COLORS.primary }}>Niger State</span>
          </h1>
          <p className="mt-3 text-base md:text-lg max-w-xl" style={{ color: COLORS.inkSoft }}>
            Search restaurants, hospitals, mechanics, tailors and hundreds more — every listing reviewed and verified before it goes live.
          </p>

          {/* SEARCH BAR */}
          <div className="mt-8 rounded-2xl p-3 md:p-4" style={{ background: COLORS.card, boxShadow: "0 12px 30px -12px rgba(22,44,30,0.18)", border: `1px solid ${COLORS.line}` }}>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex items-center gap-2 flex-1 px-3 py-2.5 rounded-xl" style={{ background: COLORS.surface }}>
                <Search size={18} color={COLORS.inkSoft} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runSearch()}
                  placeholder="Search business name or category…"
                  className="bg-transparent outline-none w-full text-sm"
                />
              </div>
              <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: COLORS.surface, color: COLORS.ink, border: "none" }}>
                <option value="">All categories</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={locFilter} onChange={(e) => setLocFilter(e.target.value)} className="px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: COLORS.surface, color: COLORS.ink, border: "none" }}>
                <option value="">All locations</option>
                {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
              <button
                onClick={() => runSearch()}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                style={{ background: COLORS.primary }}
              >
                <Search size={16} /> Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-xl">Popular categories</h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {CATEGORIES.slice(0, 12).map((c) => (
            <button
              key={c}
              onClick={() => { setCatFilter(c); runSearch(query, c, locFilter); }}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-transform hover:-translate-y-0.5"
              style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, boxShadow: "0 6px 16px -12px rgba(22,44,30,0.2)" }}
            >
              <span className="text-2xl">{CAT_ICON(c)}</span>
              <span className="text-xs font-semibold text-center leading-tight" style={{ color: COLORS.ink }}>{c}</span>
            </button>
          ))}
        </div>
        <button onClick={() => runSearch("", "", "")} className="mt-4 text-sm font-semibold flex items-center gap-1" style={{ color: COLORS.primary }}>
          View all categories <ChevronRight size={14} />
        </button>
      </section>

      {/* FEATURED */}
      <section className="max-w-6xl mx-auto px-4 py-4 pb-16">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-xl">Featured verified businesses</h2>
          <button onClick={() => runSearch("", "", "")} className="text-sm font-semibold flex items-center gap-1" style={{ color: COLORS.primary }}>
            See all <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((b) => <BusinessCard key={b.id} biz={b} onClick={() => go("business", { id: b.id })} />)}
        </div>
      </section>
    </div>
  );
}

function BusinessCard({ biz, onClick }) {
  const rating = biz.rating || avgRating(biz);
  return (
    <button onClick={onClick} className="text-left rounded-2xl overflow-hidden flex flex-col" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, boxShadow: "0 8px 20px -14px rgba(22,44,30,0.25)" }}>
      <div className="h-24 flex items-center px-4" style={{ background: biz.cover }}>
        <span className="text-3xl bg-white/90 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm">{biz.logo}</span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-bold text-sm leading-snug">{biz.name}</h3>
          {biz.verified && <BadgeCheck size={16} color={COLORS.primary} className="shrink-0 mt-0.5" />}
        </div>
        <p className="text-xs mt-1" style={{ color: COLORS.inkSoft }}>{biz.category} · {biz.location}</p>
        <div className="flex items-center gap-1.5 mt-2">
          <Stars value={rating} size={12} />
          <span className="text-xs" style={{ color: COLORS.inkSoft }}>{rating ? rating.toFixed(1) : "New"}</span>
        </div>
      </div>
    </button>
  );
}

/* =============================== SEARCH RESULTS =============================== */
function SearchResults({ view, results, go, setCatFilter, setLocFilter, runSearch }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button onClick={() => go("home")} className="text-sm font-semibold flex items-center gap-1 mb-4" style={{ color: COLORS.inkSoft }}>
        <ArrowLeft size={14} /> Back to home
      </button>
      <h1 className="font-display font-bold text-2xl mb-1">
        {results.length} result{results.length !== 1 ? "s" : ""} {view.q ? `for "${view.q}"` : ""}
      </h1>
      <p className="text-sm mb-6" style={{ color: COLORS.inkSoft }}>
        {view.cat || "All categories"} {view.loc ? `· ${view.loc}` : ""}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        <select value={view.cat || ""} onChange={(e) => runSearch(view.q, e.target.value, view.loc)} className="px-3 py-2 rounded-xl text-sm" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}` }}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={view.loc || ""} onChange={(e) => runSearch(view.q, view.cat, e.target.value)} className="px-3 py-2 rounded-xl text-sm" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}` }}>
          <option value="">All locations</option>
          {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {results.length === 0 ? (
        <EmptyState icon={<Search size={28} color={COLORS.inkSoft} />} title="No businesses found" body="Try a different name, category, or location." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((b) => <BusinessCard key={b.id} biz={b} onClick={() => go("business", { id: b.id })} />)}
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon, title, body, action }) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-6 rounded-2xl" style={{ background: COLORS.card, border: `1px dashed ${COLORS.line}` }}>
      <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: COLORS.surface }}>{icon}</div>
      <h3 className="font-display font-bold text-base mb-1">{title}</h3>
      <p className="text-sm max-w-xs" style={{ color: COLORS.inkSoft }}>{body}</p>
      {action}
    </div>
  );
}

/* =============================== BUSINESS PROFILE =============================== */
function BusinessProfile({ biz, go, addReview, addReport }) {
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState("");
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [toast, setToast] = useState("");

  if (!biz) return <div className="max-w-3xl mx-auto px-4 py-16 text-center">Business not found.</div>;
  const rating = avgRating(biz);

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2200); };

  const submitReview = () => {
    if (!reviewText.trim() || !reviewName.trim()) return;
    addReview(biz.id, { id: String(Date.now()), name: reviewName, rating: reviewRating, text: reviewText, date: "2026-08-27" });
    setReviewText(""); setReviewName(""); setReviewRating(5);
    flash("Review submitted — thank you!");
  };

  const submitReport = () => {
    if (!reportReason.trim()) return;
    addReport(biz, reportReason);
    setReportReason(""); setReportOpen(false);
    flash("Report sent to our admin team.");
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(biz.address)}`;

  return (
    <div className="max-w-3xl mx-auto pb-16">
      <div className="h-40 md:h-56" style={{ background: biz.cover }} />
      <div className="px-4">
        <div className="-mt-10 flex items-end gap-4">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shrink-0" style={{ background: COLORS.card, boxShadow: "0 10px 24px -10px rgba(0,0,0,0.25)" }}>
            {biz.logo}
          </div>
          <button onClick={() => go("home")} className="ml-auto text-xs font-semibold px-3 py-2 rounded-full mb-2 flex items-center gap-1" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}` }}>
            <ArrowLeft size={12} /> Back
          </button>
        </div>

        <div className="mt-3 flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-display font-extrabold text-2xl">{biz.name}</h1>
              {biz.verified && <BadgeCheck size={20} color={COLORS.primary} />}
            </div>
            <p className="text-sm mt-0.5" style={{ color: COLORS.inkSoft }}>{biz.category} · {biz.location}</p>
          </div>
          <button
            onClick={() => { navigator.share ? navigator.share({ title: biz.name, text: biz.description }).catch(() => {}) : flash("Link copied to clipboard"); }}
            className="p-2.5 rounded-full shrink-0" style={{ background: COLORS.surface }}
          >
            <Share2 size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <Stars value={rating} />
          <span className="text-sm font-semibold">{rating ? rating.toFixed(1) : "No ratings yet"}</span>
          <span className="text-xs" style={{ color: COLORS.inkSoft }}>({biz.reviews.length} review{biz.reviews.length !== 1 ? "s" : ""})</span>
        </div>

        {/* action buttons */}
        <div className="grid grid-cols-3 gap-2 mt-5">
          <a href={`tel:${biz.phone}`} className="flex flex-col items-center gap-1 py-3 rounded-xl text-xs font-semibold" style={{ background: COLORS.primaryTint, color: COLORS.primaryDark }}>
            <Phone size={18} /> Call
          </a>
          <a href={`https://wa.me/${biz.whatsapp}`} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 py-3 rounded-xl text-xs font-semibold" style={{ background: "#E6F7EC", color: "#128C4A" }}>
            <MessageCircle size={18} /> WhatsApp
          </a>
          <a href={mapsUrl} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 py-3 rounded-xl text-xs font-semibold" style={{ background: COLORS.amberTint, color: "#9A6A0F" }}>
            <Navigation size={18} /> Directions
          </a>
        </div>

        <Section title="About">
          <p className="text-sm leading-relaxed" style={{ color: COLORS.inkSoft }}>{biz.description}</p>
        </Section>

        <Section title="Address">
          <p className="text-sm flex items-start gap-2" style={{ color: COLORS.inkSoft }}><MapPin size={15} className="mt-0.5 shrink-0" />{biz.address}</p>
        </Section>

        <Section title="Opening hours">
          <p className="text-sm flex items-start gap-2" style={{ color: COLORS.inkSoft }}><Clock size={15} className="mt-0.5 shrink-0" />{biz.hours}</p>
        </Section>

        <Section title="Location">
          <div className="rounded-xl h-36 flex items-center justify-center text-sm gap-2" style={{ background: COLORS.surface, color: COLORS.inkSoft, border: `1px solid ${COLORS.line}` }}>
            <MapPin size={16} /> Map preview loads with a Google Maps API key
          </div>
        </Section>

        <Section title={`Reviews (${biz.reviews.length})`}>
          <div className="flex flex-col gap-3 mb-5">
            {biz.reviews.length === 0 && <p className="text-sm" style={{ color: COLORS.inkSoft }}>No reviews yet — be the first to share your experience.</p>}
            {biz.reviews.map((r) => (
              <div key={r.id} className="p-3 rounded-xl" style={{ background: COLORS.surface }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{r.name}</span>
                  <Stars value={r.rating} size={12} />
                </div>
                <p className="text-sm mt-1" style={{ color: COLORS.inkSoft }}>{r.text}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}` }}>
            <p className="text-sm font-semibold mb-2">Leave a review</p>
            <input value={reviewName} onChange={(e) => setReviewName(e.target.value)} placeholder="Your name" className="w-full text-sm px-3 py-2 rounded-lg mb-2 outline-none" style={{ background: COLORS.surface }} />
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setReviewRating(n)}>
                  <Star size={20} fill={n <= reviewRating ? COLORS.amber : "none"} stroke={n <= reviewRating ? COLORS.amber : COLORS.line} />
                </button>
              ))}
            </div>
            <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Share your experience…" rows={3} className="w-full text-sm px-3 py-2 rounded-lg outline-none resize-none" style={{ background: COLORS.surface }} />
            <button onClick={submitReview} className="mt-2 px-4 py-2 rounded-lg text-sm font-bold text-white" style={{ background: COLORS.primary }}>Submit review</button>
          </div>
        </Section>

        <button onClick={() => setReportOpen(true)} className="mt-6 flex items-center gap-1.5 text-xs font-semibold" style={{ color: COLORS.danger }}>
          <Flag size={13} /> Report incorrect listing
        </button>
      </div>

      {reportOpen && (
        <Modal onClose={() => setReportOpen(false)} title="Report this listing">
          <p className="text-sm mb-3" style={{ color: COLORS.inkSoft }}>Let us know what's wrong — our admin team will review it.</p>
          <textarea value={reportReason} onChange={(e) => setReportReason(e.target.value)} rows={3} placeholder="e.g. Wrong phone number, business closed…" className="w-full text-sm px-3 py-2 rounded-lg outline-none resize-none mb-3" style={{ background: COLORS.surface }} />
          <button onClick={submitReport} className="px-4 py-2 rounded-lg text-sm font-bold text-white" style={{ background: COLORS.danger }}>Send report</button>
        </Modal>
      )}

      {toast && <Toast text={toast} />}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mt-6 pt-6" style={{ borderTop: `1px solid ${COLORS.line}` }}>
      <h3 className="font-display font-bold text-sm mb-2">{title}</h3>
      {children}
    </div>
  );
}

function Toast({ text }) {
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-full text-sm font-semibold text-white z-50" style={{ background: COLORS.ink }}>
      {text}
    </div>
  );
}

/* =============================== OWNER PORTAL =============================== */
function OwnerAuth({ go, setOwnerSession, users }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const submit = () => {
    if (!email.trim()) return;
    const existing = users.find((u) => u.email === email && u.role === "owner");
    setOwnerSession({ id: existing?.id || "owner-" + Date.now(), name: existing?.name || name || "New Owner", email });
    go("owner-dashboard");
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: COLORS.primaryTint }}>
        <Building2 size={22} color={COLORS.primary} />
      </div>
      <h1 className="font-display font-bold text-2xl mb-1">{mode === "login" ? "Business owner login" : "Register your business account"}</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.inkSoft }}>List and manage your businesses on MABO MAP.</p>

      <div className="flex flex-col gap-3">
        {mode === "register" && (
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}` }} />
        )}
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}` }} />
        <input type="password" placeholder="Password" className="px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}` }} />
        <button onClick={submit} className="px-4 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: COLORS.primary }}>
          {mode === "login" ? "Log in" : "Create account"}
        </button>
      </div>

      <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="text-xs font-semibold mt-4" style={{ color: COLORS.primary }}>
        {mode === "login" ? "New business owner? Register" : "Already have an account? Log in"}
      </button>
      <p className="text-xs mt-6" style={{ color: COLORS.inkSoft }}>Demo mode: any email logs you into a sample owner account — Supabase Auth would handle real sign-in.</p>
    </div>
  );
}

function OwnerDashboard({ ownerSession, businesses, go, setOwnerSession }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl">Welcome, {ownerSession.name}</h1>
          <p className="text-sm" style={{ color: COLORS.inkSoft }}>Manage your business listings</p>
        </div>
        <button onClick={() => { setOwnerSession(null); go("home"); }} className="text-xs font-semibold flex items-center gap-1 px-3 py-2 rounded-full" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}` }}>
          <LogOut size={13} /> Log out
        </button>
      </div>

      <button onClick={() => go("owner-add")} className="mb-6 px-4 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-2" style={{ background: COLORS.primary }}>
        <Plus size={16} /> Add a new business
      </button>

      {businesses.length === 0 ? (
        <EmptyState icon={<Building2 size={26} color={COLORS.inkSoft} />} title="No businesses yet" body="Add your first business to get it discovered by people nearby." />
      ) : (
        <div className="flex flex-col gap-3">
          {businesses.map((b) => (
            <div key={b.id} className="p-4 rounded-2xl flex items-center gap-4" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}` }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: COLORS.surface }}>{b.logo}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display font-bold text-sm">{b.name}</h3>
                  <StatusPill status={b.status} />
                </div>
                <p className="text-xs mt-0.5" style={{ color: COLORS.inkSoft }}>{b.category} · {b.location}</p>
                {b.status === "rejected" && b.rejectionReason && (
                  <p className="text-xs mt-1" style={{ color: COLORS.danger }}>{b.rejectionReason}</p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => go("owner-edit", { id: b.id })} className="p-2 rounded-lg" style={{ background: COLORS.surface }}><Pencil size={14} /></button>
                <button onClick={() => go("business", { id: b.id })} className="p-2 rounded-lg" style={{ background: COLORS.surface }}><ChevronRight size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BusinessForm({ mode, initial, onSubmit, go }) {
  const [form, setForm] = useState(initial || {
    name: "", category: CATEGORIES[0], location: LOCATIONS[0], address: "",
    phone: "", whatsapp: "", description: "", hours: "", pinned: false,
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const valid = form.name && form.address && form.phone && form.description;

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <button onClick={() => go("owner-dashboard")} className="text-sm font-semibold flex items-center gap-1 mb-4" style={{ color: COLORS.inkSoft }}>
        <ArrowLeft size={14} /> Back to dashboard
      </button>
      <h1 className="font-display font-bold text-2xl mb-1">{mode === "add" ? "Add a new business" : "Edit business"}</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.inkSoft }}>Submissions are reviewed by an admin before going live.</p>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0" style={{ background: COLORS.surface, border: `1px dashed ${COLORS.line}` }}>
            <Camera size={20} color={COLORS.inkSoft} />
          </div>
          <div>
            <p className="text-sm font-semibold">Logo & photos</p>
            <p className="text-xs" style={{ color: COLORS.inkSoft }}>Upload wiring connects to Supabase Storage in production.</p>
          </div>
        </div>

        <Field label="Business name"><input value={form.name} onChange={(e) => set("name", e.target.value)} className="ip" style={ipStyle} /></Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Category">
            <select value={form.category} onChange={(e) => set("category", e.target.value)} style={ipStyle}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Location">
            <select value={form.location} onChange={(e) => set("location", e.target.value)} style={ipStyle}>
              {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Description"><textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} style={{ ...ipStyle, resize: "none" }} /></Field>
        <Field label="Address"><input value={form.address} onChange={(e) => set("address", e.target.value)} style={ipStyle} /></Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Phone number"><input value={form.phone} onChange={(e) => set("phone", e.target.value)} style={ipStyle} /></Field>
          <Field label="WhatsApp number"><input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} style={ipStyle} /></Field>
        </div>

        <Field label="Opening hours"><input value={form.hours} onChange={(e) => set("hours", e.target.value)} placeholder="e.g. Mon–Sat: 8AM–6PM" style={ipStyle} /></Field>

        <Field label="Pin location on map">
          <button
            onClick={() => set("pinned", !form.pinned)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold"
            style={{ background: form.pinned ? COLORS.primaryTint : COLORS.surface, color: form.pinned ? COLORS.primaryDark : COLORS.inkSoft, border: `1px solid ${COLORS.line}` }}
          >
            <MapPin size={16} /> {form.pinned ? "Location pinned ✓" : "Tap to pin on Google Maps"}
          </button>
        </Field>

        <button
          disabled={!valid}
          onClick={() => onSubmit(form)}
          className="px-4 py-3 rounded-xl text-sm font-bold text-white mt-2 disabled:opacity-40"
          style={{ background: COLORS.primary }}
        >
          Submit for admin approval
        </button>
      </div>
    </div>
  );
}
const ipStyle = { background: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: "10px 12px", fontSize: 14, width: "100%", outline: "none" };
function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold" style={{ color: COLORS.inkSoft }}>{label}</span>
      {children}
    </label>
  );
}

/* =============================== ADMIN =============================== */
function AdminAuth({ go, setAdminSession }) {
  const [pass, setPass] = useState("");
  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "#2C332C" }}>
        <ShieldCheck size={22} color={COLORS.amber} />
      </div>
      <h1 className="font-display font-bold text-2xl mb-1">Admin login</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.inkSoft }}>Restricted access for MABO MAP administrators.</p>
      <div className="flex flex-col gap-3">
        <input placeholder="Admin email" className="px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}` }} />
        <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="Password" className="px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}` }} />
        <button onClick={() => { setAdminSession(true); go("admin-dashboard"); }} className="px-4 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: COLORS.ink }}>
          Log in
        </button>
      </div>
      <p className="text-xs mt-6" style={{ color: COLORS.inkSoft }}>Demo mode: any credentials work. Real admin auth would use Supabase role-based access.</p>
    </div>
  );
}

function AdminDashboard({ stats, businesses, reports, users, updateBusiness, deleteBusiness, go, setAdminSession }) {
  const [tab, setTab] = useState("pending");
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const tabs = [
    { key: "pending", label: "Pending", icon: <Clock size={14} /> },
    { key: "all", label: "All businesses", icon: <ListChecks size={14} /> },
    { key: "categories", label: "Categories", icon: <LayoutDashboard size={14} /> },
    { key: "users", label: "Users", icon: <Users size={14} /> },
    { key: "reports", label: "Reports", icon: <AlertTriangle size={14} /> },
  ];

  const pending = businesses.filter((b) => b.status === "pending");

  const StatCard = ({ label, value, icon }) => (
    <div className="p-4 rounded-2xl flex items-center gap-3" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}` }}>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: COLORS.primaryTint }}>{icon}</div>
      <div>
        <div className="font-display font-extrabold text-lg leading-none">{value}</div>
        <div className="text-xs mt-0.5" style={{ color: COLORS.inkSoft }}>{label}</div>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl">Admin Dashboard</h1>
          <p className="text-sm" style={{ color: COLORS.inkSoft }}>Niger State · MABO MAP</p>
        </div>
        <button onClick={() => { setAdminSession(false); go("home"); }} className="text-xs font-semibold flex items-center gap-1 px-3 py-2 rounded-full" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}` }}>
          <LogOut size={13} /> Log out
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        <StatCard label="Total businesses" value={stats.total} icon={<Building2 size={16} color={COLORS.primaryDark} />} />
        <StatCard label="Pending approvals" value={stats.pending} icon={<Clock size={16} color={COLORS.primaryDark} />} />
        <StatCard label="Approved" value={stats.approved} icon={<Check size={16} color={COLORS.primaryDark} />} />
        <StatCard label="Registered users" value={stats.users} icon={<Users size={16} color={COLORS.primaryDark} />} />
        <StatCard label="Total searches" value={stats.searches} icon={<TrendingUp size={16} color={COLORS.primaryDark} />} />
      </div>

      <div className="flex gap-1 mb-5 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap" style={{ background: tab === t.key ? COLORS.ink : COLORS.card, color: tab === t.key ? "white" : COLORS.inkSoft, border: `1px solid ${COLORS.line}` }}>
            {t.icon} {t.label} {t.key === "pending" && pending.length > 0 && <span className="ml-0.5 px-1.5 rounded-full text-[10px]" style={{ background: COLORS.amber, color: "#5C3D0A" }}>{pending.length}</span>}
          </button>
        ))}
      </div>

      {tab === "pending" && (
        <div className="flex flex-col gap-3">
          {pending.length === 0 && <EmptyState icon={<Check size={24} color={COLORS.primary} />} title="All caught up" body="No pending listings right now." />}
          {pending.map((b) => (
            <div key={b.id} className="p-4 rounded-2xl" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}` }}>
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ background: COLORS.surface }}>{b.logo}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-sm">{b.name}</h3>
                  <p className="text-xs mt-0.5" style={{ color: COLORS.inkSoft }}>{b.category} · {b.location}</p>
                  <p className="text-xs mt-1.5 line-clamp-2" style={{ color: COLORS.inkSoft }}>{b.description}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => updateBusiness(b.id, { status: "approved", verified: true })} className="flex-1 py-2 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-1" style={{ background: COLORS.primary }}>
                  <Check size={13} /> Approve
                </button>
                <button onClick={() => setRejectTarget(b.id)} className="flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1" style={{ background: "#FBEAE6", color: COLORS.danger }}>
                  <X size={13} /> Reject
                </button>
                <button onClick={() => go("business", { id: b.id })} className="px-3 py-2 rounded-lg text-xs font-semibold" style={{ background: COLORS.surface }}>View</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "all" && (
        <div className="flex flex-col gap-2">
          {businesses.map((b) => (
            <div key={b.id} className="p-3.5 rounded-xl flex items-center gap-3" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}` }}>
              <span className="text-lg">{b.logo}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm">{b.name}</span>
                  <StatusPill status={b.status} />
                </div>
                <p className="text-xs" style={{ color: COLORS.inkSoft }}>{b.category} · {b.location}</p>
              </div>
              <button onClick={() => go("business", { id: b.id })} className="p-2 rounded-lg" style={{ background: COLORS.surface }}><ChevronRight size={14} /></button>
              <button onClick={() => deleteBusiness(b.id)} className="p-2 rounded-lg" style={{ background: "#FBEAE6" }}><Trash2 size={14} color={COLORS.danger} /></button>
            </div>
          ))}
        </div>
      )}

      {tab === "categories" && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {CATEGORIES.map((c) => (
            <div key={c} className="p-3 rounded-xl flex items-center gap-2" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}` }}>
              <span>{CAT_ICON(c)}</span>
              <span className="text-xs font-semibold flex-1">{c}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: COLORS.primaryTint, color: COLORS.primaryDark }}>
                {businesses.filter((b) => b.category === c && b.status === "approved").length}
              </span>
            </div>
          ))}
        </div>
      )}

      {tab === "users" && (
        <div className="flex flex-col gap-2">
          {users.map((u) => (
            <div key={u.id} className="p-3.5 rounded-xl flex items-center gap-3" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}` }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: COLORS.primary }}>{u.name[0]}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{u.name}</p>
                <p className="text-xs" style={{ color: COLORS.inkSoft }}>{u.email}</p>
              </div>
              <span className="text-[10px] font-semibold px-2 py-1 rounded-full capitalize" style={{ background: COLORS.surface, color: COLORS.inkSoft }}>{u.role}</span>
            </div>
          ))}
        </div>
      )}

      {tab === "reports" && (
        <div className="flex flex-col gap-2">
          {reports.length === 0 && <EmptyState icon={<AlertTriangle size={24} color={COLORS.inkSoft} />} title="No reports" body="Reported listings will show up here." />}
          {reports.map((r) => (
            <div key={r.id} className="p-3.5 rounded-xl" style={{ background: COLORS.card, border: `1px solid ${COLORS.line}` }}>
              <p className="text-sm font-semibold">{r.businessName}</p>
              <p className="text-xs mt-0.5" style={{ color: COLORS.inkSoft }}>{r.reason}</p>
              <p className="text-[10px] mt-1" style={{ color: COLORS.inkSoft }}>{r.date}</p>
            </div>
          ))}
        </div>
      )}

      {rejectTarget && (
        <Modal onClose={() => setRejectTarget(null)} title="Reject listing">
          <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={3} placeholder="Reason for rejection (shown to the owner)…" className="w-full text-sm px-3 py-2 rounded-lg outline-none resize-none mb-3" style={{ background: COLORS.surface }} />
          <button
            onClick={() => { updateBusiness(rejectTarget, { status: "rejected", rejectionReason: rejectReason || "Listing did not meet our guidelines." }); setRejectTarget(null); setRejectReason(""); }}
            className="px-4 py-2 rounded-lg text-sm font-bold text-white" style={{ background: COLORS.danger }}
          >
            Confirm rejection
          </button>
        </Modal>
      )}
    </div>
  );
}
