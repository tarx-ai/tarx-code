#!/bin/bash
# TARX Code + TARX App End-to-End QA Test Script
# Run this after setting up both codebases

set -e

echo "=================================================="
echo "   TARX End-to-End QA Test Suite"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0

pass() {
    echo -e "${GREEN}✓ PASS${NC}: $1"
    ((PASSED++))
}

fail() {
    echo -e "${RED}✗ FAIL${NC}: $1"
    ((FAILED++))
}

warn() {
    echo -e "${YELLOW}⚠ WARN${NC}: $1"
}

# ============================================================================
# Test 1: Check TARX App is running (port 11435)
# ============================================================================
echo ""
echo "Test 1: Checking TARX App health endpoint (port 11435)..."

if curl -s --connect-timeout 3 http://localhost:11435/health > /dev/null 2>&1; then
    HEALTH_RESPONSE=$(curl -s http://localhost:11435/health)
    if echo "$HEALTH_RESPONSE" | grep -q '"status"'; then
        pass "TARX App is running on port 11435"
        echo "   Response: $HEALTH_RESPONSE"
    else
        fail "TARX App returned unexpected health response"
        echo "   Response: $HEALTH_RESPONSE"
    fi
else
    fail "TARX App is NOT running on port 11435"
    echo "   Please start the TARX desktop app first"
fi

# ============================================================================
# Test 2: Check Mesh API is running (port 11436)
# ============================================================================
echo ""
echo "Test 2: Checking Mesh API health endpoint (port 11436)..."

if curl -s --connect-timeout 3 http://localhost:11436/health > /dev/null 2>&1; then
    MESH_HEALTH=$(curl -s http://localhost:11436/health)
    pass "Mesh API is running on port 11436"
    echo "   Response: $MESH_HEALTH"
else
    warn "Mesh API not available on port 11436 (optional for local-only mode)"
fi

# ============================================================================
# Test 3: Check Mesh Status endpoint
# ============================================================================
echo ""
echo "Test 3: Checking Mesh status endpoint..."

if curl -s --connect-timeout 3 http://localhost:11436/mesh/status > /dev/null 2>&1; then
    MESH_STATUS=$(curl -s http://localhost:11436/mesh/status)
    pass "Mesh status endpoint responding"
    echo "   Response: $MESH_STATUS"
else
    warn "Mesh status endpoint not available"
fi

# ============================================================================
# Test 4: Test Chat Completion endpoint (non-streaming)
# ============================================================================
echo ""
echo "Test 4: Testing chat completion endpoint..."

CHAT_REQUEST='{"model":"tx-16g","messages":[{"role":"user","content":"Say hello"}],"stream":false,"max_tokens":10}'

if curl -s --connect-timeout 10 -X POST \
    -H "Content-Type: application/json" \
    -d "$CHAT_REQUEST" \
    http://localhost:11435/v1/chat/completions > /tmp/tarx_chat_response.json 2>&1; then

    if [ -s /tmp/tarx_chat_response.json ]; then
        if cat /tmp/tarx_chat_response.json | grep -q '"choices"'; then
            pass "Chat completion endpoint working"
            echo "   Response preview: $(cat /tmp/tarx_chat_response.json | head -c 200)..."
        else
            fail "Chat completion returned unexpected format"
            echo "   Response: $(cat /tmp/tarx_chat_response.json)"
        fi
    else
        fail "Chat completion returned empty response"
    fi
else
    fail "Chat completion request failed"
fi

# ============================================================================
# Test 5: Test Streaming Chat Completion
# ============================================================================
echo ""
echo "Test 5: Testing streaming chat completion..."

STREAM_REQUEST='{"model":"tx-16g","messages":[{"role":"user","content":"Count to 3"}],"stream":true,"max_tokens":50}'

STREAM_RESPONSE=$(curl -s --connect-timeout 15 -X POST \
    -H "Content-Type: application/json" \
    -d "$STREAM_REQUEST" \
    http://localhost:11435/v1/chat/completions 2>&1 | head -5)

if echo "$STREAM_RESPONSE" | grep -q 'data:'; then
    pass "Streaming chat completion working"
    echo "   First chunks: $(echo "$STREAM_RESPONSE" | head -3)"
else
    warn "Streaming response format may differ"
    echo "   Response: $STREAM_RESPONSE"
fi

# ============================================================================
# Test 6: Check Extension Build Artifacts
# ============================================================================
echo ""
echo "Test 6: Checking extension build artifacts..."

EXTENSION_DIR="$HOME/Desktop/tarx-code"

if [ -f "$EXTENSION_DIR/tarx-code-1.0.0.vsix" ]; then
    pass "Extension VSIX package exists"
    echo "   Location: $EXTENSION_DIR/tarx-code-1.0.0.vsix"
elif ls "$EXTENSION_DIR"/*.vsix 1> /dev/null 2>&1; then
    VSIX_FILE=$(ls "$EXTENSION_DIR"/*.vsix | head -1)
    pass "Extension VSIX package exists"
    echo "   Location: $VSIX_FILE"
else
    warn "Extension VSIX not found - run 'npm run package' in tarx-code"
fi

# ============================================================================
# Test 7: Check Extension Source Files
# ============================================================================
echo ""
echo "Test 7: Checking extension source files..."

REQUIRED_FILES=(
    "webview-ui/src/components/welcome/WelcomeView.tsx"
    "src/core/api/providers/tarx-mesh.ts"
    "src/shared/api.ts"
    "package.json"
)

ALL_FOUND=true
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$EXTENSION_DIR/$file" ]; then
        echo "   ✓ Found: $file"
    else
        echo "   ✗ Missing: $file"
        ALL_FOUND=false
    fi
done

if [ "$ALL_FOUND" = true ]; then
    pass "All required extension source files present"
else
    fail "Some extension source files missing"
fi

# ============================================================================
# Test 8: Check TARX Builder Source Files
# ============================================================================
echo ""
echo "Test 8: Checking TARX Builder source files..."

BUILDER_DIR="$HOME/Desktop/tarx-builder"

BUILDER_FILES=(
    "src-tauri/src/main.rs"
    "src-tauri/src/inference_engine.rs"
    "src-tauri/src/mesh/http_api.rs"
    "src-tauri/src/health.rs"
    "src-tauri/tauri.conf.json"
)

ALL_FOUND=true
for file in "${BUILDER_FILES[@]}"; do
    if [ -f "$BUILDER_DIR/$file" ]; then
        echo "   ✓ Found: $file"
    else
        echo "   ✗ Missing: $file"
        ALL_FOUND=false
    fi
done

if [ "$ALL_FOUND" = true ]; then
    pass "All required TARX Builder source files present"
else
    fail "Some TARX Builder source files missing"
fi

# ============================================================================
# Test 9: Verify Default Model Configuration
# ============================================================================
echo ""
echo "Test 9: Verifying default model configuration..."

if grep -q 'DEFAULT_MODEL = "tx-16g"' "$EXTENSION_DIR/src/core/api/providers/tarx-mesh.ts" 2>/dev/null; then
    pass "Default model 'tx-16g' is configured in tarx-mesh provider"
else
    fail "Default model configuration not found or incorrect"
fi

if grep -q 'DEFAULT_API_PROVIDER = "tarx-mesh"' "$EXTENSION_DIR/src/shared/api.ts" 2>/dev/null; then
    pass "Default API provider is 'tarx-mesh'"
else
    fail "Default API provider configuration not found or incorrect"
fi

# ============================================================================
# Test 10: Verify Health Check URL in Extension
# ============================================================================
echo ""
echo "Test 10: Verifying health check URL in extension..."

if grep -q 'http://localhost:11435' "$EXTENSION_DIR/webview-ui/src/components/welcome/WelcomeView.tsx" 2>/dev/null; then
    pass "Extension uses correct health check URL (localhost:11435)"
else
    fail "Extension health check URL not found or incorrect"
fi

# ============================================================================
# Summary
# ============================================================================
echo ""
echo "=================================================="
echo "   QA Test Summary"
echo "=================================================="
echo ""
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed! TARX ecosystem is ready.${NC}"
    exit 0
else
    echo -e "${YELLOW}Some tests failed. Review the output above.${NC}"
    exit 1
fi
