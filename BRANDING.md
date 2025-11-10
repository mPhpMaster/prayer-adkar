# 🎨 ADHKAR Branding Guide

## App Identity

### Name
**ADHKAR - أذكار**

- **Primary Name**: ADHKAR (English)
- **Arabic Name**: أذكار
- **Full Name**: ADHKAR - أذكار
- **Former Name**: Dhikr Counter (deprecated)

### Meaning
"أذكار" (Adhkar) is the plural of "ذكر" (Dhikr) in Arabic, meaning "remembrances" or "invocations" - referring to Islamic prayers and supplications.

---

## App Icon

### Icon Details
- **Format**: SVG (Scalable Vector Graphics)
- **Source**: Prayer/Prayer Beads icon
- **URL**: https://wagrmmbkukwblfpfxxcb.supabase.co/storage/v1/object/public/web-img/prayer-icon.svg
- **Location**: `/public/prayer-icon.svg`
- **Theme**: Islamic prayer beads (Tasbih/Misbaha)

### Icon Usage
```html
<!-- Favicon -->
<link rel="icon" type="image/svg+xml" href="prayer-icon.svg" />

<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" href="prayer-icon.svg" />

<!-- Manifest -->
{
  "icons": [
    {
      "src": "prayer-icon.svg",
      "sizes": "any",
      "type": "image/svg+xml"
    }
  ]
}
```

### Icon Display
- **Loading Screen**: 80×80px with shadow
- **Favicon**: Browser tab icon
- **PWA Icon**: Home screen icon
- **Manifest**: App launcher icon

---

## Color Palette

### Primary Colors
```css
--primary-teal: #0a7e8c;      /* Main brand color */
--accent-cyan: #4dd0e1;       /* Highlight color */
--background: #f0f4f8;        /* App background */
```

### Secondary Colors
```css
--orange: #ff9800;            /* Reset actions */
--green: #4caf50;             /* Success/Stats */
--red: #e53935;               /* Delete/Warning */
--gold: #ffd54f;              /* Achievements */
```

### Text Colors
```css
--text-dark: #333333;         /* Primary text */
--text-light: #666666;        /* Secondary text */
--text-white: #ffffff;        /* On dark backgrounds */
--text-cyan: #b3e5fc;         /* Subtle text */
```

---

## Typography

### Font Families
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 
             'Fira Sans', 'Droid Sans', 'Helvetica Neue',
             'Noto Sans Arabic', 'Arial', sans-serif;
```

### Font Sizes
| Element | Size (Normal) | Size (Small) |
|---------|---------------|--------------|
| App Title | 32px | 26px |
| Section Title | 22px | 18px |
| Counter | 80px | 64px |
| Button | 40px | 32px |
| Body Text | 16px | 14px |

### Font Weights
- **Bold**: 700 (Titles, buttons)
- **Semi-bold**: 600 (Labels)
- **Medium**: 500 (Subtitles)
- **Regular**: 400 (Body text)

---

## Logo Variations

### Primary Logo
```
ADHKAR - أذكار
```

### Arabic Only
```
أذكار
```

### English Only
```
ADHKAR
```

### With Icon
```
[Icon] ADHKAR - أذكار
```

### Thai Version
```
ADHKAR - อัซการ์
```

---

## Loading Screen

### Layout
```
╔════════════════════════╗
║                        ║
║    [Prayer Icon]       ║ ← 80×80px
║                        ║
║    [Spinner]           ║ ← Animated
║                        ║
║   ADHKAR - أذكار       ║ ← Brand name
║   ✨ جاري التحميل...   ║ ← Loading text
║                        ║
╚════════════════════════╝
```

### Colors
- Background: Gradient (#0a7e8c to #4dd0e1)
- Icon: White with shadow
- Text: White
- Spinner: White border with teal top

---

## Meta Tags

### HTML Meta
```html
<meta name="description" content="ADHKAR - أذكار | تطبيق عداد الأذكار والتسبيح" />
<meta name="keywords" content="ADHKAR, أذكار, تسبيح, dhikr, tasbih, islamic, prayer counter" />
<meta name="theme-color" content="#0a7e8c" />
<title>ADHKAR - أذكار</title>
```

### Open Graph
```html
<meta property="og:title" content="ADHKAR - أذكار" />
<meta property="og:description" content="Islamic prayer counter app" />
<meta property="og:image" content="prayer-icon.svg" />
<meta property="og:type" content="website" />
```

### Twitter Card
```html
<meta name="twitter:card" content="summary" />
<meta name="twitter:title" content="ADHKAR - أذكار" />
<meta name="twitter:description" content="Keep track of your daily prayers" />
<meta name="twitter:image" content="prayer-icon.svg" />
```

---

## PWA Manifest

### Configuration
```json
{
  "name": "ADHKAR - أذكار",
  "short_name": "ADHKAR",
  "description": "Islamic prayer counter app",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a7e8c",
  "theme_color": "#0a7e8c",
  "orientation": "portrait",
  "icons": [
    {
      "src": "prayer-icon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ],
  "categories": ["lifestyle", "productivity", "health"],
  "lang": "ar",
  "dir": "rtl"
}
```

---

## App Header

### Design
```
╔════════════════════════════════╗
║  ADHKAR - أذكار                ║ ← Title (32px bold)
║  احفظ أورادك اليومية بسهولة   ║ ← Subtitle (16px)
╚════════════════════════════════╝
Background: #0a7e8c
Text: White
Border Radius: 30px (bottom)
```

### Multi-Language Headers

**Arabic:**
```
ADHKAR - أذكار
احفظ أورادك اليومية بسهولة
```

**English:**
```
ADHKAR
Keep track of your daily prayers
```

**Thai:**
```
ADHKAR - อัซการ์
บันทึกการภาวนาประจำวันของคุณ
```

---

## Brand Voice

### Tone
- **Respectful**: Islamic app, maintain respect
- **Simple**: Easy to understand
- **Friendly**: Welcoming and warm
- **Supportive**: Encouraging daily practice

### Language Style
- **Clear**: No complex jargon
- **Concise**: Brief, to the point
- **Multilingual**: AR, EN, TH support
- **Inclusive**: For all Muslim users

---

## Design Principles

### 1. Simplicity
- Clean interface
- Minimal distractions
- Clear hierarchy

### 2. Accessibility
- Large touch targets
- High contrast
- RTL/LTR support

### 3. Beauty
- Modern aesthetics
- Smooth animations
- Thoughtful colors

### 4. Functionality
- Fast performance
- Offline-first
- Data persistence

---

## File Structure

```
/workspace/
├── public/
│   ├── prayer-icon.svg      ← App icon
│   ├── manifest.json         ← PWA manifest
│   └── index.html            ← HTML with branding
├── App.js                    ← Main app with header
├── languages.js              ← Translated names
├── app.json                  ← App config
└── package.json              ← Package info
```

---

## Branding Checklist

### ✅ Completed
- [x] App renamed to ADHKAR
- [x] Icon downloaded and integrated
- [x] Favicon added
- [x] Loading screen with icon
- [x] PWA manifest created
- [x] Meta tags updated
- [x] Header styled
- [x] All languages updated
- [x] Documentation updated

### 🎨 Visual Elements
- [x] App icon (SVG)
- [x] Loading screen
- [x] Header design
- [x] Color scheme
- [x] Typography

### 📱 Technical
- [x] package.json updated
- [x] app.json updated
- [x] index.html updated
- [x] manifest.json created
- [x] Build successful

---

## Brand Assets

### Icon File
- **File**: `prayer-icon.svg`
- **Size**: Scalable (SVG)
- **Format**: Vector graphics
- **Colors**: Monochrome/adaptable

### Screenshots (To Be Added)
- Home screen
- Counter view
- Statistics view
- Language selector
- All three languages

---

## Usage Guidelines

### DO ✅
- Use "ADHKAR - أذكار" as full name
- Display icon prominently
- Maintain color palette
- Keep design clean
- Support all languages

### DON'T ❌
- Don't use old name "Dhikr Counter"
- Don't modify icon colors drastically
- Don't change core brand colors
- Don't clutter interface
- Don't break RTL support

---

## Version History

### v1.0.0 - Initial Brand
- Original name: "Dhikr Counter"
- Basic design
- Single language

### v2.0.0 - Current Brand
- **New name**: ADHKAR - أذكار
- **New icon**: Prayer beads SVG
- **Multi-language**: AR, EN, TH
- **Modern design**: Updated UI/UX
- **PWA support**: Manifest and meta tags

---

## Marketing Copy

### Short Description
"ADHKAR - أذكار: Islamic prayer counter app"

### Long Description
```
ADHKAR (أذكار) is a beautiful, easy-to-use Islamic app for 
counting your daily prayers and dhikr. Track Subhan Allah, 
Alhamdulillah, Allahu Akbar, and more. Available in Arabic, 
English, and Thai.

Features:
• Beautiful card-based selection
• Separate statistics page
• Multi-language support
• Offline functionality
• Smooth animations
• Data persistence
```

### Keywords
ADHKAR, أذكار, dhikr, tasbih, Islamic app, prayer counter, 
Muslim app, tasbeeh, zikr, remembrance, supplication

---

## Social Media

### Hashtags
`#ADHKAR #أذكار #IslamicApp #Dhikr #Tasbih #PrayerCounter`

### Social Posts
**English:**
"Track your daily dhikr with ADHKAR - a beautiful prayer counter app! 🕌"

**Arabic:**
"احفظ أورادك اليومية مع تطبيق أذكار - عداد أذكار جميل وسهل! 🕌"

**Thai:**
"จดจำการภาวนาของคุณด้วย ADHKAR - แอปนับซิกร์ที่สวยงาม! 🕌"

---

**ADHKAR - أذكار**
*Your daily prayer companion* 🕌

Made with ❤️ for the Muslim community
