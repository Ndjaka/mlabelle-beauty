# Design Tokens & Structure - Artisanal Luxe (Mlabelle Beauty)

## Brand Philosophy
- **Artisanal French Beauty**: Sophisticated, warm, Parisian atelier.
- **Minimalist & Tactile**: Expansive whitespace, ultra-fine lines, metallic accents.

## Colors
| Token | Hex | Usage |
| :--- | :--- | :--- |
| `background` / `surface` | `#fff8f0` | Global background, Card backgrounds |
| `primary` | `#615e58` |  |
| `rose-gold` | `#B8974A` | Accents, borders, highlights |
| `on-surface` | `#1e1b15` | Main text (Ink Black) |
| `on-surface-variant` | `#49473f` | Secondary text |
| `inverse-surface` | `#333029` | Dark button backgrounds |
| `inverse-on-surface`| `#f7f0e5` | Text on dark buttons |
| `outline-variant` | `#cbc6bc` | Borders |

## Typography
| Token | Font Family |
| :--- | :--- |
| `h1` | `Noto Serif` (48px, 400, -0.02em) |
| `h2` | `Noto Serif` (36px, 400, -0.01em) |
| `h3` | `Noto Serif` (24px, 400, 0em) |
| `body-lg` | `Manrope` (18px, 400, 0.01em) |
| `body-md` | `Manrope` (16px, 400, 0.01em) |
| `label-caps`| `Manrope` (12px, 600, 0.15em uppercase) |

## Layout Structure

### Top Navigation
- **Mobile**: `header class="bg-stone-50 dark:bg-stone-950 docked full-width top-0 border-b border-b-[0.5px] border-amber-700/30 flat no shadows flex justify-between items-center w-full px-6 py-4 sticky z-50"`
  - Logo: `text-lg font-serif tracking-[0.2em] uppercase text-stone-900` + `h-px w-8 bg-rose-gold mt-1`
  - Button: `bg-inverse-surface text-inverse-on-surface font-label-caps text-[12px] px-6 py-2 rounded hover:bg-rose-gold transition-colors duration-300 uppercase tracking-widest`
- **Desktop**: `nav class="w-full bg-[#F5F0E8] border-b border-[#E5DED3] sticky top-0 z-50"`
  - Container: `flex justify-between items-center w-full px-20 py-6 max-w-[1440px] mx-auto`
  - Logo: `font-['Noto_Serif'] text-2xl font-light tracking-tighter text-stone-900`
  - Button: `bg-on-surface text-on-primary font-label-caps text-label-caps px-6 py-3 rounded-none hover:bg-opacity-90 transition-all border border-on-surface`

### Main Content
- **Container**: `w-full max-w-[1200px] mx-auto px-[24px] md:px-[80px] py-[48px] md:py-[80px]`
- **Header**: `text-center mb-[48px] md:mb-[80px] max-w-2xl mx-auto`
  - Title: `font-h1 text-h1 text-on-surface mb-sm` (Desktop) / `font-h2 text-h2 text-on-surface mb-xs` (Mobile)
  - Subtitle: `font-body-lg text-body-lg text-on-surface-variant` (Desktop) / `font-body-md text-body-md text-on-surface-variant` (Mobile)

### Services Grid/List
- **Container**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]`
- **Card**: `bg-[#fff8f0] border border-[#B8974A]/20 md:border-[#B8974A]/30 rounded-lg md:rounded-none flex flex-col group hover:border-[#B8974A]/60 md:hover:border-[#B8974A] transition-colors duration-300 md:duration-500 p-[24px] md:p-[48px] shadow-sm md:shadow-none hover:shadow md:hover:shadow-none`
- **Category Badge**: 
  - Mobile: `font-sans text-[11px] tracking-[0.2em] text-[#B8974A] border border-[#B8974A]/40 px-3 py-1.5 rounded-full uppercase font-semibold`
  - Desktop: `font-sans text-[12px] tracking-[0.15em] text-[#B8974A] uppercase font-semibold`
- **Title Block**:
  - Flex container (Mobile): `flex justify-between items-start mb-[8px]`
  - Title: `font-serif text-[24px] text-[#1e1b15]`
  - Mobile Price: `font-serif text-[24px] text-[#B8974A] whitespace-nowrap block md:hidden`
- **Description**: `font-sans text-[16px] text-[#49473f] mb-[24px] md:mb-[48px] flex-grow md:w-3/4 lg:w-full`
- **Bottom Info**: `flex items-center justify-between mt-auto pt-[16px] md:pt-[24px] border-t border-[#B8974A]/20`
  - Duration: `flex items-center text-[#49473f] gap-[4px]`
  - Desktop Price: `hidden md:block font-sans text-[18px] font-medium text-[#1e1b15]`
  - Mobile Button: `bg-[#333029] text-[#f7f0e5] font-sans text-[12px] font-semibold tracking-[0.15em] uppercase px-[16px] py-[8px] rounded hover:bg-[#B8974A] transition-colors duration-300 md:hidden`
  - Desktop Button: `hidden md:block w-full bg-[#1e1b15] text-white font-sans text-[12px] font-semibold tracking-[0.15em] uppercase py-[16px] hover:bg-opacity-90 transition-colors text-center mt-[16px]`

### Footer (Desktop only)
- **Container**: `w-full border-t mt-20 border-[#E5DED3] bg-[#F5F0E8]`
- **Content**: `flex flex-col items-center gap-8 w-full px-20 py-12 text-center max-w-[1440px] mx-auto`
