import { Service, SiteSettings } from '../types';

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-1',
    slug: 'website-development',
    title: 'Website Development',
    short_desc: 'Custom, high-performance business websites and web applications built to scale your company.',
    full_desc: 'From high-converting corporate portals to complex custom web platforms, we engineer responsive, fast, and SEO-optimized websites that turn visitors into loyal paying customers.',
    icon: 'Code2',
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    starting_price: 24999,
    currency: 'INR',
    estimated_timeline: '2 - 4 Weeks',
    features: [
      'Custom Responsive Architecture (Mobile, Tablet, Desktop)',
      'Blazing Fast Performance (<1s Load Times, 95+ PageSpeed)',
      'Technical On-Page SEO & Structured Data Schema',
      'Content Management System (CMS) Integration',
      'SSL Security, Cloudflare CDN & Automated Backups',
      'Contact Forms, CRM Integrations & Analytics Setup'
    ],
    deliverables: [
      'Fully Functional Production-Ready Website',
      'Custom Source Code Repository with Documentation',
      'CMS Admin Dashboard Training Video',
      'Google Analytics 4 & Search Console Setup',
      '30 Days Free Post-Launch Support & Bug Fixes'
    ],
    process: [
      { step: 1, title: 'Discovery & Architecture', desc: 'Understanding your business model, target audience, and site map requirements.' },
      { step: 2, title: 'Wireframing & UI Prototype', desc: 'Crafting pixel-perfect design concepts aligned with your brand.' },
      { step: 3, title: 'Modern Clean Development', desc: 'Building with clean code, fast APIs, and responsive layouts.' },
      { step: 4, title: 'Testing & SEO Audit', desc: 'Cross-browser testing, accessibility review, and Lighthouse speed audits.' },
      { step: 5, title: 'Deployment & Training', desc: 'Domain configuration, live deployment, and handoff walkthrough.' }
    ],
    is_active: true
  },
  {
    id: 'srv-2',
    slug: 'ecommerce-development',
    title: 'E-Commerce Development',
    short_desc: 'High-conversion online stores with seamless carts, secure checkout, and effortless inventory management.',
    full_desc: 'Turn your catalog into a digital sales engine. We develop scalable online shopping platforms with multi-currency support, payment gateways, automated shipping calculation, and streamlined order fulfillment.',
    icon: 'ShoppingBag',
    image_url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80',
    starting_price: 39999,
    currency: 'INR',
    estimated_timeline: '3 - 6 Weeks',
    features: [
      'Product Catalog, Variants (Size/Color), & Inventory Sync',
      'Payment Gateway Integration (Razorpay, Stripe, UPI, Cards)',
      'Automated Cart Abandonment Recovery Flows',
      'Customer Order Tracking & Automated Email/SMS Receipts',
      'Coupon Codes, Tiered Discounts & Promotional Banners',
      'Admin Inventory & Order Management Dashboard'
    ],
    deliverables: [
      'Complete Store Setup & Product Configuration',
      'Secure Payment Gateway & Shipping API Integrations',
      'Admin Training on Orders, Stock & Customer Management',
      'Automated Transactional Emails & Invoices Setup',
      '45 Days Dedicated Launch Support'
    ],
    process: [
      { step: 1, title: 'Store Architecture', desc: 'Planning product taxonomy, payment gateways, tax calculation, and shipping rules.' },
      { step: 2, title: 'E-Commerce UI Design', desc: 'Designing friction-free product pages, filter systems, and quick-buy checkouts.' },
      { step: 3, title: 'Cart & Gateway Integration', desc: 'Connecting secure payments, webhook handlers, and database synchronization.' },
      { step: 4, title: 'Load & Checkout Testing', desc: 'Testing edge-case transactions, refund simulations, and mobile speed.' },
      { step: 5, title: 'Go Live & Launch Promotion', desc: 'Deploying store to production and verifying real transactional readiness.' }
    ],
    is_active: true
  },
  {
    id: 'srv-3',
    slug: 'ui-ux-design',
    title: 'UI/UX Design',
    short_desc: 'Modern, user-centric interfaces and intuitive digital experiences that delight users and boost retention.',
    full_desc: 'We transform complex workflows into intuitive, beautiful, and engaging digital experiences. Using Figma and modern design systems, we craft user journeys that minimize churn and maximize customer satisfaction.',
    icon: 'Palette',
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    starting_price: 19999,
    currency: 'INR',
    estimated_timeline: '2 - 3 Weeks',
    features: [
      'User Persona Modeling & Competitive UX Benchmarking',
      'Interactive Figma Prototypes & User Flow Diagrams',
      'Design System with Colors, Typography, & UI Components',
      'Responsive Breakpoint Wireframes (Desktop, Tablet, Mobile)',
      'Micro-interactions, Hover States & Animation Guidelines',
      'Complete Developer Handoff Specs & Assets'
    ],
    deliverables: [
      'Comprehensive Figma Source File with Auto-Layout Components',
      'Interactive Clickable Prototype for Stakeholders & Investors',
      'UI Kit, Iconography Set, & Design Token Export',
      'UX Research Findings & Usability Recommendations Doc'
    ],
    process: [
      { step: 1, title: 'User Research & Journey Mapping', desc: 'Analyzing customer pain points, competitors, and key user flows.' },
      { step: 2, title: 'Low-Fidelity Wireframes', desc: 'Structuring layout hierarchy, navigation patterns, and content zones.' },
      { step: 3, title: 'High-Fidelity Visual Design', desc: 'Applying color harmony, typography, elevation, and polished styling.' },
      { step: 4, title: 'Interactive Prototype & Review', desc: 'Simulating the live feel with clickable transitions and micro-animations.' },
      { step: 5, title: 'Developer Handoff', desc: 'Exporting CSS tokens, assets, and styling documentation for build teams.' }
    ],
    is_active: true
  },
  {
    id: 'srv-4',
    slug: 'website-redesign',
    title: 'Website Redesign',
    short_desc: 'Modernize outdated websites with contemporary aesthetics, improved speed, and higher conversion rates.',
    full_desc: 'Is your current website feeling slow, dated, or failing to generate qualified inquiries? We conduct a full audit, overhaul the design, optimize the tech stack, and modernize your digital presence while preserving your existing SEO rankings.',
    icon: 'RefreshCw',
    image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    starting_price: 21999,
    currency: 'INR',
    estimated_timeline: '2 - 4 Weeks',
    features: [
      'Complete UX & Conversion Rate Optimization (CRO) Audit',
      'Fresh, Modern Visual Theme Aligned with Current Industry Standards',
      '301 SEO Redirect Mapping to Preserve Existing Search Rankings',
      'Core Web Vitals & Mobile Usability Overhaul',
      'Modern Tech Stack Migration for Zero Bloat',
      'Analytics Setup to Track Pre/Post Redesign Improvements'
    ],
    deliverables: [
      'Brand New Modernized Website',
      'SEO Migration Report & URL Preservation Map',
      'Speed Benchmark Comparison (Before vs. After)',
      '30 Days Post-Launch Monitoring'
    ],
    process: [
      { step: 1, title: 'Legacy Audit', desc: 'Reviewing current analytics, drop-off points, and ranking keywords.' },
      { step: 2, title: 'New Concept Presentation', desc: 'Creating modern concepts that solve current UX bottlenecks.' },
      { step: 3, title: 'Development & Content Migration', desc: 'Building on modern tech while migrating your valuable content.' },
      { step: 4, title: 'SEO Preservation Verification', desc: 'Verifying all metadata, slugs, and structured data match perfectly.' },
      { step: 5, title: 'Seamless Cutover', desc: 'Zero downtime DNS migration to the new high-performance platform.' }
    ],
    is_active: true
  },
  {
    id: 'srv-5',
    slug: 'landing-pages',
    title: 'Landing Pages',
    short_desc: 'High-converting, hyper-focused landing pages engineered for paid ad campaigns and product launches.',
    full_desc: 'Maximize the return on your marketing spend. We design and build ultra-fast, persuasion-focused landing pages that captivate traffic, communicate your value proposition in seconds, and drive immediate action.',
    icon: 'LayoutTemplate',
    image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    starting_price: 14999,
    currency: 'INR',
    estimated_timeline: '5 - 10 Days',
    features: [
      'Conversion-Centered Layout & Strategic Visual Hierarchy',
      'Fast Loading Speed Under 800ms for Lower Ad Bounce Rates',
      'A/B Testing Ready Architecture (Headlines, CTAs, Hero layouts)',
      'Lead Capture Form with Instant Email/CRM Webhooks',
      'Meta Pixel, Google Tag Manager & Conversion API Setup',
      'Mobile-First Layout Optimized for Social Ad Traffic'
    ],
    deliverables: [
      'Custom Responsive Landing Page',
      'Lead Capture Integration with your CRM or Google Sheets',
      'Tracking & Analytics Tag Integration',
      'Speed & Conversion Audit Scorecard'
    ],
    process: [
      { step: 1, title: 'Campaign Strategy', desc: 'Aligning page narrative with your traffic source, ads, and target persona.' },
      { step: 2, title: 'High-Impact Copy & UI', desc: 'Structuring sticky hero headlines, social proof, and objection handling.' },
      { step: 3, title: 'Rapid Development', desc: 'Engineering ultra-lightweight code with zero bloated libraries.' },
      { step: 4, title: 'Tracking Verification', desc: 'Testing conversion events, lead notification webhooks, and pixels.' },
      { step: 5, title: 'Launch & A/B Setup', desc: 'Deploying live and ready for ad campaign activation.' }
    ],
    is_active: true
  },
  {
    id: 'srv-6',
    slug: 'graphic-brand-design',
    title: 'Graphic & Brand Design',
    short_desc: 'Memorable brand identities, logos, social media creative kits, and corporate digital assets.',
    full_desc: 'Establish an authoritative, distinct visual presence. We develop memorable logos, complete brand guideline manuals, social media asset packs, and marketing collateral that leave an indelible impression.',
    icon: 'Sparkles',
    image_url: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=80',
    starting_price: 12999,
    currency: 'INR',
    estimated_timeline: '1 - 2 Weeks',
    features: [
      'Primary & Secondary Logo Concepts with Vector Formats',
      'Brand Identity Guide (Color Palette, Font Pairings, Usage Rules)',
      'Social Media Kit (Instagram, LinkedIn, Twitter banners & posts)',
      'Digital Stationery (Business Card, Letterhead, Email Signature)',
      'High-Resolution Vector Source Files (SVG, AI, EPS, PNG, PDF)',
      'Full Commercial Usage & Copyright Ownership'
    ],
    deliverables: [
      'Complete Logo Master File Package (Vector & Web formats)',
      'Comprehensive Brand Style Guide PDF',
      'Social Media Profile & Brand Kit',
      'Digital Stationery Template Files'
    ],
    process: [
      { step: 1, title: 'Brand Discovery', desc: 'Exploring your vision, company tone, industry positioning, and aesthetic style.' },
      { step: 2, title: 'Concept Ideation', desc: 'Generating distinct visual directions with sketches and digital proofs.' },
      { step: 3, title: 'Refinement & Polish', desc: 'Iterating on typography weight, color nuances, and symbol balance.' },
      { step: 4, title: 'Collateral Extension', desc: 'Applying the chosen brand system to business cards, social media, and web assets.' },
      { step: 5, title: 'Final Master Package', desc: 'Delivering all vector formats, guides, and licensing documentation.' }
    ],
    is_active: true
  }
];

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  agency_name: 'NSK',
  tagline: 'Websites That Build Your Business',
  email: 'nskdigitalagency1906@gmail.com',
  phone: '8807855118',
  whatsapp: '8807855118',
  address: 'K B A Mens Hostel, Vandalur, Chennai - 600048, Tamil Nadu, India',
  business_hours: 'Monday – Saturday: 9:00 AM – 7:00 PM IST',
  notification_email: 'nskdigitalagency1906@gmail.com'
};
