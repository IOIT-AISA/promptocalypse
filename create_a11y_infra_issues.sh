#!/bin/bash

gh issue create \
  --title "[Infra/Database] High Thread Churn from Per-Request aiosqlite Connections" \
  --body "### Description
Currently, every request to \`/api/chat\`, \`/api/submit-key\`, and \`/api/leaderboard\` calls \`aiosqlite.connect()\` inside \`get_db_context()\`. 

\`aiosqlite\` spawns a new background OS thread for **every** connection to bridge async to blocking SQLite. Under a load of 200+ concurrent users, the application will constantly spawn and destroy hundreds of OS threads per second, leading to massive context-switching overhead, CPU starvation, and potential thread pool exhaustion.

### Action Required
- Implement a global connection pool or use a single, long-lived \`aiosqlite\` connection (or a dedicated DB worker thread/queue) instead of creating/closing connections per HTTP request.
- Ensure the single/pooled connection properly recovers if it drops." \
  --label "infra,backend,performance"

gh issue create \
  --title "[Accessibility/A11Y] Missing ARIA Labels on Primary Input Fields" \
  --body "### Description
The two most critical interactive elements in the application are currently inaccessible to screen readers (violating WCAG 4.1.2 Name, Role, Value):
1. **Chat Terminal Textarea:** (\`frontend/src/components/ChatTerminal.tsx\`) lacks an \`id\`, \`name\`, \`<label>\`, or \`aria-label\`.
2. **Key Vault Flag Input:** (\`frontend/src/components/KeyVault.tsx\`) lacks an \`id\`, \`name\`, \`<label>\`, or \`aria-label\`.

When visually impaired users tab into these fields using VoiceOver or NVDA, they will only hear \"edit text\" without context on what they are supposed to input.

### Action Required
- Add explicit \`aria-label=\"Injection Prompt\"\` to the \`<textarea>\`.
- Add explicit \`aria-label=\"Secret Flag Key\"\` to the \`<input>\` in the Key Vault." \
  --label "frontend,accessibility"
