import {
  lstatSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import process from "node:process";
import { evaluateStageGate } from "../lib/review-score.mjs";
import { renderStageReport } from "../lib/stage-report.mjs";

function parseArguments(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 2) {
    const flag = argv[index];
    const value = argv[index + 1];
    if (
      (flag !== "--input" && flag !== "--report") ||
      typeof value !== "string" ||
      value.length === 0 ||
      value.startsWith("--") ||
      Object.hasOwn(values, flag)
    ) {
      throw new Error(
        "Usage: score-review.mjs --input <path> [--report <path>]",
      );
    }
    values[flag] = value;
  }
  if (!values["--input"]) {
    throw new Error("--input is required");
  }
  return {
    input: values["--input"],
    report: values["--report"] ?? null,
  };
}

function isInside(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === "" || (
    relative !== ".." &&
    !relative.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relative)
  );
}

function resolveInputPath(repositoryRoot, requestedPath) {
  const lexicalPath = path.resolve(repositoryRoot, requestedPath);
  if (!isInside(repositoryRoot, lexicalPath)) {
    throw new Error("input path must stay inside the repository");
  }
  const realPath = realpathSync(lexicalPath);
  if (!isInside(repositoryRoot, realPath) || !statSync(realPath).isFile()) {
    throw new Error("input path must be a file inside the repository");
  }
  return realPath;
}

function resolveReportPath(repositoryRoot, requestedPath) {
  const reportPath = path.resolve(repositoryRoot, requestedPath);
  if (!isInside(repositoryRoot, reportPath) || reportPath === repositoryRoot) {
    throw new Error("report path must stay inside the repository");
  }

  let ancestor = path.dirname(reportPath);
  while (!isInside(repositoryRoot, ancestor)) {
    throw new Error("report path must stay inside the repository");
  }
  while (ancestor !== repositoryRoot) {
    try {
      ancestor = realpathSync(ancestor);
      break;
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
      ancestor = path.dirname(ancestor);
    }
  }
  if (!isInside(repositoryRoot, realpathSync(ancestor))) {
    throw new Error("report path must stay inside the repository");
  }
  try {
    if (lstatSync(reportPath).isSymbolicLink()) {
      throw new Error("report path must stay inside the repository");
    }
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  return reportPath;
}

function validateTopLevelMatches(input) {
  for (const [label, review] of [
    ["human", input.human],
    ["ai", input.ai],
  ]) {
    if (review?.stageId !== input.stageId) {
      throw new Error(`${label}.stageId must match stageId`);
    }
    if (review?.reviewedCandidateCommit !== input.reviewedCandidateCommit) {
      throw new Error(
        `${label}.reviewedCandidateCommit must match reviewedCandidateCommit`,
      );
    }
  }
}

function main() {
  const repositoryRoot = realpathSync(process.cwd());
  const args = parseArguments(process.argv.slice(2));
  const inputPath = resolveInputPath(repositoryRoot, args.input);
  const input = JSON.parse(readFileSync(inputPath, "utf8"));
  validateTopLevelMatches(input);

  const gate = evaluateStageGate({
    human: input.human,
    ai: input.ai,
    requiredChecks: input.requiredChecks,
  });

  if (args.report) {
    const reportPath = resolveReportPath(repositoryRoot, args.report);
    const report = renderStageReport({
      stageId: input.stageId,
      taskName: input.taskName,
      scope: input.scope,
      baseCommit: input.baseCommit,
      reviewedCandidateCommit: input.reviewedCandidateCommit,
      reviewedAt: input.reviewedAt,
      attempts: input.attempts,
      requiredChecks: input.requiredChecks,
      finalHuman: input.human,
      finalAi: input.ai,
      gate,
      fixes: input.fixes,
      remainingRisks: input.remainingRisks,
    });
    mkdirSync(path.dirname(reportPath), { recursive: true });
    writeFileSync(reportPath, report, "utf8");
  }

  process.stdout.write(`${JSON.stringify(gate, null, 2)}\n`);
  if (!gate.pass) process.exitCode = 1;
}

try {
  main();
} catch (error) {
  process.stderr.write(`Error: ${error instanceof Error ? error.message : error}\n`);
  process.exitCode = 1;
}
