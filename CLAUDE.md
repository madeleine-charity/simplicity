# Guide to this Repository

A minimal, artsy personal website with a decision tree navigation experience. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Project Overview

This website contrasts with infinite scroll social media by serving **one piece of content at a time**. Users navigate through a decision tree to select what type of content they want to see, then view a randomly selected piece from that category.

### User Flow
1. **Decision Tree**: Users click through choices (written/visual → subcategories)
2. **Content Display**: A single piece of content is shown with proper markdown rendering
3. **[fin] Banner**: Click to restart and explore again

### Decision Tree Structure
```
start
├── written
│   ├── fiction
│   │   ├── long → content/fiction-long/
│   │   └── short → content/fiction-short/
│   └── non-fiction
│       ├── long → content/non-fiction-long/
│       └── short → content/non-fiction-short/
└── visual
    ├── moving
    │   ├── video → content/video/
    │   └── abstract → content/abstract-moving/
    └── still
        ├── photo → content/photo/
        └── abstract → content/abstract-still/
```

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Font**: Lora (Google Fonts)
- **Markdown**: react-markdown for rendering

## Project Structure

```
/src
  /app
    /api
      /content/[category]/route.ts  # API to fetch random content
    layout.tsx                      # Root layout with fonts
    page.tsx                        # Main page with DecisionTree
    globals.css                     # Global styles and prose classes
  /components
    DecisionTree.tsx                # Main orchestrator with state management
    ChoiceNode.tsx                  # Displays two choices with random colors/positions
    ContentDisplay.tsx              # Renders text/image/video content
    FinBanner.tsx                   # Black [fin] restart banner

/content                            # All content files live here
  /fiction-long/                    # Long fiction (.md files)
  /fiction-short/                   # Short fiction (.md files)
  /non-fiction-long/                # Long non-fiction essays (.md files)
  /non-fiction-short/               # Short non-fiction notes (.md files)
  /video/                           # Video files (.mp4, .webm, .mov)
  /photo/                           # Photo files (.jpg, .png, .gif, .webp)
  /abstract-moving/                 # Abstract video/animation
  /abstract-still/                  # Abstract images

/scripts
  convert-substack.js               # Converts Substack HTML export to markdown
  add-titles.js                     # Adds titles to markdown files
```

## Key Design Decisions

### Color Palette
Choice text uses these colors, randomly assigned:
- Bubblegum Pink: `#ef476f`
- Golden Pollen: `#ffd166`
- Emerald: `#06d6a0`
- Ocean Blue: `#118ab2`
- Dark Teal: `#073b4c`

### Transitions
- Fade transitions between screens use the color of the clicked text
- Clicking [fin] fades to black before restarting
- Choice button positions randomize to prevent hover overlap

### Content Format
- Written content: Markdown files with `# Title` as first line
- Images: Standard formats (jpg, png, gif, webp)
- Videos: Standard formats (mp4, webm, mov)

## Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Adding Content

1. Create a markdown file in the appropriate `/content/` subdirectory
2. Start with `# Title` on the first line
3. Write content in markdown format
4. Commit and push to GitHub, then redeploy

### Markdown Features Supported
- Headers (h1, h2, h3)
- Bold and italic text
- Links
- Blockquotes
- Ordered and unordered lists
- Horizontal rules

## API Routes

### GET /api/content/[category]
Returns a random piece of content from the specified category.

**Response for text:**
```json
{
  "type": "text",
  "content": "# Title\n\nContent here...",
  "filename": "example.md"
}
```

**Response for media:**
```json
{
  "type": "image|video",
  "path": "/content/category/filename.ext",
  "filename": "filename.ext"
}
```

## Content Source

The non-fiction content was imported from x0minerva.substack.com using the Substack export feature and converted to markdown.
