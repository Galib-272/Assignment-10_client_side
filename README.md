<div align="center">

# 🎫 TicketBari

### *Online Ticket Booking Platform*

[![Live Client](https://img.shields.io/badge/🚀_Live_Client-Click_Here-0A66C2?style=for-the-badge&logo=vercel&logoColor=white)](https://ticketbari-client-side.vercel.app)
[![Live API](https://img.shields.io/badge/⚙️_Live_API-Click_Here-00C7B7?style=for-the-badge&logo=vercel&logoColor=white)](https://ticketbari-server-side.vercel.app)

[![GitHub Frontend](https://img.shields.io/badge/📁_Frontend_Repo-View_on_GitHub-181717?style=flat-square&logo=github)](https://github.com/Galib-272/Assignment-10_client_side.git)
[![GitHub Backend](https://img.shields.io/badge/📁_Backend_Repo-View_on_GitHub-181717?style=flat-square&logo=github)](https://github.com/Galib-272/Assignment-10_server_side.git)

---

### ✨ Where Travelers Book Smarter & Vendors Sell Faster

> *Browse tickets · Book instantly · Pay securely · Manage everything from a unified dashboard*

**TicketBari** builds a seamless multi-role ecosystem through real-time booking management, secure Stripe payment integrations, dynamic ticket filtering, granular role-based permission safeguards, and cross-device interface parity for users, vendors, and admins.

</div>

---

## ⚡ Key Architecture Highlights

| Feature | Description |
|---------|-------------|
| 🔒 **Multi-Role Hybrid Session Handshake** | Integrates client-side JWT authorization with NextAuth for Email/Password + Google OAuth. Role-based access (User, Vendor, Admin) with persistent state monitoring ensures zero login regressions on private routes. |
| 🛠️ **Full RESTful CRUD Workspace** | Authenticated vendors can add, edit, update, or delete tickets. Admins manage users and verify vendor tickets. |
| 💳 **Stripe Payment Simulation** | End-to-end simulated checkout powered by a Stripe-style white-label UI. Bookings transition from `accepted → paid` on confirmation. Transaction records are persisted per user and vendor. |
| 🔎 **High-Fidelity Query Parsing** | Server-driven, case-insensitive search with transport type filters and price-based sorting. Results in structured 3-column responsive grids. |
| 🌗 **Adaptive Global Visual States** | Vanilla CSS with CSS variables for global dark/light mode. Fully responsive layouts with smooth micro-animations and glassmorphism. |
| 📊 **Vendor & Admin Analytics** | Revenue overview charts, transaction logs, booking management, and user management panels for elevated roles. |
| 🚫 **Fraud Vendor System** | Admins can mark any vendor as fraudulent. All their tickets are hidden and they lose the ability to add or modify tickets. |
| ✅ **Admin Ticket Approval on Detail Page** | Admins see Approve/Reject buttons on ticket detail pages instead of Book Now, with live status badge updates. |

---

## 🆕 Latest Updates (October 2026)

### 🚫 Mark as Fraud — Admin Vendor Control
- New **"Mark as Fraud"** red button appears next to every vendor in Admin → Manage Users
- Instantly hides all the vendor's tickets from the platform (`verificationStatus: rejected`)
- Vendor loses the ability to add or modify any tickets — "Account Suspended" screen shown
- A **FRAUD** red badge appears next to the vendor's role in the user table
- Admins can remove the fraud flag with the **"Remove Fraud"** green button
- A **Fraudulent Vendors** stat card shown in the user management overview

### ✅ Admin Approve / Reject on Ticket Detail Page
- When admin navigates to `/tickets/[id]`, the "Book Now" button is replaced with:
  - ✅ **Approve Ticket** — green button (disabled if already approved)
  - ❌ **Reject Ticket** — red button (disabled if already rejected)
  - Live **status badge** (PENDING / APPROVED / REJECTED)
- Changes reflect instantly without page reload

### 💳 Stripe Payment Simulation (User Panel)
- Users with `accepted` bookings can click **Pay Now** in My Bookings
- A white-label Stripe-style checkout page collects card details (test mode — no real money)
- On completion, booking status updates to `paid` and a payment record is created

### 📱 Responsive Search Bar — All Tickets Page
- On mobile screens (≤ 600px), the From / To / Search fields now **stack vertically**
- On desktop the original 3-column layout is preserved

### 🔔 Vendor Booking Request Fix
- Vendors correctly receive incoming booking requests in `/dashboard/requested-bookings`
- Fixed route order bug so vendor-specific API routes resolve without errors

---

## 🏗️ Core Technology Toolkit

### 🎨 Client-Side (Frontend UI & State)

| Technology | Purpose |
|------------|---------|
| **Next.js 15** (App Router) | Client-side compilation + server-side page performance |
| **Vanilla CSS** | Responsive grids, fluid transitions & glassmorphism design |
| **NextAuth.js** | Session management, Google OAuth callbacks & JWT strategy |
| **React Hook Form** | Performant form state management with validation |
| **ImgBB API** | Cloud image hosting for ticket thumbnails & avatars |
| **React Hot Toast** | Async feedback replacing native alerts |
| **React Icons** | Icon library (FaBan, FaCheck, FaTimes, etc.) |

---

## 📌 Dashboard Route Map

| Route | Role | Description |
|-------|------|-------------|
| `/dashboard/profile` | All | View and update personal profile |
| `/dashboard/my-bookings` | User | View bookings with status + Pay Now for accepted bookings |
| `/dashboard/transactions` | User | Personal payment transaction history |
| `/dashboard/add-ticket` | Vendor | Create tickets (blocked with Account Suspended if marked fraud) |
| `/dashboard/my-tickets` | Vendor | Manage owned ticket listings |
| `/dashboard/advertise` | Vendor | Promote tickets to the homepage spotlight |
| `/dashboard/requested-bookings` | Vendor | Review & manage incoming booking requests |
| `/dashboard/revenue-overview` | Vendor | Revenue analytics and earnings charts |
| `/dashboard/manage-tickets` | Admin | Verify, approve or reject vendor tickets |
| `/dashboard/manage-users` | Admin | Manage all users + Mark Vendors as Fraud |
| `/dashboard/transactions` | Admin | Platform-wide transaction overview |

### 🖥️ Public Interfaces

| Route | Description |
|-------|-------------|
| `/` | Hero banner + Latest Tickets + Advertised Tickets + Popular Routes |
| `/tickets` | Responsive grid with mobile-stacked search, filter & price sort |
| `/tickets/[id]` | Full details — Book Now (user), Approve/Reject (admin), Manage (vendor) |

---

## 📂 Source Repositories

| Role | Repository |
|------|------------|
| 🖥️ **Frontend UI** | [github.com/Galib-272/Assignment-10_client_side](https://github.com/Galib-272/Assignment-10_client_side.git) |
| ⚙️ **Backend API** | [github.com/Galib-272/Assignment-10_server_side](https://github.com/Galib-272/Assignment-10_server_side.git) |

---

## 📈 Git Contribution History

| Repository | Commits |
|------------|---------|
| Frontend Client | 40+ commits — components, auth, routing, dashboard panels, fraud system, payment UI, responsive fixes |
| Backend Server | 30+ commits — API routes, JWT middleware, database schemas, fraud model, booking status transitions |

---

## 📄 Licensing & Permissions

Copyright © 2026 TicketBari. All project blueprints, schemas, and asset layouts remain protected under educational distribution guidelines.

**Developed with ❤️ by** — *Syed Ahmad Galib*

---

<div align="center">

**⭐ Star this repo if you like TicketBari!**

</div>
