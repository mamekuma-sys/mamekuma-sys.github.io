import assert from "node:assert/strict";
import {
  cpSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import test from "node:test";
import { validateSkills } from "../scripts/validate-skills.mjs";

test("validates the three repository skill packages", () => {
  assert.deepEqual(validateSkills(process.cwd()), []);

  const result = spawnSync(
    process.execPath,
    [".agents/skills/stage-quality-gate/scripts/validate-skills.mjs"],
    { cwd: process.cwd(), encoding: "utf8" },
  );
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Validated 3 skills\./);
});

test("reports missing dimensions, references, metadata, and placeholders", () => {
  const fixtureRoot = path.join(
    process.cwd(),
    ".superpowers",
    "validate-skills-fixture",
  );
  const fixtureSkills = path.join(fixtureRoot, ".agents", "skills");
  rmSync(fixtureRoot, { recursive: true, force: true });
  mkdirSync(path.dirname(fixtureSkills), { recursive: true });
  cpSync(path.join(process.cwd(), ".agents", "skills"), fixtureSkills, {
    recursive: true,
  });

  try {
    const humanRubric = path.join(
      fixtureSkills,
      "human-editorial-review",
      "references",
      "rubric.md",
    );
    writeFileSync(
      humanRubric,
      readFileSync(humanRubric, "utf8").replace(
        "`user-value`",
        "`missing-user-value`",
      ),
    );

    const aiSkill = path.join(
      fixtureSkills,
      "ai-technical-review",
      "SKILL.md",
    );
    writeFileSync(
      aiSkill,
      readFileSync(aiSkill, "utf8")
        .replace(
          "description: Review a Medical AI Index Stage",
          `description: ${"x".repeat(501)}`,
        )
        .replace(
          "references/output-schema.md",
          "references/missing-schema.md",
        ),
    );

    const gateSkill = path.join(fixtureSkills, "stage-quality-gate", "SKILL.md");
    writeFileSync(
      gateSkill,
      `${readFileSync(gateSkill, "utf8")}\n${"FIX" + "ME"} /${"Users"}/example/private\n`,
    );

    const errors = validateSkills(fixtureRoot).join("\n");
    assert.match(errors, /user-value.*20/i);
    assert.match(errors, /description.*500/i);
    assert.match(errors, /missing-schema/i);
    assert.match(errors, new RegExp("FIX" + "ME", "i"));
    assert.match(errors, /absolute user path/i);
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
});

test("requires the approved frontmatter descriptions", () => {
  const fixtureRoot = path.join(
    process.cwd(),
    ".superpowers",
    "validate-description-fixture",
  );
  const fixtureSkills = path.join(fixtureRoot, ".agents", "skills");
  rmSync(fixtureRoot, { recursive: true, force: true });
  mkdirSync(path.dirname(fixtureSkills), { recursive: true });
  cpSync(path.join(process.cwd(), ".agents", "skills"), fixtureSkills, {
    recursive: true,
  });

  try {
    const humanSkill = path.join(
      fixtureSkills,
      "human-editorial-review",
      "SKILL.md",
    );
    writeFileSync(
      humanSkill,
      readFileSync(humanSkill, "utf8").replace(
        /^description:.*$/m,
        "description: A different description.",
      ),
    );
    assert.match(
      validateSkills(fixtureRoot).join("\n"),
      /approved description/i,
    );
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
});
