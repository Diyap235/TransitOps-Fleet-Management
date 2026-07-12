import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck, Menu, X, Sun, Moon, ArrowRight, Play,
  MapPin, Fuel, Wrench, BarChart3, Brain, Bell,
  Shield, Zap, TrendingUp, Users, Route, CheckCircle,
  Star, ChevronRight, Globe, Clock, Activity,
  Navigation, Package, DollarSign, AlertTriangle,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/* ── Intersection-observer hook for scroll animations ── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ── Animated counter ── */
function Counter({ target, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView(0.3);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ══════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════ */
function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = ['Home', 'Features', 'Dashboard', 'Analytics', 'About', 'Contact'];

  const scrollTo = (id) => {
    setOpen(false);
    const el = document.getElementById(id.toLowerCase());
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`lp-nav${scrolled ? ' lp-nav--scrolled' : ''}`}>
      <div className="lp-nav-inner">
        <a href="#home" className="lp-nav-logo" onClick={() => scrollTo('home')}>
          <div className="lp-nav-logo-icon">
            <Truck size={18} strokeWidth={2.5} />
          </div>
          <span>Transit<strong>Ops</strong></span>
        </a>

        <ul className="lp-nav-links">
          {links.map((l) => (
            <li key={l}>
              <button className="lp-nav-link" onClick={() => scrollTo(l)}>
                {l}
              </button>
            </li>
          ))}
        </ul>

        <div className="lp-nav-actions">
          <button className="lp-theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
            <span className="lp-theme-track">
              <span className={`lp-theme-thumb${theme === 'dark' ? ' dark' : ''}`}>
                {theme === 'dark' ? <Moon size={12} /> : <Sun size={12} />}
              </span>
            </span>
          </button>
          <Link to="/login" className="lp-btn-ghost">Login</Link>
          <Link to="/login" className="lp-btn-primary">
            Get Started <ArrowRight size={14} />
          </Link>
        </div>

        <button className="lp-hamburger" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lp-mobile-menu">
          {links.map((l) => (
            <button key={l} className="lp-mobile-link" onClick={() => scrollTo(l)}>{l}</button>
          ))}
          <div className="lp-mobile-actions">
            <Link to="/login" className="lp-btn-ghost" onClick={() => setOpen(false)}>Login</Link>
            <Link to="/login" className="lp-btn-primary" onClick={() => setOpen(false)}>Get Started</Link>
            <button className="lp-theme-btn" onClick={toggleTheme}>
              {theme === 'dark' ? <><Moon size={14} /> Dark</> : <><Sun size={14} /> Light</>}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ══════════════════════════════════════════
   HERO
══════════════════════════════════════════ */
function Hero() {
  const [ref, inView] = useInView(0.1);
  return (
    <section id="home" className="lp-hero">
      <div className="lp-hero-glow" />
      <div className="lp-hero-glow lp-hero-glow--2" />
      <div className={`lp-container lp-hero-inner${inView ? ' lp-anim-in' : ''}`} ref={ref}>
        {/* Left */}
        <div className="lp-hero-left">
          <div className="lp-badge">
            <span className="lp-badge-dot" />
            AI-Powered Fleet Management Platform
          </div>
          <h1 className="lp-hero-title">
            Smart Fleet Operations<br />
            <span className="lp-gradient-text">Powered by AI</span>
          </h1>
          <p className="lp-hero-sub">
            Manage vehicles, optimize routes, monitor drivers, reduce fuel costs and
            improve transportation efficiency from one intelligent platform.
          </p>
          <div className="lp-hero-cta">
            <Link to="/login" className="lp-btn-primary lp-btn-lg">
              Get Started <ArrowRight size={16} />
            </Link>
            <button className="lp-btn-play">
              <span className="lp-play-icon"><Play size={14} fill="currentColor" /></span>
              Watch Demo
            </button>
          </div>
          <div className="lp-hero-trust">
            <span>Trusted by</span>
            {['DHL Logistics', 'FedEx Fleet', 'BlueDart'].map((c) => (
              <span key={c} className="lp-trust-tag">{c}</span>
            ))}
          </div>
        </div>

        {/* Right — Dashboard mockup */}
        <div className="lp-hero-right">
          <div className="lp-dash-mockup">
            <div className="lp-dash-topbar">
              <span className="lp-dash-dot red" /><span className="lp-dash-dot yellow" /><span className="lp-dash-dot green" />
              <span className="lp-dash-url">transitops.app/dashboard</span>
            </div>
            <div className="lp-dash-body">
              <div className="lp-dash-sidebar">
                {['Dashboard', 'Vehicles', 'Drivers', 'Trips', 'Reports'].map((item, i) => (
                  <div key={item} className={`lp-dash-nav-item${i === 0 ? ' active' : ''}`}>
                    <span className="lp-dash-nav-dot" />{item}
                  </div>
                ))}
              </div>
              <div className="lp-dash-main">
                <div className="lp-dash-stats">
                  {[
                    { label: 'Active Vehicles', val: '142', color: '#2563EB' },
                    { label: 'Drivers Online', val: '89', color: '#06B6D4' },
                    { label: 'Trips Today', val: '34', color: '#10B981' },
                    { label: 'Fuel Saved', val: '18%', color: '#F59E0B' },
                  ].map(({ label, val, color }) => (
                    <div key={label} className="lp-dash-stat">
                      <div className="lp-dash-stat-val" style={{ color }}>{val}</div>
                      <div className="lp-dash-stat-label">{label}</div>
                    </div>
                  ))}
                </div>
                <div className="lp-dash-chart-row">
                  <div className="lp-dash-chart">
                    <div className="lp-dash-chart-title">Trip Activity</div>
                    <div className="lp-dash-bars">
                      {[60, 80, 45, 90, 70, 85, 55].map((h, i) => (
                        <div key={i} className="lp-dash-bar" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                  <div className="lp-dash-map">
                    <div className="lp-dash-chart-title">Live Routes</div>
                    <div className="lp-map-grid">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div key={i} className="lp-map-cell" />
                      ))}
                    </div>
                    <div className="lp-map-pin lp-map-pin--1"><MapPin size={10} /></div>
                    <div className="lp-map-pin lp-map-pin--2"><MapPin size={10} /></div>
                    <div className="lp-route-line" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating stat cards */}
          <div className="lp-float-card lp-float-card--1">
            <Activity size={14} className="lp-float-icon" />
            <div><div className="lp-float-val">99.9%</div><div className="lp-float-label">Uptime</div></div>
          </div>
          <div className="lp-float-card lp-float-card--2">
            <TrendingUp size={14} className="lp-float-icon green" />
            <div><div className="lp-float-val">+24%</div><div className="lp-float-label">Efficiency</div></div>
          </div>
          <div className="lp-float-card lp-float-card--3">
            <Truck size={14} className="lp-float-icon blue" />
            <div><div className="lp-float-val">1,000+</div><div className="lp-float-label">Vehicles</div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   FEATURES
══════════════════════════════════════════ */
const FEATURES = [
  { Icon: Truck,       title: 'Fleet Management',     desc: 'Real-time tracking of every vehicle. Monitor status, location, and health from a unified command center.', grad: '#2563EB,#3B82F6' },
  { Icon: Users,       title: 'Driver Management',    desc: 'Safety scores, license tracking, trip assignment and driver performance analytics in one place.', grad: '#0891B2,#06B6D4' },
  { Icon: Route,       title: 'Trip Scheduling',      desc: 'Intelligent dispatch with AI-optimized routes. Assign vehicles and drivers with a single click.', grad: '#7C3AED,#A78BFA' },
  { Icon: Navigation,  title: 'Live GPS Tracking',    desc: 'Sub-second position updates with geofencing alerts, ETA predictions and route deviation warnings.', grad: '#059669,#10B981' },
  { Icon: Fuel,        title: 'Fuel Monitoring',      desc: 'Track consumption per vehicle, detect anomalies and cut fuel spend by up to 25% with AI recommendations.', grad: '#D97706,#F59E0B' },
  { Icon: Wrench,      title: 'Vehicle Maintenance',  desc: 'Predictive maintenance schedules, service history and cost tracking to prevent costly breakdowns.', grad: '#DC2626,#F87171' },
  { Icon: BarChart3,   title: 'Analytics Dashboard',  desc: 'Executive-level reports on operations, costs, driver performance and fleet utilization at a glance.', grad: '#2563EB,#06B6D4' },
  { Icon: Brain,       title: 'AI Insights',          desc: 'Machine learning models surface anomalies, forecast maintenance needs and recommend route improvements.', grad: '#7C3AED,#06B6D4' },
];

function Features() {
  const [ref, inView] = useInView(0.1);
  return (
    <section id="features" className="lp-section">
      <div className="lp-container">
        <div className={`lp-section-head${inView ? ' lp-anim-in' : ''}`} ref={ref}>
          <div className="lp-eyebrow">Platform Features</div>
          <h2 className="lp-section-title">Everything your fleet team needs</h2>
          <p className="lp-section-sub">
            One platform to replace five tools. Built for logistics companies that can't afford downtime.
          </p>
        </div>
        <div className="lp-features-grid">
          {FEATURES.map(({ Icon, title, desc, grad }, i) => (
            <FeatureCard key={title} Icon={Icon} title={title} desc={desc} grad={grad} delay={i * 60} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ Icon, title, desc, grad, delay }) {
  const [ref, inView] = useInView(0.1);
  const [hovered, setHovered] = useState(false);
  return (
    <div
      ref={ref}
      className={`lp-feat-card${inView ? ' lp-anim-in' : ''}${hovered ? ' hovered' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="lp-feat-border" style={{ background: `linear-gradient(135deg, ${grad})` }} />
      <div className="lp-feat-icon-wrap" style={{ background: `linear-gradient(135deg, ${grad})` }}>
        <Icon size={20} strokeWidth={1.8} />
      </div>
      <h3 className="lp-feat-title">{title}</h3>
      <p className="lp-feat-desc">{desc}</p>
      <div className="lp-feat-arrow">
        <ChevronRight size={16} />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   DASHBOARD PREVIEW
══════════════════════════════════════════ */
function DashboardPreview() {
  const [ref, inView] = useInView(0.1);
  return (
    <section id="dashboard" className="lp-section lp-section--alt">
      <div className="lp-container">
        <div className={`lp-section-head${inView ? ' lp-anim-in' : ''}`} ref={ref}>
          <div className="lp-eyebrow">Live Dashboard</div>
          <h2 className="lp-section-title">Command your entire fleet</h2>
          <p className="lp-section-sub">
            Real-time operational data, route maps, driver metrics and cost analytics — all on one screen.
          </p>
        </div>

        <div className="lp-preview-wrap">
          {/* KPI cards row */}
          <div className="lp-preview-kpis">
            {[
              { Icon: Truck,         label: 'Active Vehicles',     val: '142',    color: '#2563EB', bg: '#2563EB22' },
              { Icon: Users,         label: 'Drivers Online',       val: '89',     color: '#06B6D4', bg: '#06B6D422' },
              { Icon: Route,         label: 'Trips Today',          val: '34',     color: '#10B981', bg: '#10B98122' },
              { Icon: Fuel,          label: 'Fuel Usage (L)',        val: '2,140',  color: '#F59E0B', bg: '#F59E0B22' },
              { Icon: AlertTriangle, label: 'Maintenance Alerts',   val: '7',      color: '#EF4444', bg: '#EF444422' },
              { Icon: DollarSign,    label: 'Revenue Today',        val: '$18.4K', color: '#8B5CF6', bg: '#8B5CF622' },
            ].map(({ Icon, label, val, color, bg }) => (
              <div key={label} className="lp-kpi-card">
                <div className="lp-kpi-icon" style={{ background: bg, color }}>
                  <Icon size={18} strokeWidth={1.8} />
                </div>
                <div className="lp-kpi-val" style={{ color }}>{val}</div>
                <div className="lp-kpi-label">{label}</div>
              </div>
            ))}
          </div>

          {/* Chart + Table row */}
          <div className="lp-preview-grid">
            {/* Bar chart */}
            <div className="lp-preview-card">
              <div className="lp-preview-card-head">
                <span className="lp-preview-card-title">Weekly Trip Volume</span>
                <span className="lp-preview-badge green">+12.4%</span>
              </div>
              <div className="lp-chart-area">
                {[
                  { day: 'Mon', h: 65 }, { day: 'Tue', h: 82 }, { day: 'Wed', h: 58 },
                  { day: 'Thu', h: 91 }, { day: 'Fri', h: 74 }, { day: 'Sat', h: 48 }, { day: 'Sun', h: 37 },
                ].map(({ day, h }) => (
                  <div key={day} className="lp-chart-col">
                    <div className="lp-chart-bar" style={{ height: `${h}%` }} />
                    <span className="lp-chart-label">{day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map preview */}
            <div className="lp-preview-card">
              <div className="lp-preview-card-head">
                <span className="lp-preview-card-title">Live Route Map</span>
                <span className="lp-preview-badge blue">Live</span>
              </div>
              <div className="lp-map-preview">
                <div className="lp-map-bg">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} className="lp-map-tile" />
                  ))}
                </div>
                <div className="lp-map-vehicle lp-map-vehicle--1"><Truck size={12} /></div>
                <div className="lp-map-vehicle lp-map-vehicle--2"><Truck size={12} /></div>
                <div className="lp-map-vehicle lp-map-vehicle--3"><Truck size={12} /></div>
                <div className="lp-route lp-route--1" />
                <div className="lp-route lp-route--2" />
              </div>
            </div>

            {/* Recent trips table */}
            <div className="lp-preview-card lp-preview-card--wide">
              <div className="lp-preview-card-head">
                <span className="lp-preview-card-title">Recent Trips</span>
                <button className="lp-preview-link">View all <ChevronRight size={13} /></button>
              </div>
              <table className="lp-preview-table">
                <thead>
                  <tr>
                    <th>Route</th><th>Driver</th><th>Vehicle</th><th>Status</th><th>Distance</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { route: 'Mumbai → Pune',     driver: 'Rajesh K.',  vehicle: 'MH12 AB 1234', status: 'Completed', dist: '148 km', sc: 'green' },
                    { route: 'Delhi → Agra',      driver: 'Arjun S.',   vehicle: 'DL4C 9987',    status: 'On Route',  dist: '204 km', sc: 'blue'  },
                    { route: 'Chennai → Bengaluru',driver: 'Vikram P.', vehicle: 'TN09 XZ 4421', status: 'On Route',  dist: '346 km', sc: 'blue'  },
                    { route: 'Hyderabad → Nagpur',driver: 'Suresh M.',  vehicle: 'TS07 EF 2210', status: 'Dispatched',dist: '512 km', sc: 'orange'},
                  ].map(({ route, driver, vehicle, status, dist, sc }) => (
                    <tr key={route}>
                      <td className="lp-td-primary">{route}</td>
                      <td>{driver}</td>
                      <td>{vehicle}</td>
                      <td><span className={`lp-status-badge ${sc}`}>{status}</span></td>
                      <td>{dist}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   WHY CHOOSE US
══════════════════════════════════════════ */
const WHY = [
  { Icon: Brain,        title: 'AI Route Optimization',    desc: 'Reduce empty miles by up to 30% with ML-powered route planning that adapts to traffic, load, and driver availability in real time.' },
  { Icon: Activity,     title: 'Real-time Monitoring',     desc: '360° visibility into your fleet. Live telemetry, engine diagnostics, speed alerts and geo-fence violations — all streamed to your dashboard.' },
  { Icon: Wrench,       title: 'Predictive Maintenance',   desc: 'AI analyzes vehicle sensor data to predict component failures before they happen, cutting unplanned downtime by over 40%.' },
  { Icon: Fuel,         title: 'Fuel Analytics',           desc: 'Granular fuel consumption reports per driver, route, and vehicle. Identify waste, prevent theft, and cut fuel costs by up to 25%.' },
  { Icon: Bell,         title: 'Live Notifications',       desc: 'Instant alerts for SLA breaches, driver behaviour, maintenance windows, and route deviations — on web, mobile or email.' },
  { Icon: Shield,       title: 'Enterprise Security',      desc: 'SOC2 compliant, end-to-end encrypted, with role-based access control and full audit trails to meet enterprise security standards.' },
];

function WhyUs() {
  const [ref, inView] = useInView(0.1);
  return (
    <section id="about" className="lp-section">
      <div className="lp-container">
        <div className={`lp-section-head${inView ? ' lp-anim-in' : ''}`} ref={ref}>
          <div className="lp-eyebrow">Why TransitOps</div>
          <h2 className="lp-section-title">Built for enterprise logistics</h2>
          <p className="lp-section-sub">
            Every feature was designed around the real challenges fleet managers face daily.
          </p>
        </div>

        <div className="lp-why-grid">
          {WHY.map(({ Icon, title, desc }, i) => (
            <WhyCard key={title} Icon={Icon} title={title} desc={desc} step={i + 1} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyCard({ Icon, title, desc, step, delay }) {
  const [ref, inView] = useInView(0.1);
  return (
    <div
      ref={ref}
      className={`lp-why-card${inView ? ' lp-anim-in' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="lp-why-step">{String(step).padStart(2, '0')}</div>
      <div className="lp-why-icon"><Icon size={22} strokeWidth={1.8} /></div>
      <h3 className="lp-why-title">{title}</h3>
      <p className="lp-why-desc">{desc}</p>
    </div>
  );
}

/* ══════════════════════════════════════════
   STATISTICS
══════════════════════════════════════════ */
const STATS = [
  { target: 1000, suffix: '+', label: 'Vehicles Managed',   Icon: Truck        },
  { target: 99,   suffix: '.9%',label: 'System Uptime',     Icon: Activity     },
  { target: 50,   suffix: '+', label: 'Companies',           Icon: Globe        },
  { target: 1,    suffix: 'M+', label: 'Trips Managed',     Icon: Route        },
];

function Statistics() {
  const [ref, inView] = useInView(0.2);
  return (
    <section className="lp-stats-section">
      <div className="lp-stats-glow" />
      <div className="lp-container">
        <div className={`lp-stats-inner${inView ? ' lp-anim-in' : ''}`} ref={ref}>
          <div className="lp-stats-text">
            <div className="lp-eyebrow lp-eyebrow--light">By the numbers</div>
            <h2 className="lp-stats-title">Powering fleets at scale</h2>
            <p className="lp-stats-sub">
              Industry-leading reliability and performance for logistics operations of every size.
            </p>
            <Link to="/login" className="lp-btn-primary lp-btn-lg" style={{ marginTop: 24, display: 'inline-flex' }}>
              Start free trial <ArrowRight size={16} />
            </Link>
          </div>
          <div className="lp-stats-grid">
            {STATS.map(({ target, suffix, label, Icon }) => (
              <div key={label} className="lp-stat-item">
                <div className="lp-stat-icon"><Icon size={20} strokeWidth={1.8} /></div>
                <div className="lp-stat-num">
                  <Counter target={target} suffix={suffix} />
                </div>
                <div className="lp-stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   TESTIMONIALS
══════════════════════════════════════════ */
const TESTIMONIALS = [
  {
    name: 'Ankit Sharma',
    role: 'Head of Logistics, BlueDart Express',
    avatar: 'AS',
    stars: 5,
    quote: 'TransitOps cut our fuel costs by 22% in the first quarter. The AI route optimization alone paid for the entire platform. We now manage 400 vehicles from a single screen.',
  },
  {
    name: 'Priya Menon',
    role: 'Fleet Director, Mahindra Logistics',
    avatar: 'PM',
    stars: 5,
    quote: 'The predictive maintenance module flagged a critical engine issue before it became a breakdown. Saved us a ₹4 lakh repair bill. The ROI was immediate and measurable.',
  },
  {
    name: 'Rahul Verma',
    role: 'VP Operations, DTDC Courier',
    avatar: 'RV',
    stars: 5,
    quote: 'We evaluated six platforms. TransitOps was the only one with real-time GPS accuracy under 2 seconds and driver safety scoring out of the box. Implementation took 3 days.',
  },
  {
    name: 'Sunita Rao',
    role: 'COO, Gati KWE',
    avatar: 'SR',
    stars: 5,
    quote: "The analytics dashboard gives our leadership team the KPIs they need in real time. Driver compliance went from 67% to 94% within two months of deploying TransitOps.",
  },
];

function Testimonials() {
  const [ref, inView] = useInView(0.1);
  return (
    <section className="lp-section lp-section--alt">
      <div className="lp-container">
        <div className={`lp-section-head${inView ? ' lp-anim-in' : ''}`} ref={ref}>
          <div className="lp-eyebrow">Customer Stories</div>
          <h2 className="lp-section-title">Trusted by leading logistics companies</h2>
          <p className="lp-section-sub">
            See how fleet managers across India are transforming operations with TransitOps.
          </p>
        </div>
        <div className="lp-testimonials-grid">
          {TESTIMONIALS.map(({ name, role, avatar, stars, quote }, i) => (
            <TestimonialCard key={name} name={name} role={role} avatar={avatar} stars={stars} quote={quote} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ name, role, avatar, stars, quote, delay }) {
  const [ref, inView] = useInView(0.1);
  return (
    <div
      ref={ref}
      className={`lp-testi-card${inView ? ' lp-anim-in' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="lp-testi-stars">
        {Array.from({ length: stars }).map((_, i) => (
          <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
        ))}
      </div>
      <p className="lp-testi-quote">"{quote}"</p>
      <div className="lp-testi-author">
        <div className="lp-testi-avatar">{avatar}</div>
        <div>
          <div className="lp-testi-name">{name}</div>
          <div className="lp-testi-role">{role}</div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   CTA BANNER
══════════════════════════════════════════ */
function CTABanner() {
  const [ref, inView] = useInView(0.2);
  return (
    <section className="lp-cta-section">
      <div className="lp-cta-glow" />
      <div className={`lp-container lp-cta-inner${inView ? ' lp-anim-in' : ''}`} ref={ref}>
        <h2 className="lp-cta-title">Ready to transform your fleet?</h2>
        <p className="lp-cta-sub">Join 50+ companies already running smarter operations with TransitOps.</p>
        <div className="lp-cta-actions">
          <Link to="/login" className="lp-btn-primary lp-btn-lg">
            Start Free Trial <ArrowRight size={16} />
          </Link>
          <a href="mailto:sales@transitops.app" className="lp-btn-ghost-white">
            Talk to Sales
          </a>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   FOOTER
══════════════════════════════════════════ */
function Footer() {
  const cols = [
    {
      heading: 'Company',
      links: ['About Us', 'Careers', 'Press', 'Blog', 'Contact'],
    },
    {
      heading: 'Product',
      links: ['Features', 'Pricing', 'Changelog', 'Roadmap', 'Status'],
    },
    {
      heading: 'Documentation',
      links: ['Getting Started', 'API Reference', 'Integrations', 'Guides', 'SDK'],
    },
    {
      heading: 'Support',
      links: ['Help Center', 'Community', 'Service Status', 'Security', 'Privacy Policy'],
    },
  ];

  return (
    <footer id="contact" className="lp-footer">
      <div className="lp-container">
        <div className="lp-footer-top">
          <div className="lp-footer-brand">
            <div className="lp-nav-logo-icon">
              <Truck size={16} strokeWidth={2.5} />
            </div>
            <span className="lp-footer-logo-text">Transit<strong>Ops</strong></span>
          </div>
          <p className="lp-footer-tagline">
            The intelligent fleet management platform built for modern logistics companies.
          </p>
          <div className="lp-footer-socials">
            {['Twitter', 'LinkedIn', 'GitHub', 'YouTube'].map((s) => (
              <a key={s} href="#" className="lp-social-btn">{s[0]}</a>
            ))}
          </div>
        </div>

        <div className="lp-footer-links">
          {cols.map(({ heading, links }) => (
            <div key={heading} className="lp-footer-col">
              <div className="lp-footer-col-heading">{heading}</div>
              <ul>
                {links.map((l) => (
                  <li key={l}><a href="#" className="lp-footer-link">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="lp-footer-bottom">
          <span>© 2025 TransitOps. All rights reserved.</span>
          <div className="lp-footer-bottom-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════
   ROOT EXPORT
══════════════════════════════════════════ */
export default function Landing() {
  return (
    <div className="lp-root">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <DashboardPreview />
        <WhyUs />
        <Statistics />
        <Testimonials />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
