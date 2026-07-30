# Human Editorial output schema

Write one UTF-8 JSON object and no prose. Use `reviewer: "human-editorial"` and all six canonical dimensions exactly once.

## Field contract

```json
{
  "schemaVersion": 1,
  "reviewer": "human-editorial",
  "stageId": "lowercase-stage-slug",
  "attempt": 1,
  "reviewedCandidateCommit": "7-to-64-lowercase-hexadecimal-git-id",
  "dimensions": [
    {
      "id": "canonical-dimension-id",
      "weight": 20,
      "rawScore": 4.5,
      "notApplicable": false,
      "notApplicableReason": null,
      "evidence": [
        {
          "path": "repository-relative/path.md",
          "line": 1,
          "detail": "Fresh, concrete observation."
        }
      ],
      "findings": []
    }
  ],
  "criticalFindings": [],
  "summary": "Simulated human editorial review: concise evidence-based verdict."
}
```

`attempt` is 1 through 3. Applicable raw scores are finite numbers from 0 through 5. A non-applicable dimension uses `rawScore: null`, `notApplicable: true`, and a non-empty reason. Every dimension requires evidence. A critical finding requires a unique `id`, non-empty `evidence`, `impact`, and `requiredFix`.

## Passing example

```json
{
  "schemaVersion": 1,
  "reviewer": "human-editorial",
  "stageId": "review-system-bootstrap",
  "attempt": 1,
  "reviewedCandidateCommit": "89abcdef0123456789abcdef0123456789abcdef",
  "dimensions": [
    {"id":"user-value","weight":20,"rawScore":4.5,"notApplicable":false,"notApplicableReason":null,"evidence":[{"path":"docs/review.md","line":1,"detail":"Purpose and next action are explicit."}],"findings":[]},
    {"id":"information-clarity","weight":20,"rawScore":4.5,"notApplicable":false,"notApplicableReason":null,"evidence":[{"path":"docs/review.md","line":8,"detail":"Sections follow the reader workflow."}],"findings":[]},
    {"id":"ux-accessibility","weight":20,"rawScore":4.5,"notApplicable":false,"notApplicableReason":null,"evidence":[{"path":"docs/review.md","line":14,"detail":"Keyboard and screen-reader checks are named."}],"findings":[]},
    {"id":"medical-trust","weight":20,"rawScore":4.5,"notApplicable":false,"notApplicableReason":null,"evidence":[{"path":"docs/review.md","line":20,"detail":"Medical claims and evidence states remain separate."}],"findings":[]},
    {"id":"brand-consistency","weight":10,"rawScore":4.5,"notApplicable":false,"notApplicableReason":null,"evidence":[{"path":"docs/review.md","line":25,"detail":"Approved brand terms are consistent."}],"findings":[]},
    {"id":"completeness","weight":10,"rawScore":4.5,"notApplicable":false,"notApplicableReason":null,"evidence":[{"path":"docs/review.md","line":30,"detail":"All Stage outputs are represented."}],"findings":[]}
  ],
  "criticalFindings": [],
  "summary": "Simulated human editorial review: 90-point passing evidence."
}
```

## Blocked example

```json
{
  "schemaVersion": 1,
  "reviewer": "human-editorial",
  "stageId": "article-draft",
  "attempt": 1,
  "reviewedCandidateCommit": "0123456789abcdef0123456789abcdef01234567",
  "dimensions": [
    {"id":"user-value","weight":20,"rawScore":4,"notApplicable":false,"notApplicableReason":null,"evidence":[{"path":"content/article.mdx","line":1,"detail":"The intended reader is clear."}],"findings":[]},
    {"id":"information-clarity","weight":20,"rawScore":4,"notApplicable":false,"notApplicableReason":null,"evidence":[{"path":"content/article.mdx","line":12,"detail":"The main sections are understandable."}],"findings":[]},
    {"id":"ux-accessibility","weight":20,"rawScore":4,"notApplicable":false,"notApplicableReason":null,"evidence":[{"path":"content/article.mdx","line":20,"detail":"Headings preserve navigation."}],"findings":[]},
    {"id":"medical-trust","weight":20,"rawScore":1,"notApplicable":false,"notApplicableReason":null,"evidence":[{"path":"content/article.mdx","line":33,"detail":"A benchmark is presented as a patient outcome."}],"findings":["Separate benchmark performance from clinical utility."]},
    {"id":"brand-consistency","weight":10,"rawScore":4,"notApplicable":false,"notApplicableReason":null,"evidence":[{"path":"content/article.mdx","line":5,"detail":"Editorial terminology is consistent."}],"findings":[]},
    {"id":"completeness","weight":10,"rawScore":3,"notApplicable":false,"notApplicableReason":null,"evidence":[{"path":"content/article.mdx","line":40,"detail":"The limitation section is incomplete."}],"findings":["Add the missing limitation."]}
  ],
  "criticalFindings": [
    {
      "id": "MED-001",
      "evidence": [{"path":"content/article.mdx","line":33,"detail":"The text equates a benchmark score with improved patient outcomes."}],
      "impact": "Readers may mistake technical performance for clinical benefit.",
      "requiredFix": "Separate the claims and provide appropriate clinical evidence."
    }
  ],
  "summary": "Simulated human editorial review: blocked by a medical-trust critical finding."
}
```
