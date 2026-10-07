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

Instead of traditional booking platforms, **TicketBari** builds a seamless multi-role ecosystem through real-time booking management, secure Stripe payment integrations, dynamic ticket filtering, granular role-based permission safeguards, and cross-device interface parity for users, vendors, and admins.

</div>

---

## ⚡ Key Architecture Highlights

| Feature | Description |
|---------|-------------|
| 🔒 **Multi-Role Hybrid Session Handshake** | Integrates client-side JWT authorization with NextAuth for Email/Password + Google OAuth. Role-based access (User, Vendor, Admin) with persistent state monitoring ensures zero login regressions on private routes. |
| 🛠️ **Full RESTful CRUD Workspace** | Authenticated vendors can add, edit, update, or delete tickets. Admins manage users and verify vendor tickets. Destructive requests run through isolated security modals to prevent accidental loss. |
| 💳 **Stripe Payment Integration** | End-to-end secure checkout powered by Stripe. Transaction records are persisted per user and vendor with full booking history. |
| 🔎 **High-Fidelity Query Parsing** | Server-driven, case-insensitive search with transport type filters and price-based sorting (Low to High / High to Low). Results delivered in structured 3-column responsive grids. |
| 🌗 **Adaptive Global Visual States** | Vanilla CSS with CSS variables for global dark/light mode. Fully responsive layouts across all devices with smooth micro-animations and glassmorphism design. |
| 📊 **Vendor & Admin Analytics** | Revenue overview charts, transaction logs, booking management, and user management panels built exclusively for elevated roles. |

---

## 🏗️ Core Technology Toolkit

### 🎨 Client-Side (Frontend UI & State)

| Technology | Purpose |
|------------|---------|
| **Next.js 15** (App Router) | Client-side compilation + server-side page performance |
| **Vanilla CSS** | Responsive grids, fluid transitions & glassmorphism design |
| **NextAuth.js** | Session management, Google OAuth callbacks & JWT strategy |
| **Stripe.js** | Secure client-side payment checkout integration |
| **React Hook Form** | Performant form state management with validation |
| **ImgBB API** | Cloud image hosting for ticket thumbnails & avatars |
| **React Toastify** | Async feedback replacing native alerts |

### ⚙️ Server-Side (Backend Services API)

| Technology | Purpose |
|------------|---------|
| **Node.js + Express.js** | Fast routing pipelines |
| **MongoDB + Mongoose** | Document database for tickets, bookings & transactions |
| **JSON Web Tokens (JWT)** | Stateless cryptography for security bounds |
| **Stripe SDK** | Server-side payment intent creation & webhook handling |
| **Google OAuth** | Social identity handshake via Google Cloud Console |

---

## 📌 Main Project Requirements

### 🏛️ Navigation & Layout Foundations

**Navbar** — Quick links to Home, All Tickets. Authenticated users see:
- 🏠 Dashboard (role-based redirect)
- 🌙 Theme switcher
- 👤 Avatar dropdown with Profile & Logout

**Footer** — Contact directories, category routes, social links, and copyright.

### 🖥️ Public Interfaces

| Route | Description |
|-------|-------------|
| `/` (Landing) | Interactive hero banner + **Latest Tickets** section + **Top Advertised Tickets** + Popular Routes + Why Choose Us |
| `/tickets` (All Tickets) | Responsive 3-column grid with search, transport type filter, and price sorting |
| `/tickets/[id]` (Details) | Full ticket details with seat selection, date picker & Stripe booking flow |

### 🔐 Secure Private Dashboard Components

| Route | Role | Description |
|-------|------|-------------|
| `/dashboard/profile` | All | View and update personal profile |
| `/dashboard/my-bookings` | User | View all personal bookings with status |
| `/dashboard/transactions` | User | Personal payment transaction history |
| `/dashboard/add-ticket` | Vendor | Create new ticket listings with image upload |
| `/dashboard/my-tickets` | Vendor | Manage owned ticket listings |
| `/dashboard/advertise` | Vendor | Promote tickets to the homepage spotlight |
| `/dashboard/requested-bookings` | Vendor | Review & manage incoming booking requests |
| `/dashboard/revenue-overview` | Vendor | Revenue analytics and earnings charts |
| `/dashboard/manage-tickets` | Admin | Verify, approve or reject vendor tickets |
| `/dashboard/manage-users` | Admin | View and manage all platform users |
| `/dashboard/transactions` | Admin | Platform-wide transaction overview |

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
| Frontend Client | 36+ notable commits — components, breakpoints, auth, routing, dashboard panels |
| Backend Server | 27+ notable commits — API routes, JWT middleware, Stripe webhooks, database schemas |

---

## 📄 Licensing & Permissions

Copyright © 2026 TicketBari. All project blueprints, schemas, and asset layouts remain protected properties under educational distribution guidelines.

**Developed with ❤️ by** — *Syed Ahmad Galib*

---

<div align="center">

**⭐ Star this repo if you like TicketBari!**

</div>
