# TARX CODE Changelog

TARX CODE – AI-powered coding assistant built on the TARX SuperComputer.
Local-first, privacy-focused, no cloud dependencies by default.

---

## [1.0.0] – January 20, 2026 (Initial Public MVP Release)

### Added
- Full TARX branding & UI takeover (header, footer, sidebar components from TARX app)
- SuperComputer integration (local llama-server + optional distributed compute routing)
- TARX desktop app requirement check + clean "TARX Required" onboarding card
- Status badge showing "Connected to SuperComputer" or connection state
- Configurable endpoints, model selection, and SuperComputer toggle in VS Code settings
- Basic prompt-to-code flow (generate, refactor, debug) using local inference
- Agentic coding with deep codebase understanding
- Terminal integration and file operations
- MCP tools for extended capabilities
- Checkpoints for safe exploration

### Fixed
- Removed all legacy references from UI, manifest, and activation messages
- Ensured TARX icon displays in extension header & VS Code marketplace listing
- Stabilized panel activation ("TARX CODE: Open" command now reliably loads TARX UI)

---

## Development Timeline (Last 2 Months – Internal Evolution)

### December 2025 – January 2026 (Pre-v1.0)
- Forked stable OSS base → began full TARX rebranding & SuperComputer backend swap
- Integrated existing TARX shadcn UI components (sidebar, projects, chat patterns)
- Hardened local inference pipeline (localhost:11435)
- Built early SuperComputer routing logic (complexity-based task distribution)
- Added privacy-first defaults (no cloud, no telemetry, end-to-end encryption for SuperComputer tasks)

### November–December 2025 (Early Prototypes)
- Initial local AI experiments in VS Code (proof-of-concept completion & edits)
- Privacy & offline-first architecture locked in (no data leaves device unless SuperComputer opt-in)
- SuperComputer economics & credit system planning (give what you take = free balanced use)
- Early UI mocks using TARX app components (header, badge, status indicators)

### October–November 2025 (Concept & Foundation)
- Decision to build TARX CODE as VS Code extension plugin (fastest dev adoption path)
- Defined core principles: Local-first, SuperComputer-powered, developer-owned AI
- Started integrating TARX app backend (llama-server, RAG, SuperComputer network)

---

Full history available in repo commits.
TARX CODE evolves with TARX — use it to build TARX itself.
