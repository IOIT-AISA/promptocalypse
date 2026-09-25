#!/bin/bash

# Missing Implementations
gh issue create \
  --title "[Audit Gap] 2-Hour Global Timer Not Implemented" \
  --body "### Description
We found a discrepancy between the docs and the code. 
- **Expected:** The event has a 2-hour global timer.
- **Actual:** There is no global timer enforcement in the codebase.
- **Action Required:** Implement a global timer that ends the event after 2 hours." \
  --label "tech-debt"

gh issue create \
  --title "[Audit Gap] Non-linear Progression Not Implemented" \
  --body "### Description
We found a discrepancy between the docs and the code. 
- **Expected:** The arena allows non-linear progression through the levels.
- **Actual:** The code strictly enforces linear progression (Level 1 -> 2 -> 3).
- **Action Required:** Refactor the scoring and progression state machine to allow non-linear level attempts." \
  --label "tech-debt"

gh issue create \
  --title "[Audit Gap] Level 2 Ingress Filter Returns 200 instead of 400" \
  --body "### Description
We found a discrepancy between the docs and the code. 
- **Expected:** Level 2 Ingress Filter returns 400 Bad Request.
- **Actual:** Level 2 Ingress Filter returns a 200 OK with a mocked text response.
- **Action Required:** Update the ingress filter to raise an HTTPException with status code 400." \
  --label "tech-debt"

# Missing Documentation
gh issue create \
  --title "[Audit Gap] SQLite WAL Mode Missing from Docs" \
  --body "### Description
We found a discrepancy between the docs and the code. 
- **Expected:** Technical specifications document SQLite WAL mode configuration.
- **Actual:** SQLite WAL mode is implemented in code but missing from TECH-SPEC.md.
- **Action Required:** Update TECH-SPEC.md to include SQLite WAL mode initialization details." \
  --label "documentation"

gh issue create \
  --title "[Audit Gap] In-Memory Error Ring Buffer Missing from Docs" \
  --body "### Description
We found a discrepancy between the docs and the code. 
- **Expected:** The in-memory error ring buffer is documented.
- **Actual:** The ring buffer is implemented in logger.py but missing from technical specifications.
- **Action Required:** Document the in-memory error ring buffer mechanism in the architecture and tech specs." \
  --label "documentation"

gh issue create \
  --title "[Audit Gap] Telemetry JSON Logging Missing from Docs" \
  --body "### Description
We found a discrepancy between the docs and the code. 
- **Expected:** Telemetry JSON logging format is documented.
- **Actual:** Structured JSON logging is implemented but not accurately reflected in the documentation.
- **Action Required:** Update documentation to describe the telemetry JSON logging format and redaction pipeline." \
  --label "documentation"

gh issue create \
  --title "[Audit Gap] OpenRouter/Qwen Integration Missing from Docs" \
  --body "### Description
We found a discrepancy between the docs and the code. 
- **Expected:** Documentation specifies all supported LLM providers (including OpenRouter and Qwen).
- **Actual:** The codebase supports OpenRouter/Qwen integration, but the docs exclusively mention Groq.
- **Action Required:** Update the README and TECH-SPEC.md to include OpenRouter and Qwen deployment instructions." \
  --label "documentation"
