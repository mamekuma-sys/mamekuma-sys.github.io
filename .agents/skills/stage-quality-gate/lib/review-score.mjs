import { validateReview } from "./review-contract.mjs";

function roundOne(value) {
  return Math.round((value + Number.EPSILON) * 10) / 10;
}

export function calculateReviewScore(review) {
  const applicable = review.dimensions.filter((item) => !item.notApplicable);
  const applicableWeight = applicable.reduce((sum, item) => sum + item.weight, 0);
  const earned = applicable.reduce(
    (sum, item) => sum + (item.rawScore / 5) * item.weight,
    0,
  );

  return {
    score: roundOne((earned / applicableWeight) * 100),
    applicableWeight,
    criticalCount: review.criticalFindings.length,
  };
}

export function evaluateStageGate({ human, ai, requiredChecks }) {
  if (!Array.isArray(requiredChecks)) {
    throw new Error("requiredChecks must be an array");
  }
  const validHuman = validateReview(human, "human-editorial");
  const validAi = validateReview(ai, "ai-technical");
  const humanResult = calculateReviewScore(validHuman);
  const aiResult = calculateReviewScore(validAi);
  const checksPass = requiredChecks.every(
    (check) =>
      typeof check.command === "string" &&
      check.command.length > 0 &&
      Number.isInteger(check.exitCode) &&
      check.exitCode === 0 &&
      typeof check.summary === "string" &&
      check.summary.length > 0,
  );
  const criticalCount =
    humanResult.criticalCount + aiResult.criticalCount;

  return {
    pass:
      humanResult.score >= 90 &&
      aiResult.score >= 90 &&
      criticalCount === 0 &&
      checksPass,
    humanScore: humanResult.score,
    aiScore: aiResult.score,
    criticalCount,
    checksPass,
  };
}
