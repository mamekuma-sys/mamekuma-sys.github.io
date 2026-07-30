function clean(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\r?\n/g, " ")
    .replace(/\|/g, "\\|")
    .trim();
}

function dimensionTable(review) {
  return review.dimensions.map((item) => {
    const score = item.notApplicable ? "N/A" : item.rawScore;
    const evidence = item.evidence
      .map((entry) => `${entry.path}:${entry.line} ${entry.detail}`)
      .join("; ");
    return `| ${clean(item.id)} | ${clean(score)} | ${clean(evidence)} |`;
  });
}

export function renderStageReport({
  stageId,
  taskName,
  scope,
  baseCommit,
  reviewedCandidateCommit,
  reviewedAt,
  attempts,
  requiredChecks,
  finalHuman,
  finalAi,
  gate,
  fixes,
  remainingRisks,
}) {
  for (const [field, value] of Object.entries({
    stageId,
    taskName,
    baseCommit,
    reviewedCandidateCommit,
    reviewedAt,
  })) {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error(`${field} must be a non-empty string`);
    }
  }
  for (const [field, value] of Object.entries({
    scope,
    attempts,
    requiredChecks,
    fixes,
    remainingRisks,
  })) {
    if (!Array.isArray(value)) {
      throw new Error(`${field} must be an array`);
    }
  }

  const criticalFindings = [
    ...finalHuman.criticalFindings,
    ...finalAi.criticalFindings,
  ];
  const lines = [
    `# ${clean(stageId)} Stage Review`,
    "",
    `- Task: ${clean(taskName)}`,
    `- Base commit: \`${clean(baseCommit)}\``,
    `- Reviewed candidate commit: \`${clean(reviewedCandidateCommit)}\``,
    `- Reviewed at: ${clean(reviewedAt)}`,
    `- Human review status: Simulated human editorial review`,
    "",
    "## Scope",
    "",
    ...scope.map((item) => `- ${clean(item)}`),
    "",
    "## Attempt history",
    "",
    "| Attempt | Human | AI | Critical | Checks | Verdict |",
    "|---:|---:|---:|---:|---|---|",
    ...attempts.map(
      (attempt) =>
        `| ${attempt.attempt} | ${attempt.humanScore} | ${attempt.aiScore} | ` +
        `${attempt.criticalCount} | ${attempt.checksPass ? "PASS" : "FAIL"} | ` +
        `${attempt.pass ? "PASS" : "BLOCKED"} |`,
    ),
    "",
    "## Human Editorial evidence",
    "",
    "| Dimension | Raw score | Evidence |",
    "|---|---:|---|",
    ...dimensionTable(finalHuman),
    "",
    "## AI Technical evidence",
    "",
    "| Dimension | Raw score | Evidence |",
    "|---|---:|---|",
    ...dimensionTable(finalAi),
    "",
    "## Critical findings",
    "",
    ...(criticalFindings.length === 0
      ? ["없음"]
      : criticalFindings.map(
          (item) =>
            `- ${clean(item.id)}: ${clean(item.impact)} — ${clean(item.requiredFix)}`,
        )),
    "",
    "## Fixes applied",
    "",
    ...(fixes.length === 0 ? ["없음"] : fixes.map((item) => `- ${clean(item)}`)),
    "",
    "## Verification commands",
    "",
    "| Command | Exit code | Summary |",
    "|---|---:|---|",
    ...requiredChecks.map(
      (check) =>
        `| ${clean(check.command)} | ${check.exitCode} | ${clean(check.summary)} |`,
    ),
    "",
    "## Remaining risks",
    "",
    ...(remainingRisks.length === 0
      ? ["없음"]
      : remainingRisks.map((item) => `- ${clean(item)}`)),
    "",
    "## Final verdict",
    "",
    gate.pass ? "PASS" : "BLOCKED",
    "",
  ];

  return lines.join("\n");
}
