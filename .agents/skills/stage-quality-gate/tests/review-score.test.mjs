import assert from "node:assert/strict";
import test from "node:test";
import { validateReview } from "../lib/review-contract.mjs";
import {
  calculateReviewScore,
  evaluateStageGate,
} from "../lib/review-score.mjs";

const HUMAN_DIMENSIONS = {
  "user-value": 20,
  "information-clarity": 20,
  "ux-accessibility": 20,
  "medical-trust": 20,
  "brand-consistency": 10,
  completeness: 10,
};

const AI_DIMENSIONS = {
  "spec-compliance": 20,
  "correctness-traceability": 20,
  "security-safety": 20,
  "verification-evidence": 20,
  maintainability: 10,
  "static-ci": 10,
};

function makeReview({
  reviewer,
  rawScore = 5,
  criticalFindings = [],
  notApplicable = [],
}) {
  const weights =
    reviewer === "human-editorial" ? HUMAN_DIMENSIONS : AI_DIMENSIONS;

  return {
    schemaVersion: 1,
    reviewer,
    stageId: "review-system-bootstrap",
    attempt: 1,
    reviewedCandidateCommit: "0123456789abcdef0123456789abcdef01234567",
    dimensions: Object.entries(weights).map(([id, weight]) => ({
      id,
      weight,
      rawScore: notApplicable.includes(id) ? null : rawScore,
      notApplicable: notApplicable.includes(id),
      notApplicableReason: notApplicable.includes(id)
        ? "The Stage has no user-facing surface in this dimension."
        : null,
      evidence: [
        {
          path: "docs/example.md",
          line: 1,
          detail: `${id} evidence`,
        },
      ],
      findings: [],
    })),
    criticalFindings,
    summary: "Fixture review",
  };
}

test("passes only when both scores are at least 90 and checks pass", () => {
  const human = makeReview({ reviewer: "human-editorial", rawScore: 4.5 });
  const ai = makeReview({ reviewer: "ai-technical", rawScore: 4.5 });

  assert.deepEqual(
    evaluateStageGate({
      human,
      ai,
      requiredChecks: [{ command: "node --test", exitCode: 0, summary: "pass" }],
    }),
    {
      pass: true,
      humanScore: 90,
      aiScore: 90,
      criticalCount: 0,
      checksPass: true,
    },
  );
});

test("fails at 89.9", () => {
  const human = makeReview({ reviewer: "human-editorial", rawScore: 4.495 });
  const ai = makeReview({ reviewer: "ai-technical", rawScore: 5 });
  const result = evaluateStageGate({ human, ai, requiredChecks: [] });
  assert.equal(result.pass, false);
  assert.equal(result.humanScore, 89.9);
});

test("critical findings override a score of 100", () => {
  const criticalFindings = [{
    id: "SEC-001",
    evidence: [{
      path: ".env",
      line: 1,
      detail: "A secret is committed.",
    }],
    impact: "Credential exposure",
    requiredFix: "Remove and rotate the credential.",
  }];
  const human = makeReview({ reviewer: "human-editorial" });
  const ai = makeReview({ reviewer: "ai-technical", criticalFindings });
  const result = evaluateStageGate({ human, ai, requiredChecks: [] });
  assert.equal(result.pass, false);
  assert.equal(result.criticalCount, 1);
});

test("normalizes applicable dimensions and requires 60 original weight", () => {
  const valid = makeReview({
    reviewer: "human-editorial",
    rawScore: 4.5,
    notApplicable: ["brand-consistency"],
  });
  assert.equal(
    calculateReviewScore(validateReview(valid, "human-editorial")).score,
    90,
  );

  const invalid = makeReview({
    reviewer: "human-editorial",
    notApplicable: ["user-value", "information-clarity", "ux-accessibility"],
  });
  assert.throws(
    () => validateReview(invalid, "human-editorial"),
    /at least 60/i,
  );
});

test("rejects missing evidence and invalid required checks", () => {
  const human = makeReview({ reviewer: "human-editorial" });
  human.dimensions[0].evidence = [];
  assert.throws(
    () => validateReview(human, "human-editorial"),
    /evidence/i,
  );

  const ai = makeReview({ reviewer: "ai-technical" });
  assert.equal(
    evaluateStageGate({
      human: makeReview({ reviewer: "human-editorial" }),
      ai,
      requiredChecks: [{ command: "npm run build", exitCode: 1, summary: "failed" }],
    }).pass,
    false,
  );
});

test("rejects malformed reviews that could bypass the canonical contract", () => {
  const cases = [
    ["unknown reviewer", { reviewer: "other" }],
    ["string score", { dimensions: [{ index: 0, rawScore: "5" }] }],
    ["NaN score", { dimensions: [{ index: 0, rawScore: Number.NaN }] }],
    ["infinite score", { dimensions: [{ index: 0, rawScore: Infinity }] }],
    ["unknown dimension", { dimensions: [{ index: 0, id: "unknown" }] }],
    ["duplicate dimension", { dimensions: [{ index: 1, id: "user-value" }] }],
  ];

  for (const [name, mutation] of cases) {
    const review = makeReview({ reviewer: "human-editorial" });
    if (mutation.reviewer) review.reviewer = mutation.reviewer;
    for (const item of mutation.dimensions ?? []) {
      const { index, ...changes } = item;
      Object.assign(review.dimensions[index], changes);
    }
    assert.throws(
      () => validateReview(review, "human-editorial"),
      undefined,
      name,
    );
  }
});

test("requires exact stage metadata, applicability, and critical finding shapes", () => {
  const mutations = [
    ["schemaVersion", 2],
    ["stageId", "Bad Stage"],
    ["attempt", 4],
    ["reviewedCandidateCommit", "ABC1234"],
    ["summary", ""],
  ];
  for (const [field, value] of mutations) {
    const review = makeReview({ reviewer: "human-editorial" });
    review[field] = value;
    assert.throws(() => validateReview(review, "human-editorial"));
  }

  const applicable = makeReview({ reviewer: "human-editorial" });
  applicable.dimensions[0].notApplicableReason = "not allowed";
  assert.throws(() => validateReview(applicable, "human-editorial"));

  const invalidApplicability = makeReview({ reviewer: "human-editorial" });
  invalidApplicability.dimensions[0].notApplicable = "false";
  assert.throws(
    () => validateReview(invalidApplicability, "human-editorial"),
    /notApplicable/i,
  );

  const nonApplicable = makeReview({
    reviewer: "human-editorial",
    notApplicable: ["brand-consistency"],
  });
  nonApplicable.dimensions[4].rawScore = 0;
  assert.throws(() => validateReview(nonApplicable, "human-editorial"));

  const duplicateCritical = makeReview({
    reviewer: "human-editorial",
    criticalFindings: [
      {
        id: "MED-001",
        evidence: [{ path: "content.md", line: 1, detail: "claim" }],
        impact: "Medical misunderstanding",
        requiredFix: "Correct the claim.",
      },
      {
        id: "MED-001",
        evidence: [{ path: "content.md", line: 2, detail: "claim" }],
        impact: "Medical misunderstanding",
        requiredFix: "Correct the claim.",
      },
    ],
  });
  assert.throws(
    () => validateReview(duplicateCritical, "human-editorial"),
    /duplicate critical/i,
  );
});

test("requires requiredChecks to be an array", () => {
  assert.throws(
    () =>
      evaluateStageGate({
        human: makeReview({ reviewer: "human-editorial" }),
        ai: makeReview({ reviewer: "ai-technical" }),
        requiredChecks: null,
      }),
    /requiredChecks/i,
  );
});
