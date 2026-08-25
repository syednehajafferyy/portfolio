# 🚀 Syed - Full Stack Developer Portfolio

A modern, highly interactive, and responsive web application portfolio built with **Next.js 14**, **React**, **GSAP animations**, **Pure CSS Modules**, and a **custom Backend API with a protected Admin Control Panel**.

![Next.js](https://img.shields.io/badge/Next.js-14.1-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript)
![CSS3](https://img.shields.io/badge/CSS3-Vanilla_CSS-blue?style=for-the-badge&logo=css3)

---

## ✨ Features

- **🎨 Modern Aesthetic Design**: Sleek dark mode theme, vibrant gradient accents, glassmorphism UI elements, and smooth GSAP animations.
- **🛠️ Protected Admin Control Panel (`/admin`)**: Built-in backend dashboard allowing dynamic real-time management of all portfolio content without touching code.
- **📁 Drag & Drop Image Uploader**: Easily upload project previews and media directly from your PC into the admin panel.
- **💼 Work Experience Timeline**: Dynamic showcase of work history and experience.
- **🚀 My Projects Showcase**: Interactive Swiper carousel linking directly to project repositories.
- **⚡ Custom Backend API**: Next.js App Router API handlers (`/api/metadata`, `/api/skills`, `/api/companies`, `/api/works`, `/api/upload`, `/api/auth`).
- **📱 100% Fully Responsive**: Optimized for mobile, tablet, desktop, and ultra-wide displays.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI & Logic**: React 18, ES6+ JavaScript
- **Styling**: Pure CSS Modules, Custom Design Tokens
- **Animations**: GSAP (GreenSock), Swiper.js, Lenis Smooth Scroll
- **Backend & Database**: Next.js Route Handlers, Node.js FileSystem JSON Store, JWT Cookie Sessions
- **Media Handling**: Native Multipart FormData File Upload API

---

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) installed on your machine.

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   - **Public Website**: [http://localhost:3000](http://localhost:3000)
   - **Admin Control Panel**: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🔐 Admin Panel Credentials

To access the admin control panel and update your portfolio data dynamically:

- **URL**: `http://localhost:3000/admin`
- **Username**: `admin`
- **Password**: `admin123`

---

## 📁 Project Structure

```text
├── app/
│   ├── admin/            # Protected Admin Dashboard routes (/admin, /admin/works, etc.)
│   ├── api/              # Backend API Route Handlers (/api/works, /api/upload, etc.)
│   └── page.js           # Main Portfolio Home Page
├── components/
│   ├── Blocks/           # Page sections (Hero, SkillSet, Experience, Resume, Gallery)
│   ├── UI/               # Reusable UI components & animations
│   └── Admin/            # Drag & Drop Image Uploader component
├── database/             # JSON data storage (metadata.json, Companies.json, Works.json)
├── lib/                  # Backend utilities (db.js, auth.js)
└── public/               # Static assets & user uploaded images (/uploads)
```

---

## 👨‍💻 Author

**Syed**  
*Full Stack & Creative Developer*

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
