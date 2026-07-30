import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const SKILLS = {
  "human-editorial-review": {
    description: "Review a Medical AI Index Stage from a simulated human editor and reader perspective, score the approved Human Editorial rubric with file-and-line evidence, and identify medical-trust or usability blockers. Use for Stage commits, site UX, plans, and medical AI content; do not use as actual clinical or legal approval.",
    required: [
      "SKILL.md",
      "references/rubric.md",
      "references/output-schema.md",
      "references/activation-cases.md",
    ],
    dimensions: {
      "user-value": 20,
      "information-clarity": 20,
      "ux-accessibility": 20,
      "medical-trust": 20,
      "brand-consistency": 10,
      completeness: 10,
    },
  },
  "ai-technical-review": {
    description: "Review a Medical AI Index Stage for specification compliance, correctness, source traceability, security, verification evidence, maintainability, and static-export reliability. Use before a Stage commit may be pushed; do not replace product-direction approval.",
    required: [
      "SKILL.md",
      "references/rubric.md",
      "references/output-schema.md",
      "references/activation-cases.md",
    ],
    dimensions: {
      "spec-compliance": 20,
      "correctness-traceability": 20,
      "security-safety": 20,
      "verification-evidence": 20,
      maintainability: 10,
      "static-ci": 10,
    },
  },
  "stage-quality-gate": {
    description: "Coordinate the Medical AI Index candidate-commit quality gate by running Human Editorial and AI Technical reviews independently, validating scores, iterating fixes up to three attempts, writing the Stage report, and permitting only passing commits to be pushed.",
    required: [
      "SKILL.md",
      "references/stage-contract.md",
      "references/report-template.md",
      "references/activation-cases.md",
      "lib/review-contract.mjs",
      "lib/review-score.mjs",
      "lib/stage-report.mjs",
      "scripts/score-review.mjs",
      "scripts/validate-skills.mjs",
      "tests/review-score.test.mjs",
      "tests/stage-report.test.mjs",
      "tests/validate-skills.test.mjs",
    ],
    dimensions: null,
  },
};

const FORBIDDEN_PLACEHOLDERS = [
  `TB${"D"}`,
  `TO${"DO"}`,
  `FIX${"ME"}`,
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function collectFiles(directory) {
  if (!existsSync(directory)) return [];
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(entryPath));
    } else if (entry.isFile()) {
      files.push(entryPath);
    }
  }
  return files;
}

function parseFrontmatter(content, relativePath, errors) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) {
    errors.push(`${relativePath}: missing YAML frontmatter`);
    return null;
  }
  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([a-zA-Z][a-zA-Z0-9_-]*):\s*(.*)$/);
    if (!field || Object.hasOwn(fields, field[1])) {
      errors.push(`${relativePath}: invalid or duplicate frontmatter field`);
      return null;
    }
    fields[field[1]] = field[2].trim();
  }
  const keys = Object.keys(fields).sort();
  if (keys.join(",") !== "description,name") {
    errors.push(`${relativePath}: frontmatter must contain only name and description`);
  }
  return fields;
}

function validateLinks(skillDirectory, skillContent, relativePath, errors) {
  const links = skillContent.matchAll(/\]\(([^)]+)\)/g);
  for (const match of links) {
    const target = match[1].split("#", 1)[0];
    if (
      target.length === 0 ||
      target.startsWith("#") ||
      /^[a-z][a-z0-9+.-]*:/i.test(target)
    ) {
      continue;
    }
    const resolved = path.resolve(skillDirectory, target);
    if (!existsSync(resolved) || !statSync(resolved).isFile()) {
      errors.push(`${relativePath}: referenced file does not exist: ${target}`);
    }
  }
}

function validateRubric(skillDirectory, dimensions, errors) {
  const rubricPath = path.join(skillDirectory, "references", "rubric.md");
  if (!existsSync(rubricPath)) return;
  const rubric = readFileSync(rubricPath, "utf8");
  for (const [id, weight] of Object.entries(dimensions)) {
    const row = new RegExp(
      `\\|\\s*\\\`${escapeRegExp(id)}\\\`\\s*\\|[^\\n]*\\|\\s*${weight}\\s*\\|`,
    );
    if (!row.test(rubric)) {
      errors.push(
        `${path.relative(process.cwd(), rubricPath)}: missing ${id} weight ${weight}`,
      );
    }
  }
}

export function validateSkills(repositoryRoot = process.cwd()) {
  const root = path.resolve(repositoryRoot);
  const skillsRoot = path.join(root, ".agents", "skills");
  const errors = [];

  for (const [skillName, contract] of Object.entries(SKILLS)) {
    const skillDirectory = path.join(skillsRoot, skillName);
    if (!existsSync(skillDirectory) || !statSync(skillDirectory).isDirectory()) {
      errors.push(`missing skill directory: ${skillName}`);
      continue;
    }

    for (const requiredPath of contract.required) {
      const absolutePath = path.join(skillDirectory, requiredPath);
      if (!existsSync(absolutePath) || !statSync(absolutePath).isFile()) {
        errors.push(`${skillName}: missing required file ${requiredPath}`);
      }
    }

    const skillPath = path.join(skillDirectory, "SKILL.md");
    if (!existsSync(skillPath)) continue;
    const skillContent = readFileSync(skillPath, "utf8");
    const relativeSkillPath = path.relative(root, skillPath);
    const frontmatter = parseFrontmatter(skillContent, relativeSkillPath, errors);
    if (frontmatter) {
      if (frontmatter.name !== skillName) {
        errors.push(
          `${relativeSkillPath}: expected name ${skillName}, got ${frontmatter.name}`,
        );
      }
      if (
        typeof frontmatter.description !== "string" ||
        frontmatter.description.length === 0
      ) {
        errors.push(`${relativeSkillPath}: description must be non-empty`);
      } else if (frontmatter.description.length > 500) {
        errors.push(`${relativeSkillPath}: description must be at most 500 characters`);
      }
      if (frontmatter.description !== contract.description) {
        errors.push(`${relativeSkillPath}: description must match the approved description`);
      }
    }
    validateLinks(skillDirectory, skillContent, relativeSkillPath, errors);

    if (contract.dimensions) {
      validateRubric(skillDirectory, contract.dimensions, errors);
    }
  }

  const gatePath = path.join(skillsRoot, "stage-quality-gate", "SKILL.md");
  if (existsSync(gatePath)) {
    const gate = readFileSync(gatePath, "utf8");
    for (const [label, pattern] of [
      ["90", /90/],
      ["3", /\b3\b/],
      ["critical", /critical/i],
      ["git push", /git push/],
      ["pre-PASS push prohibition", /Before PASS, do not run `git push`\./],
    ]) {
      if (!pattern.test(gate)) {
        errors.push(`stage-quality-gate/SKILL.md: missing ${label}`);
      }
    }
  }

  for (const filePath of collectFiles(skillsRoot)) {
    const content = readFileSync(filePath, "utf8");
    const relativePath = path.relative(root, filePath);
    const placeholder = FORBIDDEN_PLACEHOLDERS.find((value) =>
      new RegExp(`\\b${value}\\b`).test(content)
    );
    if (placeholder) {
      errors.push(`${relativePath}: contains forbidden placeholder ${placeholder}`);
    }
    if (
      new RegExp(`/${"Users"}/[^/\\s]+`).test(content) ||
      new RegExp(`/${"home"}/[^/\\s]+`).test(content) ||
      new RegExp(`[A-Za-z]:\\\\${"Users"}\\\\[^\\\\\\s]+`).test(content)
    ) {
      errors.push(`${relativePath}: contains an absolute user path`);
    }
  }

  return errors;
}

function main() {
  const errors = validateSkills(process.cwd());
  if (errors.length > 0) {
    for (const error of errors) process.stderr.write(`${error}\n`);
    process.exitCode = 1;
    return;
  }
  process.stdout.write(`Validated ${Object.keys(SKILLS).length} skills.\n`);
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main();
}
