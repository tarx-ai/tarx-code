<div align="center">

# TARX CODE

**AI-powered coding assistant powered by TARX SuperComputer**

[![VS Code](https://img.shields.io/badge/VS%20Code-Extension-blue?logo=visualstudiocode)](https://github.com/tarx-ai/tarx-code)
[![License](https://img.shields.io/badge/License-Apache%202.0-green.svg)](./LICENSE)

</div>

---

## What is TARX CODE?

TARX CODE brings the power of the **TARX SuperComputer** directly into VS Code.

An AI coding assistant that helps you code faster, refactor smarter, and debug with confidence.

---

## Getting Started

1. **Download TARX** from [tarx.com/download](https://tarx.com/download)
2. **Install TARX CODE** extension in VS Code
3. **Start the TARX desktop app**
4. **Open TARX CODE** panel and start coding

---

## Features

### Agentic Coding
TARX CODE analyzes your request, explores your code, and presents a clear plan. It breaks down complex tasks, asks clarifying questions, and outlines its approach before writing code.

### Deep Codebase Intelligence
Starts with broad context and explores deeply where needed. Before making changes, it performs targeted exploration to ensure actions align with your architecture.

### Terminal Integration
Execute commands directly in your terminal and monitor output. Install packages, run build scripts, deploy applications — all while adapting to your dev environment.

### File Operations
Create and edit files with diff previews. Review and approve changes before they're applied. All modifications recorded in Timeline for easy rollback.

### MCP Tools
Extend capabilities with the Model Context Protocol. Connect to databases, APIs, or build custom tools for your workflow.

### Checkpoints
Snapshot your workspace at each step. Compare diffs and restore to any point. Safely explore different approaches without losing progress.

---

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `tarxCode.apiUrl` | `http://localhost:11435` | TARX SuperComputer API endpoint |
| `tarxCode.enableCloudFallback` | `false` | [Enterprise] Enable cloud fallback |
| `tarxCode.model` | `tx-16g` | Model to use |

---

## Build from Source

```bash
# Clone
git clone https://github.com/tarx-ai/tarx-code
cd tarx-code

# Install dependencies
npm run install:all
npm run protos

# Build
npm run package

# Install VSIX
code --install-extension tarx-code-*.vsix
```

---

## License

[Apache 2.0 © 2025 TARX](./LICENSE)

---

<div align="center">
<sub>Powered by TARX SuperComputer</sub>
</div>
