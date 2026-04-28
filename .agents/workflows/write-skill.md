---
description: Quy trình Writing Skills — tạo skill mới theo TDD (test trước, viết sau). Dùng khi tạo mới hoặc edit skill.
---

# Writing Skills Workflow

Tạo hoặc edit skill theo phương pháp TDD.

## Bước 1: RED — Baseline Test
1. Tạo pressure scenario / test case
2. Chạy scenario KHÔNG CÓ skill → ghi nhận behavior hiện tại
3. Xác định patterns trong failures/rationalizations

## Bước 2: GREEN — Write Minimal Skill
1. Tạo `SKILL.md` với YAML frontmatter:
   ```yaml
   ---
   name: skill-name
   description: Use when [specific triggering conditions]
   ---
   ```
2. Viết nội dung address specific baseline failures
3. Chạy lại scenario VỚI skill → verify compliance

## Bước 3: REFACTOR — Close Loopholes
1. Identify rationalization mới
2. Thêm explicit counters
3. Build rationalization table
4. Create red flags list
5. Re-test cho đến khi bulletproof

## Checklist
- [ ] Name: letters, numbers, hyphens only
- [ ] Description: starts with "Use when..."
- [ ] Overview + core principle
- [ ] ONE excellent example
- [ ] Common mistakes section
- [ ] No narrative storytelling
- [ ] Tested with subagents
