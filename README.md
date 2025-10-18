# 🌿 Stachio — Official Website

> The official landing page for **Stachio**, your trusted Discord safety & moderation bot.  
> Built with **Next.js** and **TailwindCSS** for a clean, performant, and responsive experience.

---

## ✨ Features

- 🎨 Dual-tone theme powered by **#aac49b** and complementary accents
- 📱 Fully responsive layout for desktop & mobile
- ⚡ Smooth, custom-built animations
- 🛡️ Safety-focused command categories
- 🌙 Dark mode with glass-blur UI effects
- 🔄 Animated page transitions
- 📊 Live GitHub statistics integration
- 💫 Modern, minimal design language

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/John-online/stachio-web

# Navigate into the project directory
cd stachio-web

# Install dependencies
npm install

# Start the local development server
npm run dev
```

## ⚙️ Customization

### 1. Bot Metadata

The bot’s title, description, and SEO data are handled via the Next.js App Router `metadata` API.
To modify these values, edit the following section inside `src/app/layout.tsx`:

```ts
export const metadata: Metadata = {
  metadataBase: new URL("https://stachio.dk"),
  title: "Stachio - Advanced Discord Safety Bot",
  description:
    "Stachio is an advanced Discord bot focused on safety and security, featuring anti-phishing, automod, content filtering, moderation tools, logging, and more to protect your community.",
  openGraph: {
    images: ["/images/logo.png"],
  },
  twitter: {
    images: ["/images/logo.png"],
  },
};
```

#### To update:

- Edit title and description for new SEO content.
- Replace paths in openGraph.images and twitter.images.
- Update metadataBase if your deployment domain changes.

### 2. Assets

Replace or add images in the `public/images/` directory:

```
public/
└── images/
    ├── logo.png              # Stachio main logo
    └── testimonials/
        └── user.png          # Default testimonial avatar
```

### 3. Theme Configuration

Global theme variables are defined in `src/app/globals.css`.
Adjust the `:root` variables to customize the color palette or UI accents:

```css
:root {
  --background: #0a0a0a;
  --foreground: #ededed;

  --navbar-bg: rgba(0, 0, 0, 0.3);
  --navbar-border: rgba(255, 255, 255, 0.1);
  --navbar-blur: blur(16px);
  --navbar-logo-gradient-from: #aac49b;
  --navbar-logo-gradient-to: #2f3e29;
  --navbar-btn-bg: rgba(170, 196, 155, 0.2);
  --navbar-btn-bg-hover: rgba(170, 196, 155, 0.3);
  --navbar-link: rgba(255, 255, 255, 0.7);
  --navbar-link-hover: #fff;
  --navbar-mobile-bg: rgba(0, 0, 0, 0.5);

  --hero-gradient-from: #2f3e29;
  --hero-gradient-via: #000;
  --hero-gradient-to: #000;
  --hero-logo-bg: #aac49b;
  --hero-btn-gradient-from: #aac49b;
  --hero-btn-gradient-to: #2f3e29;
  --hero-btn-bg: rgba(255, 255, 255, 0.1);
  --hero-btn-bg-hover: rgba(255, 255, 255, 0.2);
  --hero-text: #ededed;
  --hero-text-muted: rgba(255, 255, 255, 0.7);
}
```

## 🗂️ Static Data & JSON Files

All static and structured data used across the project is located in `src/assets/`:

```
src/
└── assets/
    ├── commands.json          # Command definitions for the UI
    ├── features.json          # Feature showcase data
    ├── icons/
    │   ├── partner.tsx        # Partner badge icon
    │   └── verified.tsx       # Verified badge icon
    ├── legal/
    │   ├── privacy.md         # Privacy Policy content
    │   └── terms.md           # Terms of Service content
    ├── partners.json          # Partner list configuration
    ├── redirects.json         # Redirect mapping
    ├── testimonials.json      # User testimonial data
    └── trusted.json           # Trusted servers
```

> Developers can modify these JSON and Markdown files to update site content without touching React components.

## 🌍 Links

- [Invite Stachio](https://discord.com/oauth2/authorize?client_id=1374870746006032414)
- [Support Server](https://discord.gg/wSAkewmzAM)
- [Milkshake Collective](https://github.com/MilkshakeCollective)

[![Star Repo](https://img.shields.io/github/stars/John-online/stachio-web?style=social)](https://github.com/John-online/stachio-web)

> 💚 Built with 💖 by **[John](https://github.com/John-online)** for the **[Milkshake Collective](https://github.com/MilkshakeCollective)**
