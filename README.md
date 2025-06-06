# Personal Blog

Source code for my personal blog: https://lexuancuong.github.io/blog/

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Markdown Processing**: react-markdown with syntax highlighting
- **Styling**: CSS with light/dark theme support

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- Yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd BLOG
```

2. Install dependencies:
```bash
yarn install
```

### Development

Start the development server:
```bash
yarn dev
```

The blog will be available at `http://localhost:5173` (or another port if 5173 is busy).

### Available Scripts

- `yarn dev` - Start development server with hot reload
- `yarn build` - Build for production (includes TypeScript compilation)
- `yarn preview` - Preview the production build locally

### Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── layout/         # Header, Footer components
│   │   └── pages/          # Page components (Post, PostList)
│   ├── main.tsx            # Application entry point
│   └── main.css            # Global styles
├── public/
│   ├── css/                # Theme-specific CSS files
│   │   ├── main-light.css  # Light theme
│   │   └── main-dark.css   # Dark theme
│   └── posts/              # Blog post markdown files
│       └── YYYY/MM/        # Organized by year/month
└── index.html              # HTML template
```

### Adding New Blog Posts

1. Create a new markdown file in `public/posts/YYYY/MM/filename.md`
2. Follow the existing file structure and naming convention
3. The post will be automatically available at `/blog/YYYY/MM/filename`

### Features

- 📱 Responsive design
- 🌙 Dark/Light theme toggle
- 🎨 Syntax highlighting for code blocks
- 📝 Markdown support with GitHub Flavored Markdown
- 🔗 Client-side routing
- ⚡ Fast development with Vite hot reload

### Deployment

The project is configured for GitHub Pages deployment with the base path `/blog/`. The build process automatically creates a 404.html file for proper client-side routing support.
