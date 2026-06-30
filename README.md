# Weather Agent - MCP Server with AI Tools

A Model Context Protocol (MCP) server exposing AI-callable tools (weather, products, posts, and SQL queries) with a LangGraph tool-calling agent and a SQLite-backed database.

## 🚀 Features

- **MCP Server** built with `@modelcontextprotocol/sdk`
- **Tool-calling agent** integration (LangGraph)
- Custom tools:
  - `getWeather` – fetches weather data
  - `getProducts` – retrieves product information
  - `fetchPosts` – fetches posts data
  - `query_sql` – runs **read-only (SELECT only)** queries against the local SQLite database
- SQLite database (`better-sqlite3`) for persistence
- Frontend client interface

### A note on `query_sql`

This tool intentionally restricts execution to `SELECT` statements only. The original design allowed arbitrary SQL (including `INSERT`/`UPDATE`/`DELETE`/`DROP`) to be run directly from agent input, which is unsafe to expose to an LLM-driven caller. The tool now validates the incoming query and rejects anything that isn't a read query, returning `isError: true` with an explanation.

## 🛠️ Tech Stack

- **Backend:** Node.js, TypeScript
- **MCP:** `@modelcontextprotocol/sdk`
- **Database:** SQLite
- **Frontend:** HTML/CSS/JS

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/TairHizmi/Weather-Agent.git
cd Weather-Agent

# Install root dependencies
npm install

# Install MCP server dependencies
cd mcp
npm install
```

## ⚙️ Configuration

1. Copy `.env.example` to `.env` in the project root:
   ```bash
   cp .env.example .env
   ```
2. Fill in your own API keys in `.env`

## ▶️ Running the Project

```bash
# Run the MCP server
cd mcp
node index.js
```

## 📁 Project Structure

```
Weather-Agent/
├── public/             # Frontend static files
│   └── index.html
├── tools/              # MCP tool implementations (TypeScript)
│   ├── fetchPosts.ts
│   ├── getProducts.ts
│   └── getWeather.ts
├── mcp/                # MCP server runtime
│   ├── index.js        # Server entry point (tools registration, SQLite setup)
│   ├── package.json
│   └── data.db          # SQLite database (gitignored)
├── index.ts             # Main project entry point
├── .env.example          # Environment variables template
└── tsconfig.json
```

## 📝 About This Project

This project was built as part of hands-on learning in building AI agents with tool-calling capabilities, demonstrating MCP server architecture and integration with LangGraph-based agents.

## 👤 Author

Tair Shimonov