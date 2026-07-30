# Stage report template

Generate `docs/reviews/stages/<stageId>.md` with these sections in this exact order:

1. Stage metadata: Task, base commit, reviewed candidate commit, fixed reviewed timestamp, and `Simulated human editorial review`.
2. Scope: every changed or target path.
3. Attempt history: Human score, AI score, critical count, check status, and verdict for every valid attempt.
4. Human Editorial evidence: all six final dimensions, raw scores, and file-and-line evidence.
5. AI Technical evidence: all six final dimensions, raw scores, and file-and-line or command evidence.
6. Critical findings: every final critical finding or `없음`.
7. Fixes applied: evidence-backed corrections or `없음`.
8. Verification commands: exact command, exit code, and summary.
9. Remaining risks: concrete non-critical risks or `없음`.
10. Final verdict: `PASS` or `BLOCKED`.

Use `.agents/skills/stage-quality-gate/lib/stage-report.mjs` through the score CLI. Supply the reviewed timestamp; never generate the current time inside the renderer. Preserve Korean as UTF-8. Escape HTML special characters and Markdown table pipes.

The `reviewedCandidateCommit` is the commit reviewed before adding this report. Do not put the post-amend SHA into the report because the report changes that SHA.
