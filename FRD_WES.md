# Functional Requirement Document (FRD)

## Women Entrepreneurs Summit (WES) — Web Application

---

| **Document Version** | 1.0 |
|---|---|
| **Project Name** | Women Entrepreneurs Summit (WES) |
| **Client** | Jamaat-e-Islami Hind, Women's Wing Kerala |
| **Developed By** | D4DX |
| **Event Date** | 20 June 2026 (Saturday) |
| **Event Venue** | KPM TRIPENTA HOTEL, Kozhikode, Kerala |
| **Registration Fee** | ₹1,000 per participant |
| **Document Date** | 12 May 2026 |

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Technology Stack](#3-technology-stack)
4. [User Roles](#4-user-roles)
5. [Module 1: Public Website (Landing Page)](#5-module-1-public-website-landing-page)
6. [Module 2: Registration System](#6-module-2-registration-system)
7. [Module 3: Admin Dashboard](#7-module-3-admin-dashboard)
8. [Module 4: Payment QR Management](#8-module-4-payment-qr-management)
9. [Module 5: Entry Pass Generation & Delivery](#9-module-5-entry-pass-generation--delivery)
10. [Module 6: Gate Scanner (QR Check-In)](#10-module-6-gate-scanner-qr-check-in)
11. [Module 7: WhatsApp Integration](#11-module-7-whatsapp-integration)
12. [Module 8: WhatsApp Group Integration (Upcoming)](#12-module-8-whatsapp-group-integration-upcoming)
13. [Authentication & Security](#13-authentication--security)
14. [File Storage & CDN](#14-file-storage--cdn)
15. [API Endpoints Summary](#15-api-endpoints-summary)
16. [Data Models](#16-data-models)
17. [UI/UX Specifications](#17-uiux-specifications)
18. [Deployment & Hosting](#18-deployment--hosting)
19. [Rate Limiting & Protection](#19-rate-limiting--protection)
20. [Non-Functional Requirements](#20-non-functional-requirements)

---

## 1. Project Overview

Women Entrepreneurs Summit (WES) is a full-stack web application designed to manage the end-to-end operations of a one-day entrepreneurship summit for women held in Kozhikode, Kerala. The application covers public-facing event promotion, participant registration with payment verification, automated entry pass generation with QR codes, WhatsApp-based pass delivery, and on-site QR code-based check-in at the event venue.

### 1.1 Business Objectives

- Provide a premium, modern public website to promote the summit and drive registrations
- Enable seamless online registration with UPI-based payment collection
- Automate entry pass generation with unique QR codes for each participant
- Deliver entry passes directly via WhatsApp to participants
- Enable fast on-site check-in through QR code scanning at the venue gate
- Provide an admin dashboard for complete event management, data analytics, and export

### 1.2 Target Audience

- Women entrepreneurs, aspiring founders, professionals, and changemakers from across Kerala
- Expected capacity: 250+ attendees

---

## 2. System Architecture

The system follows a **client-server architecture** with two independently deployable modules:

```
┌──────────────────────────┐      ┌──────────────────────────────┐
│    Frontend (SPA)        │      │       Backend (REST API)      │
│    React + Vite          │◄────►│       Node.js + Express       │
│    Netlify (CDN)         │      │       Deployed separately     │
└──────────────────────────┘      └──────────┬───────────────────┘
                                             │
                                  ┌──────────▼───────────────────┐
                                  │        MongoDB Atlas          │
                                  │       (Database)              │
                                  └──────────────────────────────┘
                                             │
                           ┌─────────────────┼─────────────────┐
                           │                 │                 │
                  ┌────────▼──────┐  ┌───────▼──────┐  ┌──────▼──────┐
                  │ DigitalOcean  │  │  Dxing API   │  │  QR Code    │
                  │ Spaces (S3)   │  │  (WhatsApp)  │  │  Generator  │
                  │ File Storage  │  │  Messaging   │  │  (Canvas)   │
                  └───────────────┘  └──────────────┘  └─────────────┘
```

---

## 3. Technology Stack

### 3.1 Frontend

| Component | Technology |
|---|---|
| Framework | React 18+ with TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS + Custom CSS |
| UI Components | Radix UI (shadcn/ui pattern) |
| Animations | GSAP (ScrollTrigger) |
| Smooth Scrolling | Lenis |
| Form Management | React Hook Form + Zod validation |
| QR Scanner | html5-qrcode |
| Icons | Lucide React |
| Routing | React Router |

### 3.2 Backend

| Component | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB (Mongoose ODM) |
| Authentication | JWT (JSON Web Tokens) |
| File Upload | Multer + Multer-S3 |
| Cloud Storage | DigitalOcean Spaces (S3-compatible) |
| Image Generation | Node Canvas |
| QR Code Generation | qrcode library |
| WhatsApp Messaging | Dxing API (via Axios) |
| Security | express-rate-limit, CORS, bcryptjs |

### 3.3 Deployment

| Component | Platform |
|---|---|
| Frontend Hosting | Netlify (CDN) |
| Backend Hosting | Cloud Server |
| Database | MongoDB Atlas |
| File Storage / CDN | DigitalOcean Spaces |

---

## 4. User Roles

### 4.1 Public User (Participant)

- Can view the event landing page with all event details
- Can register for the event by filling a multi-step form
- Can make payment via UPI and upload payment screenshot
- Receives entry pass via WhatsApp after admin verification

### 4.2 Admin

- Authenticated access via username/password (environment-based credentials)
- Can manage all registrations (view, search, filter, sort, delete)
- Can verify payments by reviewing uploaded payment screenshots
- Can generate digital entry passes for verified registrations
- Can send entry passes via WhatsApp to participants
- Can manage payment QR code configurations
- Can view registration analytics/statistics
- Can export registration data as CSV
- Can perform on-site check-in via QR scanner
- Can view check-in stats and export check-in data

---

## 5. Module 1: Public Website (Landing Page)

The landing page is a single-page scroll-based website with premium glassmorphism design and GSAP-powered animations.

### 5.1 Sections

#### 5.1.1 Navbar (Fixed Header)

- **Position**: Fixed at the top, white background with subtle shadow
- **Logo**: WES logo with event name and date displayed on desktop
- **Navigation Links**: Overview, Themes, Program, Venue, Register — smooth scroll to respective sections
- **CTA Button**: "Register Now" button with gradient styling that opens the registration dialog
- **Mobile**: Hamburger menu with full-screen overlay navigation, compact "Register" button visible alongside hamburger icon
- **Smooth scrolling** to anchor sections on link click

#### 5.1.2 Hero Section

- **Welcome Popup**: Appears automatically after 1.8 seconds on page load
  - Shows event logo, organizer name, event date and venue
  - "Register Now" CTA button that opens the registration form
  - "Explore the Summit" secondary button to dismiss
  - Dismissible via close button or clicking outside
- **Badge**: "Jamaat-e-Islami Hind Women's Wing Kerala presents"
- **Title**: "Women Entrepreneurs Summit" with styled gradient text
- **Subtitle**: Event description paragraph
- **Meta Info**: Date (20 June 2026), Venue (KPM TRIPENTA HOTEL, Kozhikode), Attendee count (250+)
- **CTA**: "Register Now — ₹1,000" button opening registration dialog
- **Spotlight Cards**: 3 stat cards highlighting:
  - 250+ — Founders, aspirants, and business leaders from across Kerala
  - 5+ — Theme-led learning tracks
  - 1 Day — A focused summit
- **Side Panel**: Quick event summary card
- **Decorative Elements**: Floating gradient shapes with continuous GSAP animation, 25 animated particle dots
- **GSAP Animations**: Staggered entrance animations for all elements

#### 5.1.3 About / Summit Overview Section

- **Label**: "Summit Overview"
- **Heading**: Mission statement about the summit's purpose
- **Description**: Three paragraphs laid out in a responsive 3-column grid explaining:
  - What WES is designed for
  - Barriers women-led ventures face
  - The expected environment
- **Who / What**: Two-column info cards (details about the attendees and event goals)
- **Stats Cards**: 4 value proposition cards with icons:
  - Clarity — Growth direction
  - Community — Network of women
  - Momentum — Actionable ideas
  - Values — Purpose-driven growth
- **Container**: Rounded glassmorphism card with backdrop blur

#### 5.1.4 Session Themes / Highlights Section

- **Label**: "Session Themes"
- **Layout**: 2-column with sticky left panel and scrolling card list
- **Left Panel (Sticky)**:
  - Heading about curated learning flow
  - Supporting description
  - "Also included" card mentioning peer conversations and expert moments
- **Right Panel (5 Theme Cards)**:
  1. **Ethical and Value-Based Business** — Conviction, responsibility, long-term thinking
  2. **Women, Identity, and Leadership** — Confidence, visibility, leadership roles
  3. **Founders Panel and Shared Journeys** — Candid wins, setbacks, lessons
  4. **Digital Marketing and Brand Presence** — Positioning, audience, brand communication
  5. **Business Design Thinking** — Creative frameworks, solving business challenges
- **Card Design**: Glassmorphism cards with hover elevation effect, icon + title + description
- **GSAP Animations**: Left column fades in from left, cards stagger in from right

#### 5.1.5 Schedule / Program Flow Section

- **Label**: "Program Flow"
- **Layout**: Vertical timeline with alternating left/right cards (desktop), stacked (mobile)
- **Timeline Visual**: Animated vertical line with pulsing dot indicators
- **Schedule Items** (9 items):

| Time | Session | Description |
|---|---|---|
| 09:00 AM | Registration & Welcome | Arrival, check-in, first conversations |
| 10:00 AM | Inaugural Session | Opening reflections, summit vision |
| 10:30 AM | Ethical & Value-Based Business | Principles, accountability, values in business |
| 11:30 AM | Women Identity & Leadership | Self-belief, leadership presence, clarity |
| 12:30 PM | Panel Discussion | Real stories from women entrepreneurs |
| 01:30 PM | Networking Lunch | Connection building and peer networking |
| 02:30 PM | Digital Marketing & Branding | Messaging, online presence, audience connection |
| 03:30 PM | Business Design Thinking | Creative tools for business problem solving |
| 04:30 PM | Special Consultation Desks | Focused guidance and tailored direction |

- **Card Design**: Glassmorphism cards with time badge, title, and description
- **GSAP Animations**: Timeline line draws downward, items slide in from alternating directions

#### 5.1.6 Venue Section

- **Label**: "Venue & Hosting"
- **Layout**: 2-column — Google Maps embed (left) + venue details (right)
- **Google Maps**: Interactive embedded map pinpointing KPM TRIPENTA HOTEL (lat: 11.2690035, lng: 75.7898538)
- **Venue Name**: KPM TRIPENTA HOTEL
- **Location**: Kozhikode, Kerala
- **Description**: Venue overview and programme host information
- **Features** (3 items with icons):
  - Comfortable premium venue
  - Networking-friendly spaces
  - Polished atmosphere aligned with event identity
- **Info Cards**:
  - Organised by: Jamaat-e-Islami Hind Women's Wing Kerala
  - City energy: Central Kozhikode location
- **CTA**: "Get Directions" button linking to Google Maps
- **Container**: Rounded glassmorphism card

#### 5.1.7 Registration CTA Section

- **Heading**: "Make your place part of the room."
- **Body**: Description about limited registration
- **Price Display**: Large animated gradient text showing "₹1,000" with "per participant" label
- **CTA**: "Register Now" button with pulse glow animation, opens the registration dialog
- **Event Info**: Date, venue, and organizer in single line
- **Decorative Elements**: Floating gradient shape images with blur effects
- **Container**: Glassmorphism card with gradient hero background

#### 5.1.8 Footer

- **3-Column Layout**:
  - **Column 1**: WES logo, event name, organizer info
  - **Column 2**: Quick Links (Overview, Themes, Program, Venue, Register)
  - **Column 3**: Contact details
    - Email: jihwomenkerala@gmail.com
    - Phone: +91 9947846195
    - Social Media: Instagram (@wes_kerala), Facebook
- **Bottom Bar**: Copyright notice + "Powered by D4DX" credit
- **GSAP Animations**: Staggered reveal on scroll

---

## 6. Module 2: Registration System

### 6.1 Registration Form (Multi-Step Dialog)

The registration form is implemented as a modal dialog (Radix UI Dialog) triggered from multiple locations: Navbar CTA, Hero section, Registration CTA section, and Welcome popup.

#### 6.1.1 Form Fields

| # | Field | Type | Validation | Required |
|---|---|---|---|---|
| 1 | Full Name | Text Input | Min 2 chars, Max 120 chars | Yes |
| 2 | Age | Number Input | Integer, 10–120 | Yes |
| 3 | WhatsApp Number | Text Input | Min 7 chars, Max 20 chars, Regex: `^[+\d\s\-()]+$` | Yes |
| 4 | Email Address | Email Input | Valid email format, Max 200 chars | Yes |
| 5 | District | Dropdown Select | Must be one of 14 Kerala districts | Yes |
| 6 | Venture/Business Name | Text Input | Max 200 chars, Default: "N/A" | No |
| 7 | Industry/Sector | Dropdown Select | Must be from predefined list | Yes |
| 8 | Business Stage | Dropdown Select | Must be from predefined list | Yes |
| 9 | Business Scale | Dropdown Select | Must be from predefined list | Yes |
| 10 | Payment Screenshot | File Upload | JPEG/PNG/WebP/PDF, Max 5MB | Yes |

#### 6.1.2 District Options (14 Kerala Districts)

Thiruvananthapuram, Kollam, Pathanamthitta, Alappuzha, Kottayam, Idukki, Ernakulam, Thrissur, Palakkad, Malappuram, Kozhikode, Wayanad, Kannur, Kasaragod

#### 6.1.3 Industry/Sector Options

Manufacturing, Services, Retail/Wholesale, Technology/Digital, Food, Hospitality, Agriculture, Clothing, Others

#### 6.1.4 Business Stage Options

Ideation (Concept only), Startup (0-1 year), Established (1+ years), Looking to Scale/Expand

#### 6.1.5 Business Scale Options

Home based, Small scale, Large scale

#### 6.1.6 Payment Flow (Within Registration Form)

1. Form displays the currently active **Payment QR code** image fetched from the server
2. Shows the **UPI ID** with a copy-to-clipboard button
3. Shows the payment **amount** (₹1,000)
4. User makes payment externally via any UPI app
5. User takes a **screenshot** of the payment confirmation
6. User uploads the screenshot via file picker in the form
   - Supported formats: JPEG, PNG, WebP, PDF
   - Maximum file size: 5MB
   - Image preview shown for image files; file name shown for PDFs
7. If no active QR is configured, the QR section is hidden and the user can still submit

#### 6.1.7 Form Submission

- Uses `FormData` (multipart) for submission since it includes file upload
- On success: Displays a success confirmation screen with checkmark animation
- On failure: Displays inline server error messages
- Form resets upon successful submission and dialog close

#### 6.1.8 Form Validation

- **Frontend**: Zod schema validation integrated with React Hook Form
- **Backend**: Mongoose model-level validation with custom error messages
- Real-time field-level error display below each input

### 6.2 Backend Registration Processing

1. File upload is processed first via Multer-S3 middleware
2. Payment screenshot is uploaded to DigitalOcean Spaces with a UUID-based filename
3. CDN URL is generated for the uploaded file
4. Registration document is created in MongoDB with all fields
5. Default flags set: `paymentVerified: false`, `entryPassGenerated: false`
6. Returns success response with document ID

---

## 7. Module 3: Admin Dashboard

### 7.1 Access

- **URL**: `/admin`
- **Authentication**: Username/password login, JWT-based session
- **Session Persistence**: JWT stored in `localStorage` (`wes_admin_token`)

### 7.2 Dashboard Layout

The admin dashboard is a single-page application with a tabbed interface and three main sections:

#### 7.2.1 Header Bar

- Application title "WES Admin"
- Navigation link to Gate Scanner (`/scanner`)
- Logout button
- Active tab indicators

#### 7.2.2 Tabs

1. **Registrations** — Main registration management view
2. **Payment QR** — Payment QR code configuration management
3. **Check-Ins** — Check-in records from gate scanner

### 7.3 Registrations Tab

#### 7.3.1 Statistics Bar

Displays aggregate counts fetched from `/api/admin/registrations/stats`:
- **Total registrations** count
- **By Industry**: Breakdown count per industry sector
- **By Stage**: Breakdown count per business stage
- **By Scale**: Breakdown count per business scale

#### 7.3.2 Filters & Search

| Filter | Type | Description |
|---|---|---|
| Search | Text Input | Full-text search across fullName, email, whatsappNumber, ventureName, district |
| Industry | Dropdown | Filter by industry sector |
| Business Stage | Dropdown | Filter by business stage |
| Business Scale | Dropdown | Filter by business scale |
| District | Dropdown | Filter by Kerala district (14 options) |

- **Reset Filters** button to clear all active filters
- Filters trigger immediate re-fetch with debounced search

#### 7.3.3 Registration List (Table View)

- **Sortable Columns**: Submitted At, Full Name, Age, Email, District, Industry, Stage, Scale, Venture
- **Sort Toggle**: Click column to toggle ascending/descending
- **Pagination**: Configurable page size (10, 20, 50, 100, 200 per page), page navigation
- **Row Data**: Displays participant name, age, WhatsApp, district, venture, industry, stage/scale
- **Status Indicators**:
  - Payment verified status (✓ / ✗ icon)
  - Entry pass generated status
  - Pass sent via WhatsApp status
- **Click-to-View**: Clicking a row opens the registration detail panel

#### 7.3.4 Registration Detail Panel

When a registration is selected, a detail side panel or expanded view shows:

- **All registration fields** with full data
- **Payment Screenshot**: Clickable link/preview of uploaded payment image
- **Timestamps**: Created at, Updated at
- **Action Buttons**:
  1. **Verify Payment** — Marks `paymentVerified: true` (only if not already verified)
  2. **Generate Entry Pass** — Generates QR code + entry pass image (requires payment verified)
  3. **Send Pass via WhatsApp** — Sends the generated pass image to participant's WhatsApp (requires pass generated)
  4. **Delete Registration** — Permanently removes the registration (with confirmation dialog)

#### 7.3.5 Export

- **CSV Export**: Downloads all registration data as a CSV file
- **XLSX Export**: Client-side Excel export using the `xlsx` library
- Fields exported: Submitted At, Full Name, Age, WhatsApp, Email, District, Payment Screenshot URL, Payment Verified, Venture/Business, Industry, Business Stage, Business Scale, Pass Generated, Pass ID, Pass Sent At

#### 7.3.6 Confirmation Dialogs

- Critical actions (Delete, Verify Payment) trigger a confirmation dialog with:
  - Title and description
  - Confirm/Cancel buttons
  - Support for "danger" tone (red styling) for destructive actions

#### 7.3.7 Toast Notifications

- Success/error toast notifications for all admin actions
- Auto-dismiss after 2.8 seconds
- Positioned for visibility without obstructing workflow

### 7.4 Payment QR Tab

See [Module 4: Payment QR Management](#8-module-4-payment-qr-management)

### 7.5 Check-Ins Tab

See [Module 6: Gate Scanner](#10-module-6-gate-scanner-qr-check-in)

---

## 8. Module 4: Payment QR Management

### 8.1 Purpose

Allows the admin to manage UPI payment QR code images that are displayed to participants during registration. Only one QR can be active at a time.

### 8.2 Features

#### 8.2.1 QR Config List

- Displays all payment QR configurations sorted by creation date (newest first)
- Each item shows: QR image thumbnail, UPI ID, Amount, Label, Active status, Created date

#### 8.2.2 Create New QR Config

| Field | Type | Validation | Required |
|---|---|---|---|
| QR Image | File Upload | JPEG/PNG/WebP/PDF, Max 5MB | Yes |
| UPI ID | Text Input | Max 100 chars | Yes |
| Amount | Number Input | Min ₹1 | Yes |
| Label | Text Input | Max 100 chars | No |

- New configs are created with `isActive: false` by default

#### 8.2.3 Activate / Deactivate

- **Activate**: Sets the selected QR as active; automatically deactivates all other QR configs (enforced via Mongoose pre-save hook — only 1 active at a time)
- **Deactivate**: Marks a QR config as inactive

#### 8.2.4 Delete

- Permanently removes the QR configuration
- Also deletes the QR image file from DigitalOcean Spaces storage (cleanup)

### 8.3 Public API

- `GET /api/registrations/active-qr` — Returns the currently active QR's image URL, UPI ID, and amount for display in the registration form

---

## 9. Module 5: Entry Pass Generation & Delivery

### 9.1 Entry Pass Generation

#### 9.1.1 Pre-requisite

- Payment must be verified (`paymentVerified: true`) before a pass can be generated

#### 9.1.2 Pass ID Generation

- Unique 8-character uppercase alphanumeric ID
- Generated using `crypto.randomUUID()` truncated to 8 chars
- Stored as `entryPassId` in the registration document

#### 9.1.3 Pass Image Generation (Canvas-based)

The entry pass is a **1080 × 1400 pixel PNG image** generated server-side using the Node.js `canvas` library:

| Element | Specification |
|---|---|
| **Canvas Size** | 1080 × 1400 px |
| **Background** | Linear gradient: #0f0c29 → #302b63 → #24243e |
| **Top Accent Bar** | Gradient bar (#f857a6 → #ff5858), 8px height |
| **Inner Card** | Rounded rectangle with 30px radius, semi-transparent white fill with white border |
| **Header Text** | "E N T R Y   P A S S" (spaced uppercase), white 40% opacity |
| **Event Name** | "WOMEN ENTREPRENEURS SUMMIT" — bold 48px, white, word-wrapped |
| **Divider** | Horizontal line, white 15% opacity |
| **Event Date** | "📅 20 June 2026" |
| **Event Venue** | "📍 Manuelsons Malabar Palace, Calicut" |
| **Attendee Label** | "A T T E N D E E" (spaced uppercase) |
| **Attendee Name** | Full name in bold 36px uppercase white |
| **QR Code** | 300 × 300 px on white background with 16px border radius, encodes the Pass ID |
| **Pass ID Text** | Pass ID displayed below QR code, mono-spaced, white 50% opacity |
| **Bottom Info** | Event organizer name |

#### 9.1.4 Storage

- Generated PNG is uploaded to DigitalOcean Spaces at key: `{folder}/entry-passes/{passId}.png`
- CDN URL is stored as `entryPassUrl` in the registration document
- `entryPassGenerated` flag is set to `true`

### 9.2 Entry Pass Delivery (via WhatsApp)

#### 9.2.1 Pre-requisite

- Entry pass must be generated (`entryPassGenerated: true`, `entryPassUrl` must exist)

#### 9.2.2 WhatsApp Message

- **Type**: Image message with caption
- **Image**: Entry pass image (CDN URL)
- **Caption**:
  ```
  🎟️ *WOMEN ENTREPRENEURS SUMMIT 2026*

  Dear *{Full Name}*,

  Your entry pass has been confirmed! ✅

  📅 Date: 20 June 2026
  📍 Venue: Manuelsons Malabar Palace, Calicut
  🆔 Pass ID: *{Pass ID}*

  Please show this pass at the entrance for check-in.

  See you at the summit! 🌟
  ```

#### 9.2.3 Phone Number Normalization

- Strips all spaces, hyphens, parentheses
- Removes leading `+`
- Prepends `91` (India country code) if number is 10 digits without country code

#### 9.2.4 Post-delivery

- `entryPassSentAt` timestamp is recorded in the registration document

---

## 10. Module 6: Gate Scanner (QR Check-In)

### 10.1 Access

- **URL**: `/scanner`
- **Authentication**: Same JWT-based login as admin panel
- **Optimized for**: Mobile devices (used at the venue gate)

### 10.2 Scanner Interface

#### 10.2.1 Header

- Title: "Gate Scanner"
- Real-time stats display: `{checked-in} / {total-with-pass} checked in ({percentage}%)`
- Navigation link to Admin panel
- Logout button

#### 10.2.2 Camera Scanner

- Uses `html5-qrcode` library for real-time QR code scanning
- **Camera**: Rear-facing camera preferred (`facingMode: 'environment'`)
- **Settings**: 10 FPS, 250×250px QR detection box, 1:1 aspect ratio
- **Start/Stop controls**: Manual start and stop scanner buttons
- Camera permission request on start

#### 10.2.3 Scan Processing Flow

```
QR Code Detected → POST /api/admin/check-in/{passId}
                      │
              ┌───────┼───────────┬───────────┐
              ▼       ▼           ▼           ▼
          200 OK    409 Conflict  404 Not    500 Error
          (Success) (Duplicate)   Found
              │       │           │           │
              ▼       ▼           ▼           ▼
         ✅ Green   ❌ Red      ⚠️ Yellow   ⚠️ Gray
         Welcome!   Already     Invalid     Error
                    Checked In   Pass        Message
```

#### 10.2.4 Scan Result Display

Each scan result is displayed for 3 seconds with color-coded feedback:

| Status | Color | Icon | Information Shown |
|---|---|---|---|
| **Success** | Green | ✅ | "Welcome, {name}!", Pass ID, Venture Name, District |
| **Duplicate** | Red | ❌ | "{name} — already entered", original check-in time |
| **Invalid** | Yellow | ⚠️ | "Invalid pass — not found in system", scanned pass ID |
| **Error** | Gray | ⚠️ | Error message |

- **Haptic Feedback**: Device vibration patterns differ by result type:
  - Success: Single 200ms vibration
  - Duplicate: Double vibration pattern [100, 50, 100]
  - Invalid: Triple vibration pattern [100, 50, 100, 50, 100]

#### 10.2.5 Scanner Pause/Resume

- Scanner automatically **pauses** while processing a scan to prevent double-scans
- Automatically **resumes** after the result is dismissed (3-second auto-dismiss)

#### 10.2.6 Recent Check-Ins Panel

- Shows the most recent 20 check-ins sorted by check-in time (newest first)
- Each entry shows: Full name, Venture name, District, Pass ID, Check-in time
- **Refresh button** to reload check-ins and stats
- Scrollable list with 400px max height

### 10.3 Check-In Backend

#### 10.3.1 Check-In Endpoint (`POST /api/admin/check-in/:passId`)

- Validates the pass ID (uppercase, trimmed)
- Looks up registration by `entryPassId`
- If not found: Returns 404 with "Invalid pass"
- If already checked in (`checkedIn: true`): Returns 409 with duplicate details
- If valid: Sets `checkedIn: true`, `checkedInAt: new Date()`, `checkedInBy: {admin username}`
- Returns participant details on success

#### 10.3.2 Check-In List (`GET /api/admin/check-ins`)

- Lists all checked-in attendees with search, sort, and pagination
- Search across: fullName, entryPassId, ventureName, district
- Sortable fields: checkedInAt, fullName, district, ventureName
- Pagination: max 200 per page

#### 10.3.3 Check-In Stats (`GET /api/admin/check-ins/stats`)

Returns:
- `totalCheckedIn` — Number of checked-in attendees
- `totalWithPass` — Total attendees with generated passes
- `percentage` — Check-in percentage

#### 10.3.4 Check-In Export (`GET /api/admin/check-ins/export`)

CSV download with fields: Checked In At, Full Name, WhatsApp, District, Venture/Business, Pass ID, Checked In By

---

## 11. Module 7: WhatsApp Integration

### 11.1 Service Provider

- **API**: Dxing API (https://app.dxing.in/api)
- **Authentication**: API Key + Instance ID (environment variables)

### 11.2 Capabilities

#### 11.2.1 Image Message

- Sends WhatsApp image messages with caption
- Used for: Entry pass delivery
- Parameters: recipient phone, image URL (CDN), caption text

#### 11.2.2 Text Message

- Sends plain WhatsApp text messages
- Available for future use

### 11.3 Phone Number Handling

- Normalizes input: strips spaces, hyphens, parentheses
- Removes leading `+` sign
- Auto-prepends India country code `91` for 10-digit numbers

### 11.4 Configuration

- `DXING_API_KEY` — API secret key
- `DXING_INSTANCE_ID` — WhatsApp instance/account ID
- 30-second request timeout

---

## 12. Module 8: WhatsApp Group Integration (Upcoming)

> **Status: 🔜 Upcoming Feature — Not Yet Implemented**

### 12.1 Overview

A planned feature to automatically add verified and registered participants to a dedicated **WhatsApp group** for the Women Entrepreneurs Summit. This will enhance pre-event engagement, facilitate networking, and serve as a central communication channel for event updates.

### 12.2 Proposed Functionality

#### 12.2.1 Auto-Add to WhatsApp Group

- When a registration's payment is **verified** by the admin, the participant should be **automatically added** to the designated WES WhatsApp group
- Alternatively, the admin can trigger the group addition manually alongside the "Send Entry Pass" action
- The participant's WhatsApp number (already collected during registration) will be used for the group invite

#### 12.2.2 Admin Configuration

- Admin should be able to configure the **target WhatsApp group** (group ID / invite link)
- Option to **enable/disable** automatic group addition
- Ability to set a **welcome message** that is sent when a participant is added

#### 12.2.3 Group Management Features

- View the count of participants added to the group vs total verified registrations
- Retry failed group additions
- Bulk-add functionality for participants who were verified before this feature was enabled
- Log of group addition attempts with success/failure status

#### 12.2.4 Participant Experience

- Upon payment verification, the participant receives:
  1. Entry pass via WhatsApp (existing feature)
  2. WhatsApp group invitation/addition (new feature)
- A notification or message informing them about the group and its purpose

#### 12.2.5 Technical Considerations

- Integration via the existing Dxing WhatsApp API (or similar provider's group management API)
- API endpoint for adding participants to a group
- New fields in the registration model:
  - `addedToGroup: Boolean` (default: false)
  - `groupAddedAt: Date`
  - `groupAddError: String` (for logging failures)
- Admin dashboard indicator showing group addition status per registration
- Rate limiting to comply with WhatsApp API group management limits

#### 12.2.6 Workflow

```
Payment Verified → Generate Entry Pass → Send Pass via WhatsApp
                                            │
                                            ▼
                                   Add to WhatsApp Group
                                            │
                                   ┌────────┼────────┐
                                   ▼                  ▼
                               ✅ Success         ❌ Failed
                               (addedToGroup:     (Log error,
                                true)              retry option)
```

---

## 13. Authentication & Security

### 13.1 Admin Authentication

| Aspect | Detail |
|---|---|
| **Login Endpoint** | `POST /api/auth/login` |
| **Credentials** | Username + Password from environment variables |
| **Token Type** | JWT (JSON Web Token) |
| **Token Signing** | HS256 with `JWT_SECRET` from environment |
| **Token Expiry** | Configurable (default: 7 days) |
| **Token Storage** | `localStorage` key: `wes_admin_token` |
| **Token Transmission** | `Authorization: Bearer {token}` header |
| **Role Verification** | JWT payload must contain `role: 'admin'` |
| **Session Validation** | `GET /api/auth/me` endpoint |

### 13.2 Security Measures

- **CORS**: Configurable allowed origins via `CLIENT_ORIGIN` environment variable
- **Rate Limiting**:
  - Login: 20 attempts per 10 minutes per IP
  - Registration: 30 submissions per hour per IP
- **Request Size Limit**: JSON body limited to 100KB
- **File Upload Limits**: 5MB max per file, restricted MIME types
- **X-Powered-By**: Disabled (`app.disable('x-powered-by')`)
- **JWT Middleware**: All admin routes protected by `requireAdmin` middleware
- **Input Sanitization**: Mongoose schema validation, regex escaping for search queries

---

## 14. File Storage & CDN

### 14.1 Provider

- **Service**: DigitalOcean Spaces (S3-compatible object storage)
- **SDK**: AWS SDK v3 (`@aws-sdk/client-s3`)

### 14.2 Configuration

| Variable | Purpose |
|---|---|
| `DO_SPACES_KEY` | Access Key ID |
| `DO_SPACES_SECRET` | Secret Access Key |
| `DO_SPACES_ENDPOINT` | Spaces endpoint URL |
| `DO_SPACES_CDN_ENDPOINT` | CDN endpoint URL |
| `DO_SPACES_BUCKET` | Bucket name |
| `DO_SPACES_FOLDER` | Root folder prefix |

### 14.3 File Organization

```
{DO_SPACES_FOLDER}/
├── payment-screenshots/     # Registration payment proof uploads
│   └── {uuid}.{ext}
├── payment-qr/              # Admin-uploaded UPI QR code images
│   └── {uuid}.{ext}
└── entry-passes/            # Generated entry pass images
    └── {PASS_ID}.png
```

### 14.4 Upload Settings

- **ACL**: `public-read` (files are publicly accessible)
- **Content Type**: Auto-detected
- **File Naming**: UUID-based for payment screenshots/QR images; Pass ID-based for entry passes
- **Cleanup**: QR images are deleted from storage when QR config is deleted

---

## 15. API Endpoints Summary

### 15.1 Public Endpoints (No Authentication)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/registrations/options` | Get dropdown options (industry, stage, scale) |
| `GET` | `/api/registrations/active-qr` | Get currently active payment QR details |
| `POST` | `/api/registrations/` | Submit new registration (multipart form) |

### 15.2 Authentication Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Admin login → returns JWT token |
| `GET` | `/api/auth/me` | Verify current token validity |

### 15.3 Admin Endpoints (JWT Required)

#### Registration Management

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/admin/registrations` | List registrations (search, filter, sort, paginate) |
| `GET` | `/api/admin/registrations/stats` | Get aggregate statistics |
| `GET` | `/api/admin/registrations/export` | Export all registrations as CSV |
| `GET` | `/api/admin/registrations/:id` | Get single registration details |
| `DELETE` | `/api/admin/registrations/:id` | Delete a registration |
| `PATCH` | `/api/admin/registrations/:id/verify-payment` | Mark payment as verified |
| `POST` | `/api/admin/registrations/:id/generate-pass` | Generate entry pass image |
| `POST` | `/api/admin/registrations/:id/send-pass` | Send entry pass via WhatsApp |

#### Payment QR Management

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/admin/payment-qr` | List all payment QR configs |
| `POST` | `/api/admin/payment-qr` | Create new QR config (multipart) |
| `PATCH` | `/api/admin/payment-qr/:id/activate` | Set as active QR |
| `PATCH` | `/api/admin/payment-qr/:id/deactivate` | Set as inactive |
| `DELETE` | `/api/admin/payment-qr/:id` | Delete QR config + cleanup image |

#### Check-In Management

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/admin/check-in/:passId` | Scan and check in a pass |
| `GET` | `/api/admin/check-ins` | List checked-in attendees |
| `GET` | `/api/admin/check-ins/stats` | Get check-in statistics |
| `GET` | `/api/admin/check-ins/export` | Export check-ins as CSV |

---

## 16. Data Models

### 16.1 Registration Model

```
Collection: registrations

{
  fullName:           String     (required, max 120)
  age:                Number     (required, 10–120)
  whatsappNumber:     String     (required, max 20)
  email:              String     (required, lowercase, max 200)
  district:           String     (required, max 100)
  paymentScreenshot:  String     (required, CDN URL)
  paymentVerified:    Boolean    (default: false)
  entryPassGenerated: Boolean    (default: false)
  entryPassId:        String     (unique 8-char ID, sparse index)
  entryPassUrl:       String     (CDN URL)
  entryPassSentAt:    Date
  ventureName:        String     (required, max 200, default: "N/A")
  industry:           String     (required, enum)
  businessStage:      String     (required, enum)
  businessScale:      String     (required, enum)
  checkedIn:          Boolean    (default: false)
  checkedInAt:        Date
  checkedInBy:        String
  createdAt:          Date       (auto)
  updatedAt:          Date       (auto)
}
```

### 16.2 PaymentQR Model

```
Collection: paymentqrs

{
  qrImage:    String     (required, CDN URL)
  upiId:      String     (required, max 100)
  amount:     Number     (required, min 1)
  label:      String     (max 100, default: "")
  isActive:   Boolean    (default: false)
  createdAt:  Date       (auto)
  updatedAt:  Date       (auto)
}

Constraint: Only 1 document can have isActive: true at a time
            (enforced via Mongoose pre-save hook)
```

---

## 17. UI/UX Specifications

### 17.1 Public Website Design

| Aspect | Specification |
|---|---|
| **Design Style** | Modern glassmorphism with dark theme |
| **Primary Color** | Pink/Magenta gradient (#c4187e → #7318c4) |
| **Typography** | Syne (headings), Outfit (body text) |
| **Background** | Dark purple gradient |
| **Cards** | Semi-transparent white fills with backdrop blur and subtle borders |
| **Animations** | GSAP ScrollTrigger for scroll-based reveals, continuous float animations |
| **Smooth Scroll** | Lenis library with lerp: 0.08, duration: 1.2 |
| **Responsive** | Full mobile/tablet/desktop responsive design |
| **Icons** | Lucide React icon library |

### 17.2 Admin Dashboard Design

| Aspect | Specification |
|---|---|
| **Design Style** | Clean, minimal, glass-card aesthetic |
| **Background** | White-based with subtle glass effects |
| **Layout** | Fixed header, scrollable content area |
| **Typography** | System fonts with uppercase tracking for labels |
| **Components** | Custom CSS with `.glass`, `.pill`, `.input` utility classes |
| **Responsiveness** | Desktop-optimized with mobile adaptations |

### 17.3 Gate Scanner Design

| Aspect | Specification |
|---|---|
| **Design Style** | Compact, mobile-first layout |
| **Focus** | Large scanner viewfinder, prominent result display |
| **Interaction** | Single-tap actions, haptic feedback |
| **Colors** | Status-based color coding (green/red/yellow/gray) |

---

## 18. Deployment & Hosting

### 18.1 Frontend Deployment (Netlify)

- **Build Command**: `npm run build` (runs TypeScript compilation + Vite build)
- **Publish Directory**: `dist/`
- **Redirects**: All routes redirect to `/index.html` (SPA routing)
- **Configuration**: `netlify.toml` with redirect rules

### 18.2 Backend Deployment

- **Start Command**: `node server.js`
- **Dev Command**: `nodemon server.js`
- **Port**: Configurable via `PORT` env (default: 5000)

### 18.3 Required Environment Variables (Backend)

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `JWT_EXPIRES_IN` | Token expiry duration (default: 7d) |
| `ADMIN_USERNAME` | Admin login username |
| `ADMIN_PASSWORD` | Admin login password |
| `CLIENT_ORIGIN` | Allowed CORS origins (comma-separated) |
| `DO_SPACES_KEY` | DigitalOcean Spaces access key |
| `DO_SPACES_SECRET` | DigitalOcean Spaces secret key |
| `DO_SPACES_ENDPOINT` | Spaces endpoint URL |
| `DO_SPACES_CDN_ENDPOINT` | Spaces CDN URL |
| `DO_SPACES_BUCKET` | Spaces bucket name |
| `DO_SPACES_FOLDER` | Folder prefix in bucket |
| `DXING_API_KEY` | Dxing WhatsApp API key |
| `DXING_INSTANCE_ID` | Dxing WhatsApp instance ID |
| `PORT` | Server port (default: 5000) |

### 18.4 Required Environment Variables (Frontend)

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend API base URL |

---

## 19. Rate Limiting & Protection

| Endpoint | Limit | Window |
|---|---|---|
| `POST /api/auth/login` | 20 requests | Per 10 minutes per IP |
| `POST /api/registrations/` | 30 requests | Per 1 hour per IP |
| JSON body parsing | 100KB max | Per request |
| File uploads | 5MB max | Per file |

---

## 20. Non-Functional Requirements

### 20.1 Performance

- Frontend build is optimized via Vite (code splitting, tree shaking, minification)
- Smooth 60fps animations via GSAP with `lagSmoothing(0)`
- Lazy image loading where applicable
- Backend uses MongoDB aggregation pipelines for efficient stats

### 20.2 Scalability

- Stateless JWT auth enables horizontal backend scaling
- CDN-hosted static assets (Netlify) and user uploads (DO Spaces)
- Database indexes on search fields for query performance

### 20.3 Reliability

- Graceful error handling on both frontend and backend
- Toast notifications for all user-facing actions
- Auto-logout on 401 responses
- File cleanup on resource deletion

### 20.4 Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile-optimized responsive design
- Camera API support required for Gate Scanner feature

### 20.5 Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard-navigable forms
- Focus management in modal dialogs

---

*This document covers the complete functional requirements of the Women Entrepreneurs Summit (WES) web application as of the current implementation, including the upcoming WhatsApp Group Integration feature marked for future development.*

---

**Prepared by**: D4DX  
**Document Version**: 1.0  
**Last Updated**: 12 May 2026
