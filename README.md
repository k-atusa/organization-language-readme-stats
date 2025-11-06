# Organization Language README Stats

A web service that generates SVG images of language usage statistics for GitHub organizations that can be embedded in README files.

![Language Stats](https://organization-language-readme-stats.vercel.app/k-atusa)

## Features

- Display most used programming languages in GitHub organizations as a graph
- Generate SVG format for direct embedding in README files
- Clean and simple UI
- Built with Next.js 16 App Router + React + TypeScript
- Fast response with optimized caching

## Usage

### Local Development

1. Install dependencies:
```bash
npm install
```

2. (Optional) Configure GitHub Personal Access Token:

Using a GitHub Personal Access Token is recommended to avoid rate limits.

- Generate a new token at [GitHub Settings > Tokens](https://github.com/settings/tokens)
- Select `public_repo` permission
- Create `.env` file:

```bash
cp .env.example .env
# Open .env file and add your token
GITHUB_TOKEN=your_github_token_here
```

**Rate Limits:**
- Without authentication: 60 requests per hour
- With authentication: 5,000 requests per hour

3. Run development server:
```bash
npm run dev
```

4. Open in browser: `http://localhost:3000`

### SVG Generation API

To generate language statistics SVG for a specific organization:

```
GET /{organization-name}
```

Examples:
- `https://your-domain.com/facebook`
- `https://your-domain.com/google`
- `https://your-domain.com/microsoft`

### Embed in README

Add to your GitHub README:

```markdown
![Language Stats](https://your-domain.com/your-organization)
```

Or using HTML:

```html
<img src="https://your-domain.com/your-organization" alt="Language Stats" />
```

## Project Structure

```
organization-language-readme-stats/
├── app/
│   ├── [organization]/
│   │   └── route.tsx          # SVG generation API endpoint
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page (preview & code generation)
│   └── globals.css            # Global styles
├── lib/
│   └── github.ts              # GitHub API integration
├── types/
│   └── language.ts            # TypeScript type definitions
├── utils/
│   └── colors.ts              # Language color definitions
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Runtime**: Node.js Runtime
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: CSS
- **Output**: SVG

## Highlights

- ✅ Direct embedding in README with SVG format
- ✅ Clean display with minimal design
- ✅ Optimized performance with in-memory caching
- ✅ 1-hour cache duration

## Rate Limit Optimization

For large organizations (e.g., facebook, google) that require querying many repositories, the following optimizations are implemented:

1. **GitHub Personal Access Token** - Increases limit to 5,000 requests per hour
2. **Batch Processing** - Processes repositories in batches of 50
3. **In-Memory Caching** - Caches results for 1 hour
4. **Pagination** - Queries up to 1,000 repositories
5. **Fork Exclusion** - Excludes forked repositories from statistics

## TODO

- [x] Integrate GitHub API to fetch real organization data
- [x] Calculate language bytes and percentages
- [x] Optimize rate limits
- [x] Implement in-memory caching
- [ ] Improve error handling
- [ ] Add theme options
- [ ] Advanced caching with Redis

## License

MIT License
