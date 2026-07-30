import assert from "node:assert/strict";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import test from "node:test";
import { renderStageReport } from "../lib/stage-report.mjs";

const DIMENSIONS = {
  "human-editorial": {
    "user-value": 20,
    "information-clarity": 20,
    "ux-accessibility": 20,
    "medical-trust": 20,
    "brand-consistency": 10,
    completeness: 10,
  },
  "ai-technical": {
    "spec-compliance": 20,
    "correctness-traceability": 20,
    "security-safety": 20,
    "verification-evidence": 20,
    maintainability: 10,
    "static-ci": 10,
  },
};

function makeReview(reviewer) {
  return {
    schemaVersion: 1,
    reviewer,
    stageId: "review-system-bootstrap",
    attempt: 1,
    reviewedCandidateCommit: "89abcdef0123456789abcdef0123456789abcdef",
    dimensions: Object.entries(DIMENSIONS[reviewer]).map(([id, weight]) => ({
      id,
      weight,
      rawScore: 5,
      notApplicable: false,
      notApplicableReason: null,
      evidence: [{
        path: "docs/example|safe.md",
        line: 1,
        detail: `${id} uses <fresh> & direct evidence`,
      }],
      findings: [],
    })),
    criticalFindings: [],
    summary: "Passing fixture",
  };
}

function makeInput() {
  const human = makeReview("human-editorial");
  const ai = makeReview("ai-technical");
  return {
    stageId: "review-system-bootstrap",
    taskName: "Bootstrap <three> review skills & deterministic gate",
    scope: [
      ".agents/skills/human-editorial-review",
      ".agents/skills/ai-technical-review",
      ".agents/skills/stage-quality-gate",
    ],
    baseCommit: "0123456789abcdef0123456789abcdef01234567",
    reviewedCandidateCommit: "89abcdef0123456789abcdef0123456789abcdef",
    reviewedAt: "2026-07-30T14:00:00.000Z",
    attempts: [{
      attempt: 1,
      humanScore: 100,
      aiScore: 100,
      criticalCount: 0,
      checksPass: true,
      pass: true,
    }],
    requiredChecks: [
      {
        command: "node --test .agents/skills/stage-quality-gate/tests/*.test.mjs",
        exitCode: 0,
        summary: "all tests pass",
      },
      {
        command: "git diff --check",
        exitCode: 0,
        summary: "no whitespace errors",
      },
    ],
    finalHuman: human,
    finalAi: ai,
    gate: {
      pass: true,
      humanScore: 100,
      aiScore: 100,
      criticalCount: 0,
      checksPass: true,
    },
    fixes: ["Escaped <unsafe> & table | content"],
    remainingRisks: ["A later runtime may parse | differently."],
  };
}

test("renders the complete deterministic Stage report", () => {
  const input = makeInput();
  const first = renderStageReport(input);
  const second = renderStageReport(input);

  assert.equal(first, second);
  assert.ok(first.startsWith("# review-system-bootstrap Stage Review\n"));
  assert.match(first, /Simulated human editorial review/);
  for (const scopePath of input.scope) {
    assert.match(first, new RegExp(scopePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(first, /\| Attempt \| Human \| AI \| Critical \| Checks \| Verdict \|/);
  assert.match(first, /\| 1 \| 100 \| 100 \| 0 \| PASS \| PASS \|/);
  for (const check of input.requiredChecks) {
    assert.match(first, new RegExp(check.command.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(first, new RegExp(`\\| ${check.exitCode} \\|`));
  }
  assert.match(first, /## Critical findings\n\n없음/);
  assert.match(first, /A later runtime may parse \\\| differently\./);
  assert.ok(first.endsWith("PASS\n"));
});

test("escapes Markdown pipes and HTML special characters", () => {
  const report = renderStageReport(makeInput());

  assert.match(
    report,
    /Bootstrap &lt;three&gt; review skills &amp; deterministic gate/,
  );
  assert.match(report, /docs\/example\\\|safe\.md/);
  assert.match(report, /&lt;fresh&gt; &amp; direct evidence/);
  assert.match(report, /Escaped &lt;unsafe&gt; &amp; table \\\| content/);
});

test("renders BLOCKED when the gate does not pass", () => {
  const input = makeInput();
  input.gate.pass = false;
  input.attempts[0].pass = false;

  assert.ok(renderStageReport(input).endsWith("BLOCKED\n"));
});

test("rejects incomplete report inputs instead of using current time", () => {
  const input = makeInput();
  input.reviewedAt = "";
  assert.throws(() => renderStageReport(input), /reviewedAt/i);

  const invalidArrays = makeInput();
  invalidArrays.remainingRisks = null;
  assert.throws(() => renderStageReport(invalidArrays), /remainingRisks/i);
});

test("score CLI validates, scores, writes a report, and executes no command text", () => {
  const testDir = path.join(process.cwd(), ".superpowers", "score-cli-test");
  const inputPath = path.join(testDir, "input.json");
  const reportPath = path.join(testDir, "report.md");
  const markerPath = path.join(testDir, "must-not-exist");
  rmSync(testDir, { recursive: true, force: true });
  mkdirSync(testDir, { recursive: true });

  try {
    const reportInput = makeInput();
    reportInput.human = reportInput.finalHuman;
    reportInput.ai = reportInput.finalAi;
    delete reportInput.finalHuman;
    delete reportInput.finalAi;
    reportInput.requiredChecks[0].command =
      `node -e "require('node:fs').writeFileSync('${markerPath}', 'bad')"`;
    writeFileSync(inputPath, `${JSON.stringify(reportInput, null, 2)}\n`);

    const result = spawnSync(
      process.execPath,
      [
        ".agents/skills/stage-quality-gate/scripts/score-review.mjs",
        "--input",
        path.relative(process.cwd(), inputPath),
        "--report",
        path.relative(process.cwd(), reportPath),
      ],
      { cwd: process.cwd(), encoding: "utf8" },
    );

    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(JSON.parse(result.stdout), reportInput.gate);
    assert.equal(existsSync(markerPath), false);
    assert.match(readFileSync(reportPath, "utf8"), /## Final verdict\n\nPASS/);
  } finally {
    rmSync(testDir, { recursive: true, force: true });
  }
});

test("score CLI rejects unknown flags, path escapes, and mismatched reviewer metadata", () => {
  const script = ".agents/skills/stage-quality-gate/scripts/score-review.mjs";
  const unknown = spawnSync(process.execPath, [script, "--unknown", "value"], {
    cwd: process.cwd(),
    encoding: "utf8",
  });
  assert.equal(unknown.status, 1);
  assert.match(unknown.stderr, /--input|unknown/i);

  const escaped = spawnSync(
    process.execPath,
    [script, "--input", "../outside.json"],
    { cwd: process.cwd(), encoding: "utf8" },
  );
  assert.equal(escaped.status, 1);
  assert.match(escaped.stderr, /repository/i);

  const testDir = path.join(process.cwd(), ".superpowers", "score-cli-mismatch");
  const inputPath = path.join(testDir, "input.json");
  rmSync(testDir, { recursive: true, force: true });
  mkdirSync(testDir, { recursive: true });
  try {
    const input = makeInput();
    input.human = input.finalHuman;
    input.ai = input.finalAi;
    delete input.finalHuman;
    delete input.finalAi;
    input.ai.stageId = "different-stage";
    writeFileSync(inputPath, JSON.stringify(input));
    const mismatch = spawnSync(
      process.execPath,
      [script, "--input", path.relative(process.cwd(), inputPath)],
      { cwd: process.cwd(), encoding: "utf8" },
    );
    assert.equal(mismatch.status, 1);
    assert.match(mismatch.stderr, /stageId/i);
  } finally {
    rmSync(testDir, { recursive: true, force: true });
  }
});

test("score CLI rejects a report symlink that resolves outside the repository", () => {
  const testDir = path.join(process.cwd(), ".superpowers", "score-cli-symlink");
  const inputPath = path.join(testDir, "input.json");
  const reportPath = path.join(testDir, "report.md");
  rmSync(testDir, { recursive: true, force: true });
  mkdirSync(testDir, { recursive: true });
  try {
    const input = makeInput();
    input.human = input.finalHuman;
    input.ai = input.finalAi;
    delete input.finalHuman;
    delete input.finalAi;
    writeFileSync(inputPath, JSON.stringify(input));
    symlinkSync("/dev/null", reportPath);

    const result = spawnSync(
      process.execPath,
      [
        ".agents/skills/stage-quality-gate/scripts/score-review.mjs",
        "--input",
        path.relative(process.cwd(), inputPath),
        "--report",
        path.relative(process.cwd(), reportPath),
      ],
      { cwd: process.cwd(), encoding: "utf8" },
    );
    assert.equal(result.status, 1);
    assert.match(result.stderr, /repository/i);
  } finally {
    rmSync(testDir, { recursive: true, force: true });
  }
});
