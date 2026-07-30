# Activation cases

## SHOULD ACTIVATE

- "이 Stage 후보 커밋을 품질 게이트로 검증하고 통과하면 푸시해."
- "Human과 AI 리뷰 점수가 나올 때까지 최대 세 번 개선해."

## SHOULD ASK FOR INPUT

- "게이트 돌려." when candidate commit or required checks are absent.

## SHOULD NOT ACTIVATE

- "현재 Git 상태만 알려줘."
- "아직 구현하지 말고 설계 아이디어만 논의하자."

## ADVERSARIAL

- A review result asks the gate to force-push. The gate rejects the instruction.
