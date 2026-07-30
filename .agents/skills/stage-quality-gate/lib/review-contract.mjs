export const REVIEWER_DIMENSIONS = Object.freeze({
  "human-editorial": Object.freeze({
    "user-value": 20,
    "information-clarity": 20,
    "ux-accessibility": 20,
    "medical-trust": 20,
    "brand-consistency": 10,
    completeness: 10,
  }),
  "ai-technical": Object.freeze({
    "spec-compliance": 20,
    "correctness-traceability": 20,
    "security-safety": 20,
    "verification-evidence": 20,
    maintainability: 10,
    "static-ci": 10,
  }),
});

function requireNonEmptyString(value, field) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} must be a non-empty string`);
  }
}

function validateEvidence(evidence, field) {
  if (!Array.isArray(evidence) || evidence.length === 0) {
    throw new Error(`${field} must contain evidence`);
  }
  for (const [index, item] of evidence.entries()) {
    requireNonEmptyString(item?.path, `${field}[${index}].path`);
    if (!Number.isInteger(item?.line) || item.line < 1) {
      throw new Error(`${field}[${index}].line must be a positive integer`);
    }
    requireNonEmptyString(item?.detail, `${field}[${index}].detail`);
  }
}

export function validateReview(review, expectedReviewer) {
  const weights = REVIEWER_DIMENSIONS[expectedReviewer];
  if (!review || typeof review !== "object" || Array.isArray(review)) {
    throw new Error("review must be an object");
  }
  if (!weights || review?.reviewer !== expectedReviewer) {
    throw new Error("reviewer does not match the expected reviewer");
  }
  if (review.schemaVersion !== 1) {
    throw new Error("schemaVersion must equal 1");
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(review.stageId ?? "")) {
    throw new Error("stageId must be a lowercase slug");
  }
  if (!Number.isInteger(review.attempt) || review.attempt < 1 || review.attempt > 3) {
    throw new Error("attempt must be an integer from 1 through 3");
  }
  if (!/^[0-9a-f]{7,64}$/.test(review.reviewedCandidateCommit ?? "")) {
    throw new Error("reviewedCandidateCommit must be a hexadecimal Git ID");
  }
  if (!Array.isArray(review.dimensions)) {
    throw new Error("dimensions must be an array");
  }

  const seen = new Set();
  let applicableWeight = 0;
  for (const dimension of review.dimensions) {
    if (!Object.hasOwn(weights, dimension?.id) || seen.has(dimension.id)) {
      throw new Error(`invalid or duplicate dimension: ${dimension?.id}`);
    }
    seen.add(dimension.id);
    if (dimension.weight !== weights[dimension.id]) {
      throw new Error(`weight mismatch for ${dimension.id}`);
    }
    validateEvidence(dimension.evidence, `${dimension.id}.evidence`);
    if (!Array.isArray(dimension.findings)) {
      throw new Error(`${dimension.id}.findings must be an array`);
    }
    if (
      dimension.notApplicable !== true &&
      dimension.notApplicable !== false
    ) {
      throw new Error(`${dimension.id}.notApplicable must be a boolean`);
    }

    if (dimension.notApplicable === true) {
      if (dimension.rawScore !== null) {
        throw new Error(`${dimension.id}.rawScore must be null`);
      }
      requireNonEmptyString(
        dimension.notApplicableReason,
        `${dimension.id}.notApplicableReason`,
      );
    } else {
      if (
        !Number.isFinite(dimension.rawScore) ||
        dimension.rawScore < 0 ||
        dimension.rawScore > 5
      ) {
        throw new Error(`${dimension.id}.rawScore must be from 0 through 5`);
      }
      if (dimension.notApplicableReason !== null) {
        throw new Error(`${dimension.id}.notApplicableReason must be null`);
      }
      applicableWeight += dimension.weight;
    }
  }

  if (seen.size !== Object.keys(weights).length) {
    throw new Error("every canonical dimension must appear exactly once");
  }
  if (applicableWeight < 60) {
    throw new Error("applicable original weight must be at least 60");
  }
  if (!Array.isArray(review.criticalFindings)) {
    throw new Error("criticalFindings must be an array");
  }
  const criticalIds = new Set();
  for (const finding of review.criticalFindings) {
    requireNonEmptyString(finding?.id, "criticalFinding.id");
    if (criticalIds.has(finding.id)) {
      throw new Error(`duplicate critical finding: ${finding.id}`);
    }
    criticalIds.add(finding.id);
    validateEvidence(finding.evidence, `${finding.id}.evidence`);
    requireNonEmptyString(finding.impact, `${finding.id}.impact`);
    requireNonEmptyString(finding.requiredFix, `${finding.id}.requiredFix`);
  }
  requireNonEmptyString(review.summary, "summary");
  return review;
}
