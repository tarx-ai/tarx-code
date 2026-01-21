# TARX Code Development Workflow

A comprehensive guide for developing, testing, and shipping the unified TARX ecosystem: **TARX Code** (VS Code extension) + **TARX Builder** (Tauri desktop app).

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Repository Setup](#repository-setup)
3. [Building the Extension](#building-the-extension)
4. [Running the TARX App Backend](#running-the-tarx-app-backend)
5. [Development Workflow](#development-workflow)
6. [QA Testing](#qa-testing)
7. [Common Issues & Fixes](#common-issues--fixes)
8. [API Reference](#api-reference)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        VS Code                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              TARX Code Extension                          │  │
│  │  ┌─────────────┐    ┌──────────────┐    ┌─────────────┐  │  │
│  │  │ WelcomeView │───▶│ Health Check │───▶│  Chat UI    │  │  │
│  │  └─────────────┘    └──────────────┘    └─────────────┘  │  │
│  │         │                  │                   │         │  │
│  │         ▼                  ▼                   ▼         │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │           TarxMeshHandler (tarx-mesh provider)      │ │  │
│  │  │  • Default model: tx-16g                            │ │  │
│  │  │  • Endpoints: :11435 (inference), :11436 (mesh)     │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                               │
                               │ HTTP
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     TARX Desktop App                             │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                   Tauri Backend (Rust)                      ││
│  │  ┌───────────────┐  ┌───────────────┐  ┌─────────────────┐ ││
│  │  │ llama-server  │  │   Mesh API    │  │ Embedding Server│ ││
│  │  │   :11435      │  │    :11436     │  │     :11437      │ ││
│  │  │ /health       │  │ /mesh/status  │  │ (RAG support)   │ ││
│  │  │ /v1/chat/...  │  │ /mesh/query   │  │                 │ ││
│  │  └───────────────┘  └───────────────┘  └─────────────────┘ ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### Port Map

| Port | Service | Purpose |
|------|---------|---------|
| 11435 | llama-server | Local LLM inference (OpenAI-compatible) |
| 11436 | Mesh HTTP API | Peer-to-peer network operations |
| 11437 | Embedding Server | RAG embeddings (optional) |

---

## Repository Setup

### Prerequisites

- **Node.js** 18+ (for extension)
- **Rust** 1.70+ (for TARX app)
- **VS Code** 1.85+
- **Tauri CLI** (`cargo install tauri-cli`)

### Clone Repositories

```bash
# Extension
cd ~/Desktop
git clone <tarx-code-repo> tarx-code
cd tarx-code
npm install

# Desktop App
cd ~/Desktop
git clone <tarx-builder-repo> tarx-builder
cd tarx-builder
npm install
```

---

## Building the Extension

### Development Build

```bash
cd ~/Desktop/tarx-code

# Install dependencies
npm install

# Build webview (React UI)
npm run build:webview

# Build extension (TypeScript)
npm run build

# Or build both in one command
npm run build:all
```

### Package VSIX

```bash
# Package for distribution
npm run package

# Output: tarx-code-<version>.vsix
```

### Install in VS Code

```bash
# Install from VSIX
code --install-extension tarx-code-*.vsix

# Or via VS Code UI:
# Extensions → ... → Install from VSIX
```

### Development Mode (Hot Reload)

```bash
# Terminal 1: Watch webview
npm run dev:webview

# Terminal 2: Watch extension
npm run watch

# Press F5 in VS Code to launch Extension Development Host
```

---

## Running the TARX App Backend

### Development Mode

```bash
cd ~/Desktop/tarx-builder

# Start in dev mode (hot reload)
npm run tauri dev
```

### Production Build

```bash
# Build release binary
npm run tauri build

# Output: src-tauri/target/release/TARX.app (macOS)
```

### Verify Backend is Running

```bash
# Health check
curl http://localhost:11435/health
# Expected: {"status":"ok","service":"tarx-mesh-api","version":"0.3.1"}

# Mesh status
curl http://localhost:11436/mesh/status
# Expected: {"running":true,"peer_count":0,...}
```

---

## Development Workflow

### Daily Workflow

1. **Start TARX App first**
   ```bash
   cd ~/Desktop/tarx-builder && npm run tauri dev
   ```

2. **Verify health endpoint**
   ```bash
   curl http://localhost:11435/health
   ```

3. **Start extension dev mode** (separate terminal)
   ```bash
   cd ~/Desktop/tarx-code && npm run dev:webview
   ```

4. **Launch Extension Development Host**
   - Press `F5` in VS Code (with tarx-code open)
   - Extension will auto-connect to TARX app

5. **Make changes → Hot reload**
   - Webview changes: Auto-reload
   - Extension changes: Reload window (`Cmd+R` in dev host)

### Cross-Codebase Changes

When modifying communication between extension and app:

1. **Update app endpoint** (`tarx-builder/src-tauri/src/mesh/http_api.rs`)
2. **Update extension client** (`tarx-code/src/core/api/providers/tarx-mesh.ts`)
3. **Test end-to-end** (run QA script)

---

## QA Testing

### Run Full QA Suite

```bash
cd ~/Desktop/tarx-code
./scripts/qa-test.sh
```

### Manual Testing Checklist

- [ ] Start TARX desktop app
- [ ] Verify health endpoint responds: `curl http://localhost:11435/health`
- [ ] Install extension in VS Code
- [ ] Open extension sidebar
- [ ] Verify "Check Connection" button works
- [ ] Verify connection success animation plays
- [ ] Verify main chat UI loads after connection
- [ ] Send a test prompt
- [ ] Verify streaming response works
- [ ] Test "Download TARX" button (opens browser)

### Connection Flow Test

1. **Start with app NOT running**
   - Extension should show WelcomeView with "TARX Required"
   - Retry countdown should display (5s interval)

2. **Start TARX app**
   - Auto-retry should detect connection
   - Success animation should play
   - Main UI should load

3. **Stop TARX app mid-session**
   - Requests should fail gracefully
   - Error messages should be helpful

---

## Common Issues & Fixes

### Extension: "Check Connection" does nothing

**Cause**: `window.open` doesn't work in VS Code webviews

**Fix**: Use `UiServiceClient.openUrl` instead:
```typescript
import { UiServiceClient } from "@/services/grpc-client"
import { StringRequest } from "@shared/proto/cline/common"

const handleDownload = async () => {
  await UiServiceClient.openUrl(
    StringRequest.create({ value: "https://tarx.com/download" })
  )
}
```

### TARX App: llama-server won't start

**Cause**: Port 11435 already in use

**Fix**:
```bash
# Find process using port
lsof -i :11435

# Kill it
kill -9 <PID>

# Or restart TARX app
```

### Extension: "Cannot connect to TARX"

**Cause**: TARX app not running or wrong port

**Fix**:
1. Verify app is running: `curl http://localhost:11435/health`
2. Check app logs for startup errors
3. Verify firewall isn't blocking localhost

### Build: TypeScript errors

**Fix**:
```bash
# Clean build
rm -rf node_modules dist out
npm install
npm run build:all
```

### Webview: Hot reload not working

**Fix**:
1. Ensure `npm run dev:webview` is running
2. Restart Extension Development Host
3. Check for compilation errors in terminal

---

## API Reference

### Health Endpoint

```
GET http://localhost:11435/health
```

Response:
```json
{
  "status": "ok",
  "service": "tarx-mesh-api",
  "version": "0.3.1"
}
```

### Chat Completion (OpenAI-compatible)

```
POST http://localhost:11435/v1/chat/completions
Content-Type: application/json

{
  "model": "tx-16g",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hello!"}
  ],
  "stream": true,
  "max_tokens": 4096
}
```

### Mesh Status

```
GET http://localhost:11436/mesh/status
```

Response:
```json
{
  "running": true,
  "peer_count": 0,
  "connected_peers": 0,
  "local_peer_id": "12D3KooW...",
  "local_capabilities": {
    "ram_gb": 16.0,
    "has_gpu": true,
    "cpu_cores": 8
  }
}
```

---

## Re-Build Commands Quick Reference

```bash
# Extension - full rebuild
cd ~/Desktop/tarx-code
rm -rf node_modules out dist
npm install
npm run build:all
npm run package

# TARX App - full rebuild
cd ~/Desktop/tarx-builder
rm -rf node_modules src-tauri/target
npm install
npm run tauri build

# QA Test
cd ~/Desktop/tarx-code
./scripts/qa-test.sh
```

---

## Key Files Reference

### Extension (tarx-code)

| File | Purpose |
|------|---------|
| `webview-ui/src/components/welcome/WelcomeView.tsx` | Onboarding/connection UI |
| `src/core/api/providers/tarx-mesh.ts` | TARX API handler |
| `src/shared/api.ts` | Default provider config |
| `webview-ui/src/services/grpc-client.ts` | Webview-to-extension RPC |

### Desktop App (tarx-builder)

| File | Purpose |
|------|---------|
| `src-tauri/src/main.rs` | App entry, command handlers |
| `src-tauri/src/inference_engine.rs` | llama-server lifecycle |
| `src-tauri/src/mesh/http_api.rs` | Mesh HTTP endpoints |
| `src-tauri/src/health.rs` | Health monitoring |
| `src-tauri/tauri.conf.json` | Tauri configuration |

---

*Last updated: January 2026*
*Generated with Claude Code*
