# Portfolio Website - Aero Afril Drasando

Portfolio website modern yang dibangun menggunakan Next.js 14, React, dan Tailwind CSS dengan fitur prakiraan cuaca real-time dari BMKG API.

## Fitur Utama

- **Modern UI/UX** - Design responsif dengan animasi smooth menggunakan Tailwind CSS
- **Weather Integration** - Prakiraan cuaca real-time dari BMKG API
- **Fully Responsive** - Optimized untuk semua ukuran layar (mobile, tablet, desktop)
- **Performance Optimized** - Fast loading dengan Next.js App Router
- **Interactive Projects Carousel** - Showcase project dengan navigasi yang smooth
- **Skills Section** - Expandable skill cards dengan progress indicators
- **Auto-hide Notifications** - Smart alert system dengan auto-dismiss

## Tech Stack

### Frontend
- **Next.js 14** - React framework dengan App Router
- **React 18** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework

### API Integration
- **BMKG API** - Weather forecast data
- **Next.js API Routes** - Backend API endpoints

### Fonts
- **Bungee** - Display font untuk headers
- **Lilita One** - Logo font
- **Libre Franklin** - Body text font

## Getting Started

This is a Next.js project bootstrapped with `create-next-app`.

### Prerequisites
- Node.js 18 atau lebih tinggi
- npm, yarn, pnpm, atau bun

### Installation

1. **Clone repository**
```bash
git clone https://github.com/aeroafril/portfolio-website.git
cd portfolio-website
```

2. **Install dependencies**
```bash
npm install
# atau
yarn install
# atau
pnpm install
# atau
bun install
```

3. **Run development server**
```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
# atau
bun dev
```

4. **Open browser**

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Build untuk Production

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

## Project Structure

```
portfolio-website/
├── app/
│   ├── page.tsx              # Homepage (Portfolio)
│   ├── cuaca/
│   │   └── page.tsx          # Weather page
│   ├── api/
│   │   └── cuaca/
│   │       └── route.ts      # BMKG API route
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   └── WeatherWidget.tsx     # Weather widget component
├── public/                   # Static assets (images, icons, fonts)
├── tailwind.config.ts        # Tailwind configuration
├── next.config.ts            # Next.js configuration
└── package.json
```

## Fitur Detail

### 1. Homepage
- Hero section dengan gradient background
- About Me section dengan foto profil
- Projects carousel dengan smooth navigation
- Skills section dengan expandable framework/library details
- Contact section dengan social media links
- Responsive navbar dengan auto-hide on scroll

### 2. Weather Page
- Real-time weather forecast dari BMKG API
- Day selector untuk melihat prakiraan beberapa hari
- Detailed weather information:
  - Temperature
  - Humidity
  - Wind speed & direction
  - Cloud coverage
  - Precipitation
  - Visibility
- Auto-refresh functionality
- Loading states & error handling

### 3. Components
- **ProjectCard** - Interactive project showcase dengan zoom feature
- **MobileProjectScroll** - Smooth carousel navigation
- **WeatherWidget** - Floating weather widget (jika digunakan)

## Customization

### Mengganti Data Projects

Edit array `projects` di `app/page.tsx`:

```typescript
const projects: Project[] = [
  {
    title: "Project Title",
    desc: "Project description",
    link: "https://github.com/username/repo",
    tech: ["Tech1", "Tech2"],
    color: "blue-950",
    icon: "/project-image.png"
  },
  // tambahkan project lainnya...
];
```

### Mengganti Skills

Edit array `skills` di `app/page.tsx`:

```typescript
const skills: Skill[] = [
  { 
    name: "Skill Name", 
    icon: "/skill-icon.png", 
    level: 90,
    subSkills: [
      { name: "Framework", icon: "/icon.png", level: 80 },
    ]
  },
  // tambahkan skills lainnya...
];
```

### Mengubah Warna Theme

Edit file `tailwind.config.ts` atau langsung di className components untuk mengubah color scheme.

## API Routes

### Weather API
**Endpoint:** `/api/cuaca`

Mengambil data prakiraan cuaca dari BMKG API untuk lokasi tertentu (default: Surabaya).

**Response:**
```json
{
  "lokasi": {
    "provinsi": "string",
    "kotkab": "string",
    "kecamatan": "string",
    "desa": "string",
    "lon": number,
    "lat": number
  },
  "data": [...]
}
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Deploy Steps:
1. Push code ke GitHub repository
2. Import project di Vercel
3. Configure build settings (otomatis terdeteksi untuk Next.js)
4. Deploy!

## Contact

**Aero Afril Drasando**
- Email: aeroafril@gmail.com
- Instagram: [@ar_frildo](https://www.instagram.com/ar_frildo/)
- GitHub: [@aeroafril](https://github.com/aeroafril)
- LinkedIn: [aeroafril](https://www.linkedin.com/in/aeroafril)

## License

Copyright © 2026 - Aero Afril

---

⭐ Star this repository if you find it helpful!
