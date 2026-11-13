# OrchidByte Solutions & General Services

> **Official Web Platform & Enterprise Architecture**  
> Technology · Innovation · Solutions  
> Registered Entity: **Corporate Affairs Commission (CAC) Nigeria — BN: 9343571**  
> Operational HQ: **Kano State, Nigeria**  
> Official Domain: **https://orchidbyte-solutions.com.ng**  
> Inquiries: **info@orchidbyte-solutions.com.ng**

---

## 1. Overview
OrchidByte Solutions & General Services is an indigenous Nigerian technology firm specializing in enterprise web architecture, mobile application engineering, cybersecurity audits & NDPR compliance, cloud infrastructure (DevOps), and continuous systems diagnostics.

This repository powers the official corporate web presence, showcasing production systems including **SchoolSync**, **CyberShield NG**, **GovTrack Portal**, **NetWatch IT Ops**, and **HelpDesk Pro**.

---

## 2. Architecture & Design System

### 2.1 The "Cyber-Executive" System
- **Palette**: Deep Space Navy (`#060b13`), Royal/Cobalt Blue (`#2563eb`), Cyber Cyan Accent (`#38bdf8`), and Pure White (`#ffffff`).
- **Dynamic Theming**: Seamless native Dark and Light mode toggle with `localStorage` persistence and automatic system preference detection (`prefers-color-scheme`).
- **Typography**: `Plus Jakarta Sans` for clean, modern geometric headings and body; `JetBrains Mono` for code and telemetry metrics.
- **Micro-Interactions**: Hardware-accelerated GPU transforms (`will-change: transform, opacity`), glassmorphic cards with dynamic cyan glows, blueprint reticle markers `[ ]` derived directly from the official brand logo.

### 2.2 Performance Optimizations
- **Modular Stylesheets**: Consolidated over 160 KB of duplicated inline CSS into a clean, cached external stylesheet: `assets/css/main.css`.
- **Zero Heavy Filter Overheads**: Eliminated full-viewport SVG turbulence filters (`feTurbulence`), delivering smooth 60fps scrolling on both mobile and low-spec hardware.
- **Precision Vectors**: Native vector SVG brand assets (`assets/brand/logo-horizontal.svg` and `assets/brand/logo-stacked.svg`) matching the official chip processor emblem.
- **WhatsApp Direct Connect**: Floating action pill for direct conversion with Nigerian B2B stakeholders.

---

## 3. Directory Structure

```
OrchidByte_Solutions/
├── assets/
│   ├── brand/
│   │   ├── logo-dark.png         # Official dark brand emblem card
│   │   ├── logo-light.png        # Official light brand emblem card
│   │   ├── logo-horizontal.svg   # Vector navbar & header lockup
│   │   └── logo-stacked.svg      # Vector hero & banner emblem
│   ├── css/
│   │   └── main.css              # Unified tokens, dark/light themes, typography
│   └── js/
│       └── main.js               # Theme engine, navbar, reveals, filters, AJAX form
├── contact.php                   # Hardened contact endpoint (Honeypot + Rate Limit)
├── index.html                    # Main landing page & consultation portal
├── projects.html                 # Flagship showcase gallery with interactive filters
├── privacy-policy.html           # NDPR-compliant data protection statement
├── terms.html                    # Client engagement terms & 30-day bug guarantee
└── README.md                     # Engineering documentation
```

---

## 4. Local Development & Deployment

### Quick Local Preview
Run any local static or PHP server:
```bash
# Using PHP built-in server (recommended to test contact.php)
php -S localhost:8000

# Or using Python for static testing
python -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.

### Production Deployment
1. Upload all repository files to your web root (`public_html` or `/var/www/html`).
2. Ensure PHP 8.0+ is enabled with standard mail or SMTP integration.
3. Configure your domain DNS records (SPF, DKIM, DMARC) for `@orchidbyte-solutions.com.ng` to ensure reliable email delivery.

---

## 5. Security & Verification
- **Anti-Bot Defense**: Hidden honeypot field (`website_hp`) in forms prevents automated spam without intrusive CAPTCHAs.
- **Rate Limiting**: IP-based transient throttle in `contact.php` limits spam floods.
- **Compliance**: Fully aligned with the **Nigeria Data Protection Regulation (NDPR)**.
- **Corporate Registry**: Corporate Affairs Commission of Nigeria, Business Name **BN: 9343571**.
